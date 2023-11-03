use redis::Value;
use serde::Deserialize;

use crate::{
    connection::Manager,
    err::CusError,
    request::{self, RangeArgs},
};

pub async fn lrange<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<Vec<String>, CusError> {
    let args: RangeArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("lrange")
                .arg(&args.name)
                .arg(&args.start)
                .arg(&args.stop),
            Some(args.db),
        )
        .await
}

#[derive(Deserialize)]
struct LSetArgs {
    name: String,
    index: i64,
    value: String,
    db: u8,
}
pub async fn lset<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: LSetArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("lset")
                .arg(&args.name)
                .arg(args.index)
                .arg(&args.value),
            Some(args.db),
        )
        .await
}

pub async fn ltrim<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: RangeArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("ltrim")
                .arg(&args.name)
                .arg(args.start)
                .arg(args.stop),
            Some(args.db),
        )
        .await
}

#[derive(Deserialize)]
struct InsertArgs {
    name: String,
    db: u8,
    types: String,
    value: String,
    pivot: String,
}
pub async fn linsert<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: InsertArgs = serde_json::from_str(&payload)?;
    let value: i64 = manager
        .execute(
            cid,
            redis::cmd("linsert")
                .arg(&args.name)
                .arg(&args.types)
                .arg(&args.pivot)
                .arg(&args.value),
            Some(args.db),
        )
        .await?;
    match value {
        0 => return Err(CusError::key_not_exists()),
        -1 => return Err(CusError::App(String::from("the pivot wasn't found."))),
        _ => return Ok(value),
    }
}

pub async fn lpush<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: request::CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    let value: i64 = manager
        .execute(
            cid,
            redis::cmd("lpush").arg(&args.name).arg(&args.value),
            Some(args.db),
        )
        .await?;
    match value {
        0 => return Err(CusError::key_not_exists()),
        _ => return Ok(value),
    }
}

pub async fn lpop<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: request::NameArgs = serde_json::from_str(&payload)?;
    let value = manager
        .execute(cid, redis::cmd("lpop").arg(&args.name), Some(args.db))
        .await?;
    match value {
        Value::Nil => return Err(CusError::key_not_exists()),
        _ => return Ok(String::from("OK")),
    }
}

pub async fn rpush<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: request::CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    let value: i64 = manager
        .execute(
            cid,
            redis::cmd("rpush").arg(&args.name).arg(&args.value),
            Some(args.db),
        )
        .await?;
    match value {
        0 => return Err(CusError::key_not_exists()),
        _ => return Ok(value),
    }
}

pub async fn rpop<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: request::NameArgs = serde_json::from_str(&payload)?;
    let value = manager
        .execute(cid, redis::cmd("rpop").arg(&args.name), Some(args.db))
        .await?;
    match value {
        Value::Nil => return Err(CusError::key_not_exists()),
        _ => return Ok(String::from("OK")),
    }
}
