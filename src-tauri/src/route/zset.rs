use crate::{
    err::{self, CusError},
    redis_conn,
};
use redis::{FromRedisValue, Value};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
struct ZScanArgs {
    cursor: String,
    name: String,
    search: String,
    db: u8,
    count: i64,
}

#[derive(Serialize)]
struct ScoreField {
    value: String,
    score: String,
}

#[derive(Serialize)]
pub struct ZScanResp {
    cursor: String,
    fields: Vec<ScoreField>,
}

pub async fn zscan(payload: String, cid: u32) -> Result<ZScanResp, CusError> {
    let args: ZScanArgs = serde_json::from_str(&payload)?;
    let mut conn = redis_conn::get_connection(cid, args.db).await?;
    let mut cmd = redis::cmd("zscan");
    cmd.arg(String::from(args.name))
        .arg(args.cursor)
        .arg(&["COUNT", args.count.to_string().as_str()]);
    if args.search != "" {
        cmd.arg(&["MATCH", &format!("*{}*", args.search)]);
    }
    let values: redis::Value = cmd.query_async(&mut conn).await?;
    if let Value::Bulk(s) = values {
        let cursor = String::from_redis_value(s.get(0).unwrap())?;
        let mut fields: Vec<ScoreField> = vec![];
        let keys_vec = s.get(1);
        if let Some(s) = keys_vec {
            let vec = Vec::<String>::from_redis_value(s)?;
            let length = vec.len();
            let mut current: usize = 0;
            while current < length {
                let mut field: ScoreField = ScoreField {
                    score: String::from(""),
                    value: String::from(""),
                };
                field.value = vec.get(current).unwrap().clone();
                field.score = vec.get(current + 1).unwrap().clone();
                current = current + 2;
                fields.push(field);
            }
        };
        Ok(ZScanResp {
            cursor: cursor,
            fields: fields,
        })
    } else {
        Err(err::new_normal())
    }
}

#[derive(Deserialize)]
struct ZRemArgs {
    name: String,
    db: u8,
    value: String,
}

pub async fn zrem(payload: String, cid: u32) -> Result<i64, CusError> {
    let args: ZRemArgs = serde_json::from_str(&payload)?;
    let mut conn = redis_conn::get_connection(cid, args.db).await?;
    let v: redis::Value = redis::cmd("zrem")
        .arg(args.name)
        .arg(args.value)
        .query_async(&mut conn)
        .await?;
    Ok(i64::from_redis_value(&v)?)
}

#[derive(Deserialize)]
struct ZAddArgs {
    name: String,
    value: String,
    score: f64,
    db: u8,
}

pub async fn zadd(payload: String, cid: u32) -> Result<i64, CusError> {
    let args: ZAddArgs = serde_json::from_str(&payload)?;
    let mut conn = redis_conn::get_connection(cid, args.db).await?;
    let v: redis::Value = redis::cmd("zadd")
        .arg(args.name)
        .arg(args.score)
        .arg(args.value)
        .query_async(&mut conn)
        .await?;
    Ok(i64::from_redis_value(&v)?)
}
