use crate::err::CusError;
use crate::request::{CommonValueArgs, ItemScanArgs};
use crate::{conn::ConnectionManager, response::ScanLikeResult};
use redis::Value;

pub async fn sscan<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<ScanLikeResult<String, String>, CusError> {
    let args: ItemScanArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("sscan");
    cmd.arg(&args.name)
        .arg(&args.cursor)
        .arg(&["COUNT", &args.count.to_string()]);
    if let Some(search) = args.search {
        cmd.arg(&["MATCH", &format!("*{}*", search)]);
    }
    let values: Vec<Value> = manager.execute(cid, &mut cmd, Some(args.db)).await?;
    ScanLikeResult::<String, String>::build(values)
}

pub async fn sadd<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    let value: i64 = manager
        .execute(
            cid,
            redis::cmd("sadd").arg(args.name).arg(args.value),
            Some(args.db),
        )
        .await?;
    match value {
        0 => {
            return Err(CusError::build("Value already exists in Set"));
        }
        _ => {
            return Ok(value);
        }
    }
}

pub async fn srem<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs = serde_json::from_str(payload.as_str())?;
    let value: i64 = manager
        .execute(
            cid,
            redis::cmd("srem").arg(args.name).arg(args.value),
            Some(args.db),
        )
        .await?;
    match value {
        0 => {
            return Err(CusError::build("Value not exists in Set"));
        }
        _ => {
            return Ok(value);
        }
    }
}
