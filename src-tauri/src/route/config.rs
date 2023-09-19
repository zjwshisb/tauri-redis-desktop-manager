use crate::{
    conn::ConnectionManager,
    err::CusError,
    response::{Field, FieldValue},
};
use serde::Deserialize;

pub async fn get_database<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<FieldValue, CusError> {
    let configs = manager.get_config(cid, "databases").await?;
    let databases = Field::first("databases", &configs);
    if let Some(d) = databases {
        return Ok(d.value);
    }
    return Ok(FieldValue::Nil);
}

pub async fn get_all<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<Field>, CusError> {
    let value = manager.get_config(cid, "*").await?;
    Ok(value)
}

#[derive(Deserialize)]
struct EditArgs {
    name: String,
    value: String,
}
pub async fn edit<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
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

pub async fn rewrite<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    manager
        .execute(cid, redis::cmd("config").arg("rewrite"), None)
        .await
}

pub async fn reset_stat<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    manager
        .execute(cid, redis::cmd("config").arg("resetstat"), None)
        .await
}
