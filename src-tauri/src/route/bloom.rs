use crate::{
    connection::Manager,
    err::CusError,
    request::{CommonValueArgs, NameArgs},
    response::Field,
    response
};
use redis::{cmd, Value};
use serde::Deserialize;

pub async fn info(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<Field>, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    let values: Vec<Value> = manager
        .execute(cid, cmd("BF.INFO").arg(args.name), args.db)
        .await?;
    response::build_fields(&values)
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

pub async fn reserve(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
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
    manager.execute(cid, &mut cmd, Some(args.db)).await
}

pub async fn madd(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<i64>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;

    manager
        .execute(cid, cmd("BF.MADD").arg(args.name).arg(args.value), args.db)
        .await
}

pub async fn exists(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<String> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            cmd("BF.EXISTS").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}
