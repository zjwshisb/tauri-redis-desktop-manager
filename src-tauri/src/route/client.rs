use crate::{connection::Manager, err::CusError, request};
use redis::{self};

pub async fn list<'r>(
    _payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    manager
        .execute(cid, redis::cmd("client").arg("list"), None)
        .await
}

pub async fn kill<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
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
        0 => return Err(CusError::build("Client has been kill")),
        _ => {
            return Ok(count);
        }
    }
}
