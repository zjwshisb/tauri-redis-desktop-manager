use redis::{Value, cmd, RedisError};
use serde::{Serialize, Deserialize};
use crate::{err::CusError, redis_conn};



#[derive(Debug)]
pub enum CusRedisValue {
    STRING(String),
    NONE()
}

impl serde::Serialize for CusRedisValue {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
      S: serde::ser::Serializer,
    {
      return match &self {
        CusRedisValue::STRING(s) => {
            serializer.serialize_str(s)
        }
        _ => {
            serializer.serialize_str("")
        }
      }
  
    }
  }



#[derive(Serialize, Debug)]
pub struct Key {
    name: String,
    types: String,
    ttl: i64,
    data: CusRedisValue,
    connection_id: u32,
    db: u8,
    memory: i64,
}
impl Key {
    fn new(name: String, db: u8, cid: u32, conn: &mut redis::Connection) -> Result<Key, RedisError> {
        let mut key: Key = Key{
            name: name,
            types: "".into(),
            ttl: -2,
            data: CusRedisValue::NONE(), 
            connection_id: cid,
            db,
            memory: 0
        };
        let types_value: Value =  cmd("type").arg(&key.name).query(conn)?;
        if let Value::Status(types) = types_value {
            key.types = types
        }
        if !key.is_none() {
            let ttl_value : Value = cmd("ttl").arg(&key.name).query(conn)?;
            if let Value::Int(ttl) = ttl_value {
                key.ttl = ttl
            }
            let memory_value: Value = cmd("memory").arg("usage")
            .arg(&key.name)
            .arg(&["SAMPLES", "0"]) 
            .query(conn)?;
            if let Value::Int(memory) = memory_value {
                key.memory = memory
            }
        }
        Ok(key)
    }
    fn get_string_value(& mut self, conn: & mut redis::Connection) {
        let value: redis::Value = cmd("get").arg(&self.name).query(conn).unwrap();
        dbg!(&value);
        if let redis::Value::Data(s) = value {
            let v = std::str::from_utf8(&s).unwrap();
            dbg!(&v);
            self.data  = CusRedisValue::STRING(String::from(v));            
        }
    }
    fn is_none(&self) -> bool {
        self.types == "none"
    }
}


#[derive(Deserialize)]
struct ScanArgs {
    cursor: String,
    search: String,
    db: u8
}
#[derive(Serialize)]
pub struct ScanResp<T> {
    cursor: String,
    keys: Vec<T>
}

pub fn scan(payload : &str, cid: u32) -> Result<ScanResp<String>, CusError>{
    let args: ScanArgs = serde_json::from_str(&payload)?;

    let mut connection = redis_conn::get_connection(cid, args.db)?;

 
    let mut cmd = redis::cmd("scan");
    cmd.arg(&args.cursor).arg(&["count", "100"]);
    if args.search != "" {
        let mut search = args.search.clone();
        search.insert_str(0, "*");
        search.push_str("*");
        cmd.arg(&["MATCH", &search]);
    }
    let value = cmd.query(& mut connection)?;
    return match value {
       Value::Bulk(s) => {
            let mut keys : Vec<String> = vec![];
            let cursor_value = s.get(0).unwrap();
            let mut cursor   = String::from("0");
            if let Value::Data(vv) = cursor_value {
                cursor = std::str::from_utf8(&vv).unwrap().into()
            }
            let keys_vec = s.get(1);
            if let Some(s)  = keys_vec {
                if let Value::Bulk(s)  = s {
                    for v in s {
                        if let Value::Data(vv)  = v {
                            keys.push(std::str::from_utf8(vv).unwrap().into());
                        }
                      }
                };
            };
            return Ok(ScanResp{
                cursor: cursor,
                keys: keys
            });
       }
       _ => {
         Err(CusError::App("err".into()))
       }
    }
}


#[derive(Deserialize)]
struct GetArgs{
    name: String,
    db: u8
}
pub fn get(payload : &str, cid: u32) -> Result<Key, CusError>{
    let args: GetArgs = serde_json::from_str(&payload)?;
    let mut conn: redis::Connection = redis_conn::get_connection(cid, args.db)?;
    let _ : redis::Value = redis::cmd("select").arg(args.db).query(&mut conn)?;
    let mut key: Key = Key::new(args.name, args.db, cid , &mut conn)?;
    if key.is_none() {
        return Err(CusError::App(format!("{} is not exist", &key.name)));
    } 
    match &key.types[..] {
        "hash" => {
        }
        "string" => {
            key.get_string_value(&mut conn);
        }
        _ => ()
    }
    Ok(key)
}

#[derive(Deserialize)]
struct  DelArgs {
    names: Vec<String>,
    db: u8
}
pub fn del(payload : &str, cid: u32) ->Result<i64, CusError> {
    let args: DelArgs = serde_json::from_str(&payload)?;
    let mut conn: redis::Connection = redis_conn::get_connection(cid, args.db)?;
    let value : Value = redis::cmd("del").arg(&args.names).query(&mut conn)?;
    if let Value::Int(c) = value {
        return Ok(c);
    }
    Err(CusError::App(String::from("something go wrong")))
}
#[derive(Deserialize)]
struct  ExpireArgs {
    name: String,
    ttl: i64,
    db: u8
}
pub fn expire(payload : &str, cid: u32) ->Result<i64, CusError> {
    let args: ExpireArgs = serde_json::from_str(&payload)?;
    let mut conn: redis::Connection = redis_conn::get_connection(cid, args.db)?;
    let value : Value = redis::cmd("expire")
    .arg(&args.name)
    .arg(args.ttl)
    .query(&mut conn)?;
    if let Value::Int(r) = value {
        match r {
           1 => {
            return Ok(r);
           }
           0 => {
            return Err(CusError::App(String::from("invalid args")));
           }
           _ => {}
        }
    }
    Err(CusError::App(String::from("something go wrong")))
}

#[derive(Deserialize)]
struct RenameArgs {
    name: String,
    new_name: String,
    db: u8
}

pub fn rename(payload : &str, cid: u32) ->Result<String, CusError> {
    let args: RenameArgs = serde_json::from_str(&payload)?;
    let mut conn: redis::Connection = redis_conn::get_connection(cid, args.db)?;
    let value : Value = redis::cmd("rename")
    .arg(&args.name)
    .arg(&args.new_name)
    .query(&mut conn)?;
    if let Value::Okay = value {
       return Ok(String::from("OK"));
    }
    Err(CusError::App(String::from("something go wrong")))
}
