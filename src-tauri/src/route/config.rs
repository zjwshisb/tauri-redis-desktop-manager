use std::collections::HashMap;

use crate::{
    conn::ConnectionManager,
    err::{self, CusError},
};
use redis::FromRedisValue;
use serde::Deserialize;

pub async fn get_database<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let value = manager.get_config(cid, "databases").await?;
    if let Some(v) = value.get("databases") {
        return Ok(v.clone());
    }
    return Err(err::new_normal());
}

pub async fn get_all<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<HashMap<String, String>, CusError> {
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
    let v = manager
        .execute(
            cid,
            0,
            redis::cmd("config")
                .arg("set")
                .arg(&args.name)
                .arg(&args.value),
        )
        .await?;
    Ok(String::from_redis_value(&v)?)
}

pub async fn rewrite<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let v = manager
        .execute(cid, 0, redis::cmd("config").arg("rewrite"))
        .await?;
    Ok(String::from_redis_value(&v)?)
}

pub async fn reset_stat<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let v = manager
        .execute(cid, 0, redis::cmd("config").arg("resetstat"))
        .await?;
    Ok(String::from_redis_value(&v)?)
}
