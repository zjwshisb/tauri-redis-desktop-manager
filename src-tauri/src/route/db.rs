use crate::connection::{Manager};
use crate::err::CusError;
use redis::{self};
use serde::Deserialize;
use serde_json;
#[derive(Deserialize)]
struct DBSizeArgs {
    db: u8,
}

pub async fn dbsize(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<i64, CusError> {
    let args: DBSizeArgs = serde_json::from_str(&payload)?;
    manager
        .execute(cid, &mut redis::cmd("dbsize"), Some(args.db))
        .await
}

pub async fn flush(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<String, CusError> {
    let args: DBSizeArgs = serde_json::from_str(&payload)?;
    manager
        .execute(cid, &mut redis::cmd("FLUSHDB"), Some(args.db))
        .await
}
