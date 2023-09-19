use crate::conn::ConnectionManager;
use crate::err::CusError;
use redis::{self};
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
    manager
        .execute(cid, &mut redis::cmd("dbsize"), Some(args.db))
        .await
}
