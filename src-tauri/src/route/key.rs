use crate::{
    err::{self, CusError},
    redis_conn::{self},
};
use redis::{aio::ConnectionLike, FromRedisValue};
use redis::{cmd, Value};
use serde::{Deserialize, Serialize};

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
    extra_type: String,
}
impl Key {
    async fn new<T: ConnectionLike>(
        name: String,
        db: u8,
        cid: u32,
        conn: &mut T,
    ) -> Result<Key, CusError> {
        let mut key: Key = Key {
            name: name,
            types: "".into(),
            ttl: -2,
            data: String::from(""),
            connection_id: cid,
            db,
            memory: 0,
            length: 0,
            extra_type: String::from(""),
        };
        let types_value: Value = cmd("type").arg(&key.name).query_async(conn).await?;
        key.types = String::from_redis_value(&types_value)?;
        if !key.is_none() {
            key.get_ttl(conn).await?;
            key.get_memory(conn).await?;
            key.get_length(conn).await?;
        }
        Ok(key)
    }
    async fn get_memory<T: ConnectionLike>(&mut self, conn: &mut T) -> Result<(), CusError> {
        let memory_value: Value = cmd("memory")
            .arg("usage")
            .arg(&self.name)
            .arg(&["SAMPLES", "0"])
            .query_async(conn)
            .await?;
        self.memory = i64::from_redis_value(&memory_value)?;
        Ok(())
    }
    async fn get_ttl<T: ConnectionLike>(&mut self, conn: &mut T) -> Result<(), CusError> {
        let ttl_result: Value = cmd("ttl").arg(&self.name).query_async(conn).await?;
        self.ttl = i64::from_redis_value(&ttl_result)?;
        Ok(())
    }
    async fn get_string_value<T: ConnectionLike>(&mut self, conn: &mut T) -> Result<(), CusError> {
        let value: Value = redis::cmd("get").arg(&self.name).query_async(conn).await?;

        let v: Result<String, redis::RedisError> = String::from_redis_value(&value);
        match v {
            Ok(s) => self.data = s,
            Err(_) => {
                let i: Vec<u8> = Vec::from_redis_value(&value).unwrap();
                let mut data = String::from("");
                for v in i {
                    let bs = format!("{:b}", v);
                    data.push_str(bs.as_str());
                }
                self.extra_type = String::from("Binary");
                self.data = String::from(data);
            }
        }
        Ok(())
    }
    async fn get_length<T: ConnectionLike>(&mut self, conn: &mut T) -> Result<(), CusError> {
        let cmd = match &self.types[..] {
            "string" => "STRLEN",
            "hash" => "HLEN",
            "list" => "LLEN",
            "set" => "SCARD",
            "zset" => "ZCARD",
            _ => "",
        };
        if cmd != "" {
            let length_value: Value = redis::cmd(cmd).arg(&self.name).query_async(conn).await?;
            self.length = i64::from_redis_value(&length_value)?;
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
    count: i64,
    types: String,
}
#[derive(Serialize)]
pub struct ScanResp<T> {
    cursor: String,
    keys: Vec<T>,
}

pub async fn scan(payload: String, cid: u32) -> Result<ScanResp<String>, CusError> {
    let args: ScanArgs = serde_json::from_str(&payload)?;
    let mut connection = redis_conn::get_connection(cid, args.db).await?;
    let mut cmd = redis::cmd("scan");
    cmd.arg(&args.cursor)
        .arg(&["count", &args.count.to_string()]);

    if args.search != "" {
        let mut search = args.search.clone();
        search.insert_str(0, "*");
        search.push_str("*");
        cmd.arg(&["MATCH", &search]);
    }
    if args.types != "" {
        cmd.arg(&["TYPE", &args.types]);
    }
    let value = cmd.query_async(&mut connection).await?;
    return match value {
        Value::Bulk(s) => {
            let mut keys: Vec<String> = vec![];
            let cursor = String::from_redis_value(s.get(0).unwrap())?;
            let keys_vec = s.get(1);
            if let Some(s) = keys_vec {
                keys = Vec::from_redis_value(&s)?;
            };
            return Ok(ScanResp {
                cursor: cursor,
                keys: keys,
            });
        }
        _ => Err(err::new_normal()),
    };
}

#[derive(Deserialize)]
struct GetArgs {
    name: String,
    db: u8,
}
pub async fn get(payload: String, cid: u32) -> Result<Key, CusError> {
    let args: GetArgs = serde_json::from_str(&payload)?;
    let mut conn = redis_conn::get_connection(cid, args.db).await?;
    let mut key: Key = Key::new(args.name, args.db, cid, &mut conn).await?;
    if key.is_none() {
        return Err(CusError::App(format!("{} is not exist", &key.name)));
    }
    match &key.types[..] {
        "hash" => {}
        "string" => {
            key.get_string_value(&mut conn).await?;
        }
        _ => (),
    }
    Ok(key)
}

#[derive(Deserialize)]
struct DelArgs {
    names: Vec<String>,
    db: u8,
}
pub async fn del(payload: String, cid: u32) -> Result<i64, CusError> {
    let args: DelArgs = serde_json::from_str(&payload)?;
    let mut conn = redis_conn::get_connection(cid, args.db).await?;
    let value: Value = redis::cmd("del")
        .arg(&args.names)
        .query_async(&mut conn)
        .await?;
    Ok(i64::from_redis_value(&value)?)
}
#[derive(Deserialize)]
struct ExpireArgs {
    name: String,
    ttl: i64,
    db: u8,
}
pub async fn expire(payload: String, cid: u32) -> Result<i64, CusError> {
    let args: ExpireArgs = serde_json::from_str(&payload)?;
    let mut conn = redis_conn::get_connection(cid, args.db).await?;
    let value: Value = redis::cmd("expire")
        .arg(&args.name)
        .arg(args.ttl)
        .query_async(&mut conn)
        .await?;
    Ok(i64::from_redis_value(&value)?)
}

#[derive(Deserialize)]
struct RenameArgs {
    name: String,
    new_name: String,
    db: u8,
}

pub async fn rename(payload: String, cid: u32) -> Result<String, CusError> {
    let args: RenameArgs = serde_json::from_str(&payload)?;
    let mut conn = redis_conn::get_connection(cid, args.db).await?;
    let value: Value = redis::cmd("rename")
        .arg(&args.name)
        .arg(&args.new_name)
        .query_async(&mut conn)
        .await?;
    Ok(String::from_redis_value(&value)?)
}

#[derive(Deserialize)]
struct SetArgs {
    name: String,
    value: String,
    db: u8,
}

pub async fn set(payload: String, cid: u32) -> Result<String, CusError> {
    let args: SetArgs = serde_json::from_str(&payload)?;
    let mut conn = redis_conn::get_connection(cid, args.db).await?;
    let v: Value = redis::cmd("set")
        .arg(&args.name)
        .arg(&args.value)
        .query_async(&mut conn)
        .await?;
    Ok(String::from_redis_value(&v)?)
}

#[derive(Deserialize)]
struct AddArgs {
    name: String,
    types: String,
    db: u8,
}

pub async fn add(payload: String, cid: u32) -> Result<String, CusError> {
    let args: AddArgs = serde_json::from_str(&payload)?;
    let mut conn = redis_conn::get_connection(cid, args.db).await?;
    match args.types.as_str() {
        "string" => {
            let v: Value = redis::cmd("set")
                .arg(&args.name)
                .arg("Hello World")
                .query_async(&mut conn)
                .await?;
            return Ok(String::from_redis_value(&v)?);
        }
        "hash" => {
            let v: Value = redis::cmd("hset")
                .arg(&args.name)
                .arg("rust")
                .arg("Hello World")
                .query_async(&mut conn)
                .await?;
            return Ok(i64::from_redis_value(&v)?.to_string());
        }
        "set" => {
            let v: Value = redis::cmd("sadd")
                .arg(&args.name)
                .arg("rust")
                .query_async(&mut conn)
                .await?;
            return Ok(i64::from_redis_value(&v)?.to_string());
        }
        "list" => {
            let v: Value = redis::cmd("lpush")
                .arg(&args.name)
                .arg("Hello World")
                .query_async(&mut conn)
                .await?;
            return Ok(i64::from_redis_value(&v)?.to_string());
        }
        "zset" => {
            let v: Value = redis::cmd("zadd")
                .arg(&args.name)
                .arg("9999")
                .arg("rust")
                .query_async(&mut conn)
                .await?;
            return Ok(i64::from_redis_value(&v)?.to_string());
        }
        _ => {}
    }
    Err(err::new_normal())
}

#[derive(Deserialize)]
struct SetbitArgs {
    offset: i64,
    value: i64,
    db: u8,
    name: String,
}

pub async fn setbit(payload: String, cid: u32) -> Result<i64, CusError> {
    let args: SetbitArgs = serde_json::from_str(&payload)?;
    let mut conn = redis_conn::get_connection(cid, args.db).await?;
    let value: Value = redis::cmd("setbit")
        .arg(args.name)
        .arg(args.offset)
        .arg(args.value)
        .query_async(&mut conn)
        .await?;
    Ok(i64::from_redis_value(&value).unwrap())
}
