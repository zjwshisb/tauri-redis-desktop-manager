use crate::{
    connection::Manager,
    err::CusError,
    response::{Field, FieldValue},
};
use serde::Deserialize;

pub async fn get_database(
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<FieldValue, CusError> {
    let configs = manager.get_config(cid, "databases").await?;
    let databases = configs.into_iter().find(|s|s.field == "databases");
    if let Some(d) = databases {
        return Ok(d.value);
    }
    Ok(FieldValue::Nil)
}

pub async fn get_all(
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<Field>, CusError> {
   manager.get_config(cid, "*").await
}

#[derive(Deserialize)]
struct EditArgs {
    name: String,
    value: String,
}
pub async fn edit(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<String, CusError> {
    let args: EditArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("config")
                .arg("set")
                .arg(&args.name)
                .arg(&args.value),
            None,
        )
        .await
}

pub async fn rewrite(cid: u32, manager: tauri::State<'_, Manager>) -> Result<String, CusError> {
    manager
        .execute(cid, redis::cmd("config").arg("rewrite"), None)
        .await
}

pub async fn reset_stat(
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<String, CusError> {
    manager
        .execute(cid, redis::cmd("config").arg("resetstat"), None)
        .await
}
