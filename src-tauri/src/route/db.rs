use crate::conn::ConnectionManager;
use crate::err::CusError;
use redis::{self, FromRedisValue};
use serde::Deserialize;
use serde_json;
#[derive(Deserialize)]
struct DBSizeArgs {
    db: u8,
}

pub async fn dbsize<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: DBSizeArgs = serde_json::from_str(&payload)?;
    let value: redis::Value = manager
        .execute(cid, args.db, &mut redis::cmd("dbsize"))
        .await?;
    Ok(i64::from_redis_value(&value)?)
}
