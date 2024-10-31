use crate::{connection::Manager, err::CusError, request::{CommonValueArgs, NameArgs}, response, response::Field};
use redis::{cmd, Value};
use serde::Deserialize;

pub async fn info(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<Field>, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    let values: Vec<Value> = manager
        .execute(cid, cmd("CF.INFO").arg(args.name), args.db)
        .await?;
    response::build_fields(&values)
}

pub async fn add(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<String> = serde_json::from_str(&payload)?;
    manager
        .execute(cid, cmd("CF.ADD").arg(args.name).arg(args.value), args.db)
        .await
}

pub async fn insert(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<i64>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            cmd("CF.INSERT").arg(args.name).arg(("ITEMS", args.value)),
            args.db,
        )
        .await
}

pub async fn insertnx(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<i64>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            cmd("CF.INSERTNX").arg(args.name).arg(("ITEMS", args.value)),
            args.db,
        )
        .await
}

pub async fn addnx(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<String> = serde_json::from_str(&payload)?;
    let i: i64 = manager
        .execute(cid, cmd("CF.ADDNX").arg(args.name).arg(args.value), args.db)
        .await?;
    if i == 0 {
        return Err(CusError::build(
            "the item's fingerprint already exist in the filter",
        ));
    }
    Ok(i)
}

pub async fn del(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<String> = serde_json::from_str(&payload)?;
    let i: i64 = manager
        .execute(cid, cmd("CF.DEL").arg(args.name).arg(args.value), args.db)
        .await?;
    if i == 0 {
        return Err(CusError::build("Such item was not found in the filter"));
    }
    Ok(i)
}

pub async fn count(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<String> = serde_json::from_str(&payload)?;
    manager
        .execute(cid, cmd("CF.COUNT").arg(args.name).arg(args.value), args.db)
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
            cmd("CF.EXISTS").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn mexists(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<i64>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;

    manager
        .execute(
            cid,
            cmd("CF.MEXISTS").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

#[derive(Deserialize)]
struct ReserveArgs {
    bucketsize: Option<i64>,
    maxiterations: Option<i64>,
    expansion: Option<i64>,
    capacity: i64,
    name: String,
    db: Option<u8>,
}

pub async fn reserve(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<String, CusError> {
    let args: ReserveArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("CF.RESERVE");
    cmd.arg(args.name).arg(args.capacity);
    if let Some(i) = args.bucketsize {
        cmd.arg(("BUCKETSIZE", i));
    }
    if let Some(i) = args.maxiterations {
        cmd.arg(("MAXITERATIONS", i));
    }
    if let Some(i) = args.expansion {
        cmd.arg(("EXPANSION", i));
    }
    manager.execute(cid, &mut cmd, args.db).await
}
