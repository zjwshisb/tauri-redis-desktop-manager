use crate::conn::ConnectionManager;
use crate::err::CusError;
use crate::request::{CommonValueArgs, NameArgs};

pub async fn pfcount<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: NameArgs<Vec<String>> = serde_json::from_str(&payload)?;
    let value: i64 = manager
        .execute(cid, redis::cmd("PFCOUNT").arg(args.name), Some(args.db))
        .await?;
    Ok(value)
}

pub async fn pfadd<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    let value: i64 = manager
        .execute(
            cid,
            redis::cmd("PFADD").arg(args.name).arg(args.value),
            Some(args.db),
        )
        .await?;
    Ok(value)
}
