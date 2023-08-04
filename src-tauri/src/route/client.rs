use crate::{err::CusError, ConnectionManager};
use redis::{self, FromRedisValue};
use serde::Deserialize;

pub async fn list<'r>(
    _payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let value: redis::Value = manager
        .execute(cid, 0, redis::cmd("client").arg("list"))
        .await?;
    Ok(String::from_redis_value(&value)?)
}

#[derive(Deserialize)]
struct KillArgs {
    id: String,
}

pub async fn kill<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: KillArgs = serde_json::from_str(&payload)?;
    let value: redis::Value = manager
        .execute(
            cid,
            0,
            redis::cmd("CLIENT").arg("KILL").arg(&["id", &args.id]),
        )
        .await?;
    let count = i64::from_redis_value(&value)?;
    match count {
        0 => return Err(CusError::App(String::from("Client has been kill"))),
        _ => {
            return Ok(count);
        }
    }
}
