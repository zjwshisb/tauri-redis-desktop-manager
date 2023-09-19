use serde::Deserialize;

use crate::{err::CusError, ConnectionManager};

#[derive(Deserialize)]
struct LRangeArgs {
    name: String,
    start: i64,
    stop: i64,
    db: u8,
}

pub async fn lrange<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<String>, CusError> {
    let args: LRangeArgs = serde_json::from_str(&payload)?;
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
    manager: tauri::State<'r, ConnectionManager>,
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
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let args: LRangeArgs = serde_json::from_str(&payload)?;
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
    manager: tauri::State<'r, ConnectionManager>,
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
        0 => return Err(CusError::App(String::from("key not exist"))),
        -1 => return Err(CusError::App(String::from("the pivot wasn't found."))),
        _ => return Ok(value),
    }
}
