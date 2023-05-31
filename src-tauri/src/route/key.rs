use redis::{Value, cmd, RedisError, Commands};
use serde::{Serialize, Deserialize};
use crate::{err::{CusError, self}, redis_conn};







#[derive(Serialize, Debug)]
pub struct Key {
    name: String,
    types: String,
    ttl: i64,
    data: String,
    connection_id: u32,
    db: u8,
    memory: i64,
    length: i64,
    extra_type: String
}
impl Key {
    fn new(name: String, db: u8, cid: u32, conn: &mut redis::Connection) -> Result<Key, CusError> {
        let mut key: Key = Key{
            name: name,
            types: "".into(),
            ttl: -2,
            data: String::from(""), 
            connection_id: cid,
            db,
            memory: 0,
            length: 0,
            extra_type: String::from("")
        };
        let types_value: Value =  cmd("type").arg(&key.name).query(conn)?;
        if let Value::Status(types) = types_value {
            key.types = types
        }
        if !key.is_none() {
            key.get_ttl(conn)?;
            key.get_memory(conn)?;
            key.get_length(conn)?;
        }
        Ok(key)
    }
    fn get_memory(&mut self, conn: &mut redis::Connection) -> Result<(), CusError>  {
        let memory_value: Value = cmd("memory").arg("usage")
        .arg(&self.name)
        .arg(&["SAMPLES", "0"]) 
        .query(conn)?;
        if let Value::Int(memory) = memory_value {
            self.memory = memory
        }
        Ok(())
    }
    fn get_ttl(&mut self, conn: &mut redis::Connection) -> Result<(), CusError> {
        self.ttl = conn.ttl(&self.name).unwrap();
        Ok(())
    }
    fn get_string_value(& mut self, conn: & mut redis::Connection)  {
        let s: Vec<u8> = conn.get(&self.name).unwrap();
        let utf8_result = std::str::from_utf8(&s);
        if let Ok(s) = utf8_result {
            self.data  = String::from(s);    
        } else {
            let mut data = String::from("");
            for v in s {
               let bs = format!("{:b}", v);
               data.push_str(bs.as_str());
            }
            self.extra_type = String::from("Binary");
            self.data = String::from(data);
        }

    }
    fn get_length(&mut self, conn : & mut redis::Connection) -> Result<(), CusError> {
        let cmd = match &self.types[..] {
            "string" => {
                "STRLEN"
            }
            "hash" => {
               "HLEN"
            }
            "list" => {
                "LLEN"
            },
            "set" => {
                "SCARD"
            }
            "zset" => {
                "ZCARD"
            }
            _ => ""
        };
        if cmd != "" {
            let length_value: Value = redis::cmd(cmd).arg(&self.name).query(conn)?;
            if let Value::Int(length) = length_value {
                self.length = length
            }
        }
        Ok(())
    }
    fn is_none(&self) -> bool {
        self.types == "none"
    }
}


#[derive(Deserialize)]
struct ScanArgs {
    cursor: String,
    search: String,
    db: u8,
    count: i64
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
    cmd.arg(&args.cursor).arg(&["count", &args.count.to_string()]);
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
         Err(err::new_normal())
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
    Err(err::new_normal())
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
    Err(err::new_normal())
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
    Err(err::new_normal())
}

#[derive(Deserialize)]
struct SetArgs  {
    name: String,
    value: String,
    db: u8
}


pub fn set(payload : &str, cid: u32) ->  Result<String, CusError>{
    let args: SetArgs = serde_json::from_str(payload)?;
    let mut conn: redis::Connection = redis_conn::get_connection(cid, args.db)?;
    let v = conn.set(args.name, args.value)?;
    if let Value::Okay = v {
        return Ok(String::from("OK"))
    }
    Err(err::new_normal())
}

#[derive(Deserialize)]
struct AddArgs {
    name: String,
    types: String,
    db: u8
}

pub fn add(payload: &str, cid: u32) -> Result<String, CusError> {
    let args: AddArgs = serde_json::from_str(payload)?;
    let mut conn: redis::Connection = redis_conn::get_connection(cid, args.db)?;
    match &args.types[..] {
        "string" => {

        }
        "hash" => {

        }
        "set" => {

        }
        "list" => {

        }
        "szet" => {
            
        }
        _ => {

        }
    }
    Err(err::new_normal())
}