use crate::{
    connection::Manager,
    err::CusError,
    request::{CommonValueArgs, NameArgs},
    response::Field,
};
use redis::{cmd, Value};
use serde::Deserialize;

pub async fn info<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<Vec<Field>, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    let values: Vec<Value> = manager
        .execute(cid, cmd("CF.INFO").arg(args.name), args.db)
        .await?;
    Ok(Field::build_vec(&values)?)
}

pub async fn add<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<String> = serde_json::from_str(&payload)?;
    manager
        .execute(cid, cmd("CF.ADD").arg(args.name).arg(args.value), args.db)
        .await
}

pub async fn insert<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
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

pub async fn insertnx<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<Vec<i64>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager.execute(
            cid,
            cmd("CF.INSERTNX").arg(args.name).arg(("ITEMS", args.value)),
            args.db,
        ).await
}

pub async fn addnx<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<String> = serde_json::from_str(&payload)?;
    let i: i64 = manager
        .execute(cid, cmd("CF.ADDNX").arg(args.name).arg(args.value), args.db)
        .await?;
    match i {
        0 => {
            return Err(CusError::build(
                "the item's fingerprint already exist in the filter",
            ));
        }
        _ => {}
    }
    Ok(i)
}

pub async fn del<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<String> = serde_json::from_str(&payload)?;
    let i: i64 = manager
        .execute(cid, cmd("CF.DEL").arg(args.name).arg(args.value), args.db)
        .await?;
    match i {
        0 => {
            return Err(CusError::build("Such item was not found in the filter"));
        }
        _ => {}
    }
    Ok(i)
}

pub async fn count<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<String> = serde_json::from_str(&payload)?;
    manager
        .execute(cid, cmd("CF.COUNT").arg(args.name).arg(args.value), args.db)
        .await
}

pub async fn exists<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
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

pub async fn mexists<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
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

pub async fn reserve<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
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
