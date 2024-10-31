use crate::{
    connection::{CValue, Manager},
    err::CusError,
    request,
};
use redis::{self};

pub async fn list(
    _payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    manager
        .execute(cid, redis::cmd("CLIENT").arg("LIST"), None)
        .await
}

pub async fn kill(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<i64, CusError> {
    let args: request::IdArgs<String> = serde_json::from_str(&payload)?;
    let count: i64 = manager
        .execute(
            cid,
            redis::cmd("CLIENT").arg("KILL").arg(&["id", &args.id]),
            None,
        )
        .await?;
    match count {
        0 => Err(CusError::build("Client has been kill")),
        _ => Ok(count),
    }
}
