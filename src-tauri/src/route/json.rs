use crate::err::CusError;
use crate::ConnectionManager;
use redis::{FromRedisValue, Value};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct SetArgs {
    name: String,
    path: String,
    value: String,
    db: Option<u8>,
}

pub async fn set<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let args: SetArgs = serde_json::from_str(&payload)?;
    let v: Value = manager
        .execute(
            cid,
            redis::cmd("JSON.SET")
                .arg(args.name)
                .arg(args.path)
                .arg(args.value),
            args.db,
        )
        .await?;
    match v {
        Value::Nil => {
            return Err(CusError::build("NX or XX conditions were not met"));
        }
        _ => return Ok(String::from_redis_value(&v)?),
    }
}
