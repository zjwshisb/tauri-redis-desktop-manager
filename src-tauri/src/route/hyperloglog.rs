use crate::connection::Manager;
use crate::err::CusError;
use crate::request::{CommonValueArgs, NameArgs};

pub async fn pfcount(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<i64, CusError> {
    let args: NameArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(cid, redis::cmd("PFCOUNT").arg(args.name), args.db)
        .await
}

pub async fn pfadd(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("PFADD").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}
