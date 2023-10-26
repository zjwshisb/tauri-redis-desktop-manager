use crate::{
    err::CusError,
    request::{CommonValueArgs, NameArgs},
    response::Field,
    ConnectionManager,
};
use redis::{cmd, Value};
use serde::Deserialize;

pub async fn info<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<Field>, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    let values: Vec<Value> = manager
        .execute(cid, cmd("BF.INFO").arg(args.name), Some(args.db))
        .await?;
    Ok(Field::build_vec(&values)?)
}

#[derive(Deserialize)]
struct ReserveArgs {
    name: String,
    db: u8,
    error_rate: String,
    capacity: i64,
    expansion: Option<i64>,
    nonscaling: Option<bool>,
}

pub async fn reserve<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let args: ReserveArgs = serde_json::from_str(&payload)?;
    let mut cmd = cmd("BF.RESERVE");
    cmd.arg(args.name).arg(args.error_rate).arg(args.capacity);
    if let Some(v) = args.expansion {
        cmd.arg(("EXPANSION", v));
    }
    if let Some(v) = args.nonscaling {
        if v {
            cmd.arg("NONSCALING");
        }
    }
    let value: String = manager.execute(cid, &mut cmd, Some(args.db)).await?;
    Ok(value)
}

pub async fn madd<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<i64>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;

    let value: Vec<i64> = manager
        .execute(
            cid,
            cmd("BF.MADD").arg(args.name).arg(args.value),
            Some(args.db),
        )
        .await?;
    Ok(value)
}

pub async fn exists<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<String> = serde_json::from_str(&payload)?;

    let value: i64 = manager
        .execute(
            cid,
            cmd("BF.EXISTS").arg(args.name).arg(args.value),
            Some(args.db),
        )
        .await?;
    Ok(value)
}
