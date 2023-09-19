use crate::request::ItemScanArgs;
use crate::response::{Field, ScanLikeResult};
use crate::{err::CusError, ConnectionManager};
use redis::Value;
use serde::Deserialize;

pub async fn zscan<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<ScanLikeResult<Field, String>, CusError> {
    let args: ItemScanArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("zscan");
    cmd.arg(String::from(args.name))
        .arg(args.cursor)
        .arg(&["COUNT", args.count.to_string().as_str()]);
    if let Some(search) = args.search {
        cmd.arg(&["MATCH", &format!("*{}*", search)]);
    }
    let values: Vec<Value> = manager.execute(cid, &mut cmd, Some(args.db)).await?;
    ScanLikeResult::<Field, String>::build(values)
}

#[derive(Deserialize)]
struct ZRemArgs {
    name: String,
    db: u8,
    value: String,
}

pub async fn zrem<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: ZRemArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("zrem").arg(args.name).arg(args.value),
            Some(args.db),
        )
        .await
}

#[derive(Deserialize)]
struct ZAddArgs {
    name: String,
    value: String,
    score: f64,
    db: u8,
}

pub async fn zadd<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: ZAddArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("zadd")
                .arg(args.name)
                .arg(args.score)
                .arg(args.value),
            Some(args.db),
        )
        .await
}
