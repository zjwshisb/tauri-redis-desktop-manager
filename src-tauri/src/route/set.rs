use crate::conn::ConnectionManager;
use crate::err::{self, CusError};
use redis::{FromRedisValue, Value};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct SScanArgs {
    cursor: String,
    name: String,
    search: String,
    db: u8,
    count: i64,
}
#[derive(Serialize)]
pub struct SScanResp {
    cursor: String,
    fields: Vec<String>,
}

pub async fn sscan<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<SScanResp, CusError> {
    let args: SScanArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("sscan");
    cmd.arg(&args.name)
        .arg(&args.cursor)
        .arg(&["COUNT", &args.count.to_string()]);
    if args.search != "" {
        cmd.arg(&["MATCH", &format!("*{}*", args.search)]);
    }
    let values = manager.execute(cid, args.db, &mut cmd).await?;
    if let Value::Bulk(s) = values {
        let cursor = String::from_redis_value(s.get(0).unwrap())?;
        let mut fields: Vec<String> = vec![];
        let keys_vec = s.get(1);
        if let Some(s) = keys_vec {
            fields = Vec::<String>::from_redis_value(&s)?;
        };
        return Ok(SScanResp {
            cursor: cursor,
            fields: fields,
        });
    }
    Err(err::new_normal())
}

#[derive(Deserialize)]
struct SAddArgs {
    name: String,
    db: u8,
    value: String,
}

pub async fn sadd<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: SAddArgs = serde_json::from_str(&payload)?;
    let value = manager
        .execute(
            cid,
            args.db,
            redis::cmd("sadd").arg(args.name).arg(args.value),
        )
        .await?;
    if let Value::Int(v) = value {
        match v {
            0 => {
                return Err(CusError::App(String::from("value already exists in Set")));
            }
            _ => {
                return Ok(v);
            }
        }
    }
    return Err(err::new_normal());
}

#[derive(Deserialize)]
struct SRemArgs {
    name: String,
    db: u8,
    value: String,
}

pub async fn srem<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: SRemArgs = serde_json::from_str(payload.as_str())?;
    let value = manager
        .execute(
            cid,
            args.db,
            redis::cmd("srem").arg(args.name).arg(args.value),
        )
        .await?;
    if let Value::Int(v) = value {
        match v {
            0 => {
                return Err(CusError::App(String::from("value not exists in Set")));
            }
            _ => {
                return Ok(v);
            }
        }
    }
    return Err(err::new_normal());
}
