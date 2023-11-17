use serde::Deserialize;

use crate::connection::{CValue, Manager};
use crate::err::CusError;

use crate::request::{
    CommonValueArgs, FieldValueArgs, FieldValueItem, NameArgs, RangeArgs, SingleValueArgs,
};

pub async fn set<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: CommonValueArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("set").arg(&args.name).arg(&args.value),
            args.db,
        )
        .await
}

pub async fn mset<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: SingleValueArgs<Vec<FieldValueItem>> = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("mset");
    for x in args.value {
        cmd.arg((&x.field, &x.value));
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn append<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("append").arg(&args.name).arg(&args.value),
            args.db,
        )
        .await
}

pub async fn decr<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: NameArgs<String> = serde_json::from_str(&payload)?;
    manager
        .execute(cid, redis::cmd("DECR").arg(&args.name), args.db)
        .await
}

pub async fn decrby<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<i64> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("DECRBY").arg(&args.name).arg(&args.value),
            args.db,
        )
        .await
}

pub async fn incr<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: NameArgs<String> = serde_json::from_str(&payload)?;
    manager
        .execute(cid, redis::cmd("INCR").arg(&args.name), args.db)
        .await
}

pub async fn incrby<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<i64> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("INCRBY").arg(&args.name).arg(&args.value),
            args.db,
        )
        .await
}

pub async fn incrby_float<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: CommonValueArgs<f64> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("INCRBYFLOAT").arg(&args.name).arg(&args.value),
            args.db,
        )
        .await
}

pub async fn get_range<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: RangeArgs<i64> = serde_json::from_str(&payload)?;
    let v: Vec<u8> = manager
        .execute(
            cid,
            redis::cmd("GETRANGE")
                .arg(&args.name)
                .arg(args.start)
                .arg(args.end),
            args.db,
        )
        .await?;
    Ok(String::from_utf8_lossy(&v).to_string())
}

pub async fn set_range<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: FieldValueArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("SETRANGE")
                .arg(&args.name)
                .arg(args.field)
                .arg(args.value),
            args.db,
        )
        .await
}

#[derive(Deserialize)]
struct LcsArgs {
    key1: String,
    key2: String,
    len: Option<bool>,
    idx: Option<bool>,
    minmatchlen: Option<i64>,
    withmatchlen: Option<bool>,
    db: Option<u8>,
}

pub async fn lcs<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: LcsArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("lcs");
    cmd.arg(args.key1).arg(args.key2);
    if let Some(v) = args.len {
        if v {
            cmd.arg("LEN");
        }
    }
    if let Some(v) = args.idx {
        if v {
            cmd.arg("IDX");
        }
    }
    if let Some(v) = args.minmatchlen {
        cmd.arg(("MINMATCHLEN", v));
    }
    if let Some(v) = args.withmatchlen {
        if v {
            cmd.arg("WITHMATCHLEN");
        }
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn mget<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: NameArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(cid, redis::cmd("MGET").arg(&args.name), args.db)
        .await
}

pub async fn getdel<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    let v: Vec<u8> = manager
        .execute(cid, redis::cmd("GETDEL").arg(&args.name), args.db)
        .await?;
    Ok(String::from_utf8_lossy(&v).to_string())
}

pub async fn getset<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: CommonValueArgs = serde_json::from_str(&payload)?;
    let v: Vec<u8> = manager
        .execute(
            cid,
            redis::cmd("GETSET").arg(&args.name).arg(args.value),
            args.db,
        )
        .await?;
    Ok(String::from_utf8_lossy(&v).to_string())
}
