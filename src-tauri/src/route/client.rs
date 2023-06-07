use crate::{err::CusError, redis_conn};
use redis::{self, FromRedisValue};
use serde::Deserialize;

pub async fn list(_payload: String, cid: u32) -> Result<String, CusError> {
    let mut conn = redis_conn::get_connection(cid, 0).await?;
    let value: redis::Value = redis::cmd("client")
        .arg("list")
        .query_async(&mut conn)
        .await?;
    Ok(String::from_redis_value(&value)?)
}

#[derive(Deserialize)]
struct KillArgs {
    id: String,
}

pub async fn kill(payload: String, cid: u32) -> Result<i64, CusError> {
    let args: KillArgs = serde_json::from_str(&payload)?;
    let mut conn = redis_conn::get_connection(cid, 0).await?;
    let value: redis::Value = redis::cmd("CLIENT")
        .arg("KILL")
        .arg(&["id", &args.id])
        .query_async(&mut conn)
        .await?;
    let count = i64::from_redis_value(&value)?;
    match count {
        0 => return Err(CusError::App(String::from("Client has been kill"))),
        _ => {
            return Ok(count);
        }
    }
}
