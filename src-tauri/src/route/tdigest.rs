use redis::{cmd, Value};

use crate::{connection::Manager, err::CusError, request::{CommonValueArgs, NameArgs}, response, response::Field};
use serde::Deserialize;

#[derive(Deserialize)]
struct CreateArgs {
    name: String,
    db: u8,
    compression: Option<i64>,
}
pub async fn create(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<String, CusError> {
    let args: CreateArgs = serde_json::from_str(&payload)?;
    let mut cmd = cmd("TDIGEST.CREATE");
    cmd.arg(args.name);
    if let Some(v) = args.compression {
        cmd.arg(("COMPRESSION", v));
    }
     manager.execute(cid, &mut cmd, Some(args.db)).await
}

pub async fn info(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<Field>, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;

    let value: Vec<Value> = manager
        .execute(cid, cmd("TDIGEST.INFO").arg(args.name), args.db)
        .await?;
    response::build_fields(&value)
}

pub async fn add(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<String, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            cmd("TDIGEST.ADD").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn rank(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<i64>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            cmd("TDIGEST.RANK").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn by_rank(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<String>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            cmd("TDIGEST.BYRANK").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn rev_rank(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<i64>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            cmd("TDIGEST.REVRANK").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn by_rev_rank(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<String>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            cmd("TDIGEST.BYREVRANK").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn cdf(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<String>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            cmd("TDIGEST.CDF").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn quantile(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<String>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
     manager
        .execute(
            cid,
            cmd("TDIGEST.QUANTILE").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn reset(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<String, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    manager
        .execute(cid, cmd("TDIGEST.RESET").arg(args.name), args.db)
        .await
}

pub async fn min(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<String, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    manager
        .execute(cid, cmd("TDIGEST.MIN").arg(args.name), args.db)
        .await
}

pub async fn max(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<String, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    manager
        .execute(cid, cmd("TDIGEST.MAX").arg(args.name), args.db)
        .await
}

#[derive(Deserialize)]
struct TrimmedMeanArgs {
    name: String,
    db: u8,
    low_cut_quantile: String,
    high_cut_quantile: String,
}

pub async fn trimmed_mean(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<String, CusError> {
    let args: TrimmedMeanArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            cmd("TDIGEST.TRIMMED_MEAN")
                .arg(args.name)
                .arg(args.low_cut_quantile)
                .arg(args.high_cut_quantile),
            Some(args.db),
        )
        .await
}
