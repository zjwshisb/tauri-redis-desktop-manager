use crate::response::ScoreField;
use crate::{
    err::{self, CusError},
    ConnectionManager,
};
use redis::{FromRedisValue, Value};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
struct ZScanArgs {
    cursor: String,
    name: String,
    search: Option<String>,
    db: u8,
    count: i64,
}

#[derive(Serialize)]
pub struct ZScanResp {
    cursor: String,
    fields: Vec<ScoreField>,
}

pub async fn zscan<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<ZScanResp, CusError> {
    let args: ZScanArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("zscan");
    cmd.arg(String::from(args.name))
        .arg(args.cursor)
        .arg(&["COUNT", args.count.to_string().as_str()]);
    if let Some(search) = args.search {
        cmd.arg(&["MATCH", &format!("*{}*", search)]);
    }
    let values = manager.execute(cid, args.db, &mut cmd).await?;
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

pub async fn zrem<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: ZRemArgs = serde_json::from_str(&payload)?;
    let v = manager
        .execute(
            cid,
            args.db,
            redis::cmd("zrem").arg(args.name).arg(args.value),
        )
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

pub async fn zadd<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: ZAddArgs = serde_json::from_str(&payload)?;
    let v = manager
        .execute(
            cid,
            args.db,
            redis::cmd("zadd")
                .arg(args.name)
                .arg(args.score)
                .arg(args.value),
        )
        .await?;
    Ok(i64::from_redis_value(&v)?)
}
