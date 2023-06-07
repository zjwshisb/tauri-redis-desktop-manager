use crate::err;
use crate::model::Field;
use crate::{err::CusError, redis_conn};
use redis::{FromRedisValue, Value};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct HScanArgs {
    name: String,
    cursor: String,
    db: u8,
    count: i64,
    search: String,
}
#[derive(Serialize)]
pub struct HScanResp {
    cursor: String,
    fields: Vec<Field>,
}

pub async fn hscan(payload: String, cid: u32) -> Result<HScanResp, CusError> {
    let args: HScanArgs = serde_json::from_str(&payload)?;
    let mut connection = redis_conn::get_connection(cid, args.db).await?;
    let mut cmd: redis::Cmd = redis::cmd("hscan");
    cmd.arg(args.name)
        .arg(args.cursor)
        .arg(&["COUNT", &args.count.to_string()]);
    if args.search != "" {
        cmd.arg(&["MATCH", format!("*{}*", args.search.as_str()).as_str()]);
    }
    let value = cmd.query_async(&mut connection).await?;
    if let Value::Bulk(s) = value {
        let cursor = String::from_redis_value(s.get(0).unwrap())?;
        let mut fields: Vec<Field> = vec![];
        let keys_vec = s.get(1);
        if let Some(s) = keys_vec {
            let vec = Vec::<String>::from_redis_value(&s)?;
            let length = vec.len();
            let mut current: usize = 0;
            while current < length {
                fields.push(Field {
                    name: vec.get(current).unwrap().clone(),
                    value: vec.get(current + 1).unwrap().clone(),
                });
                current = current + 2;
            }
        };
        Ok(HScanResp { cursor, fields })
    } else {
        Err(err::new_normal())
    }
}

#[derive(Deserialize)]
struct HSetArgs {
    name: String,
    field: String,
    value: String,
    db: u8,
}
pub async fn hset(payload: String, cid: u32) -> Result<i64, CusError> {
    let args: HSetArgs = serde_json::from_str(&payload)?;
    let mut connection = redis_conn::get_connection(cid, args.db).await?;
    let value: Value = redis::cmd("hset")
        .arg(&args.name)
        .arg(&[args.field, args.value])
        .query_async(&mut connection)
        .await?;
    Ok(i64::from_redis_value(&value)?)
}
#[derive(Deserialize)]
struct HDelArgs {
    name: String,
    fields: Vec<String>,
    db: u8,
}

pub async fn hdel(payload: String, cid: u32) -> Result<i64, CusError> {
    let args: HDelArgs = serde_json::from_str(&payload)?;
    let mut connection = redis_conn::get_connection(cid, args.db).await?;
    let value: Value = redis::cmd("hdel")
        .arg(&args.name)
        .arg(&args.fields)
        .query_async(&mut connection)
        .await?;
    Ok(i64::from_redis_value(&value)?)
}
