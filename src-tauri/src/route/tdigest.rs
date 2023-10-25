use redis::{cmd, Value};

use crate::{
    conn::ConnectionManager,
    err::CusError,
    request::{CommonValueArgs, NameArgs},
    response::Field,
};
use serde::Deserialize;

#[derive(Deserialize)]
struct CreateArgs {
    name: String,
    db: u8,
    compression: Option<i64>,
}
pub async fn create<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let args: CreateArgs = serde_json::from_str(&payload)?;
    let mut cmd = cmd("TDIGEST.CREATE");
    cmd.arg(args.name);
    if let Some(v) = args.compression {
        cmd.arg(("COMPRESSION", v));
    }
    let value: String = manager.execute(cid, &mut cmd, Some(args.db)).await?;
    Ok(value)
}

pub async fn info<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<Field>, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;

    let value: Vec<Value> = manager
        .execute(cid, cmd("TDIGEST.INFO").arg(args.name), Some(args.db))
        .await?;
    Ok(Field::build_vec(&value)?)
}

pub async fn add<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    let value: String = manager
        .execute(
            cid,
            cmd("TDIGEST.ADD").arg(args.name).arg(args.value),
            Some(args.db),
        )
        .await?;
    Ok(value)
}

pub async fn rank<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<i64>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    let value: Vec<i64> = manager
        .execute(
            cid,
            cmd("TDIGEST.RANK").arg(args.name).arg(args.value),
            Some(args.db),
        )
        .await?;
    Ok(value)
}

pub async fn by_rank<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<String>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    let value: Vec<String> = manager
        .execute(
            cid,
            cmd("TDIGEST.BYRANK").arg(args.name).arg(args.value),
            Some(args.db),
        )
        .await?;
    Ok(value)
}

pub async fn rev_rank<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<i64>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    let value: Vec<i64> = manager
        .execute(
            cid,
            cmd("TDIGEST.REVRANK").arg(args.name).arg(args.value),
            Some(args.db),
        )
        .await?;
    Ok(value)
}

pub async fn by_rev_rank<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<String>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    let value: Vec<String> = manager
        .execute(
            cid,
            cmd("TDIGEST.BYREVRANK").arg(args.name).arg(args.value),
            Some(args.db),
        )
        .await?;
    Ok(value)
}

pub async fn cdf<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<String>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    let value: Vec<String> = manager
        .execute(
            cid,
            cmd("TDIGEST.CDF").arg(args.name).arg(args.value),
            Some(args.db),
        )
        .await?;
    Ok(value)
}

pub async fn quantile<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<String>, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    let value: Vec<String> = manager
        .execute(
            cid,
            cmd("TDIGEST.QUANTILE").arg(args.name).arg(args.value),
            Some(args.db),
        )
        .await?;
    Ok(value)
}

pub async fn reset<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;

    let value: String = manager
        .execute(cid, cmd("TDIGEST.RESET").arg(args.name), Some(args.db))
        .await?;
    Ok(value)
}

pub async fn min<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;

    let value: String = manager
        .execute(cid, cmd("TDIGEST.MIN").arg(args.name), Some(args.db))
        .await?;
    Ok(value)
}

pub async fn max<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    let value: String = manager
        .execute(cid, cmd("TDIGEST.MAX").arg(args.name), Some(args.db))
        .await?;
    Ok(value)
}

#[derive(Deserialize)]
struct TrimmedMeanArgs {
    name: String,
    db: u8,
    low_cut_quantile: String,
    high_cut_quantile: String,
}

pub async fn trimmed_mean<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let args: TrimmedMeanArgs = serde_json::from_str(&payload)?;
    let value: String = manager
        .execute(
            cid,
            cmd("TDIGEST.TRIMMED_MEAN")
                .arg(args.name)
                .arg(args.low_cut_quantile)
                .arg(args.high_cut_quantile),
            Some(args.db),
        )
        .await?;
    Ok(value)
}
