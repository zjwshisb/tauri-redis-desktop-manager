use redis::Value;
use serde::Deserialize;

use crate::{connection::{CValue, Manager}, err::CusError, request::{CommonValueArgs, FieldValueItem, NameArgs}, response, response::Field};

#[derive(Deserialize)]
struct InitArgs {
    db: Option<u8>,
    name: String,
    command: String,
    depth: Option<String>,
    width: Option<String>,
    error: Option<String>,
    probability: Option<String>,
}

pub async fn init(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: InitArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd(&args.command);
    cmd.arg(args.name);
    if args.command == "CMS.INITBYPROB" {
        cmd.arg(args.error).arg(args.probability);
    } else {
        cmd.arg(args.width).arg(args.depth);
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn info(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<Field>, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    let values: Vec<Value> = manager
        .execute(cid, redis::cmd("CMS.INFO").arg(args.name), args.db)
        .await?;
    response::build_fields(&values)
}

pub async fn incrby(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<Vec<FieldValueItem<String>>> = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("CMS.INCRBY");
    cmd.arg(args.name);
    for x in args.value {
        cmd.arg((&x.field, &x.value));
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn query(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("CMS.QUERY").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

#[derive(Deserialize)]
struct MergeArgs {
    db: Option<u8>,
    destination: String,
    num_keys: i64,
    source: Vec<String>,
    weight: Option<Vec<String>>,
}

pub async fn merge(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: MergeArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("CMS.MERGE");
    cmd.arg(args.destination)
        .arg(args.num_keys)
        .arg(args.source);
    if let Some(v) = args.weight {
        cmd.arg(("WEIGHTS", v));
    }
    manager.execute(cid, &mut cmd, args.db).await
}
