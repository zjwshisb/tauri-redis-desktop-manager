use redis::{cmd, Value};
use serde::Deserialize;

use crate::connection::CValue;
use crate::err::CusError;
use crate::request::{CommonValueArgs, FieldValueArgs, ItemScanArgs, NameArgs, SingleValueArgs};
use crate::{connection::Manager, response::ScanLikeResult};

pub async fn sscan<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<ScanLikeResult<String, String>, CusError> {
    let args: ItemScanArgs = serde_json::from_str(&payload)?;
    let mut cmd = cmd("sscan");
    cmd.arg(&args.name)
        .arg(&args.cursor)
        .arg(&["COUNT", &args.count.to_string()]);
    if let Some(search) = args.search {
        cmd.arg(&["MATCH", &format!("*{}*", search)]);
    }
    let values: Vec<Value> = manager.execute(cid, &mut cmd, args.db).await?;
    ScanLikeResult::<String, String>::build(values)
}

pub async fn sadd<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    let value: i64 = manager
        .execute(
            cid,
            redis::cmd("sadd").arg(args.name).arg(args.value),
            args.db,
        )
        .await?;
    match value {
        0 => Err(CusError::build("Value already exists in Set")),
        _ => Ok(value),
    }
}

pub async fn srem<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(payload.as_str())?;
    let value: i64 = manager
        .execute(
            cid,
            redis::cmd("srem").arg(args.name).arg(args.value),
            args.db,
        )
        .await?;
    match value {
        0 => Err(CusError::build("Member not exists in Set")),
        _ => Ok(value),
    }
}

pub async fn sdiff<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: SingleValueArgs<Vec<String>> = serde_json::from_str(payload.as_str())?;
    manager
        .execute(cid, cmd("SDIFF").arg(args.value), args.db)
        .await
}

pub async fn sdiff_store<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(payload.as_str())?;
    manager
        .execute(
            cid,
            cmd("SDIFFSTORE").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn sinter<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: SingleValueArgs<Vec<String>> = serde_json::from_str(payload.as_str())?;
    manager
        .execute(cid, cmd("SINTER").arg(args.value), args.db)
        .await
}

pub async fn sinter_store<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(payload.as_str())?;
    manager
        .execute(
            cid,
            cmd("SINTERSTORE").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

#[derive(Deserialize)]
struct SInterCardArgs {
    numkeys: i64,
    keys: Vec<String>,
    limit: Option<i64>,
    db: Option<u8>,
}

pub async fn sinter_card<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: SInterCardArgs = serde_json::from_str(payload.as_str())?;
    let mut cmd = cmd("SINTERCARD");
    cmd.arg(args.numkeys).arg(args.keys);
    if let Some(v) = args.limit {
        cmd.arg(("LIMIT", v));
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn sis_member<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<String> = serde_json::from_str(payload.as_str())?;
    manager
        .execute(
            cid,
            cmd("SISMEMBER").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn sm_is_member<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(payload.as_str())?;
    manager
        .execute(
            cid,
            cmd("SMISMEMBER").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn smembers<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: NameArgs = serde_json::from_str(payload.as_str())?;
    manager
        .execute(cid, cmd("SMEMBERS").arg(args.name), args.db)
        .await
}

pub async fn smove<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: FieldValueArgs = serde_json::from_str(payload.as_str())?;
    let v: i64 = manager
        .execute(
            cid,
            cmd("SMOVE").arg(args.name).arg(args.field).arg(args.value),
            args.db,
        )
        .await?;
    match v {
        0 => Err(CusError::build(
            "element is not a member of source and no operation was performed",
        )),
        i => Ok(i),
    }
}

pub async fn spop<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<Option<i64>> = serde_json::from_str(payload.as_str())?;
    manager
        .execute(cid, cmd("SPOP").arg(args.name).arg(args.value), args.db)
        .await
}

pub async fn srand_member<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<Option<i64>> = serde_json::from_str(payload.as_str())?;
    manager
        .execute(
            cid,
            cmd("SRANDMEMBER").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn sunion<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: SingleValueArgs<Vec<String>> = serde_json::from_str(payload.as_str())?;
    manager
        .execute(cid, cmd("SUNION").arg(args.value), args.db)
        .await
}

pub async fn sunion_store<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(payload.as_str())?;
    manager
        .execute(
            cid,
            cmd("SUNIONSTORE").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}
