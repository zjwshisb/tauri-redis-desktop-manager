use crate::conn::ConnectionManager;
use crate::err;
use crate::err::CusError;
use crate::response::Field;
use redis::{FromRedisValue, Value};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct HScanArgs {
    name: String,
    cursor: String,
    db: u8,
    count: i64,
    search: Option<String>,
}
#[derive(Serialize)]
pub struct HScanResp {
    cursor: String,
    fields: Vec<Field>,
}

pub async fn hscan<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<HScanResp, CusError> {
    let args: HScanArgs = serde_json::from_str(&payload)?;
    let mut cmd: redis::Cmd = redis::cmd("hscan");
    cmd.arg(args.name)
        .arg(args.cursor)
        .arg(&["COUNT", &args.count.to_string()]);
    if let Some(search) = args.search {
        cmd.arg(&["MATCH", format!("*{}*", search).as_str()]);
    }

    let value = manager.execute(cid, args.db, &mut cmd).await?;
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
pub async fn hset<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: HSetArgs = serde_json::from_str(&payload)?;
    let value = manager
        .execute(
            cid,
            args.db,
            redis::cmd("hset")
                .arg(&args.name)
                .arg(&[args.field, args.value]),
        )
        .await?;
    Ok(i64::from_redis_value(&value)?)
}
#[derive(Deserialize)]
struct HDelArgs {
    name: String,
    fields: Vec<String>,
    db: u8,
}

pub async fn hdel<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: HDelArgs = serde_json::from_str(&payload)?;
    let value: Value = manager
        .execute(
            cid,
            args.db,
            redis::cmd("hdel").arg(&args.name).arg(&args.fields),
        )
        .await?;
    Ok(i64::from_redis_value(&value)?)
}
