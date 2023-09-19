use crate::conn::ConnectionManager;
use crate::err::CusError;
use crate::request::ItemScanArgs;
use crate::response::{Field, ScanLikeResult};
use redis::Value;
use serde::Deserialize;

pub async fn hscan<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<ScanLikeResult<Field, String>, CusError> {
    let args: ItemScanArgs = serde_json::from_str(&payload)?;
    let mut cmd: redis::Cmd = redis::cmd("hscan");
    cmd.arg(args.name)
        .arg(args.cursor)
        .arg(&["COUNT", &args.count.to_string()]);
    if let Some(search) = args.search {
        cmd.arg(&["MATCH", format!("*{}*", search).as_str()]);
    }

    let value: Vec<Value> = manager.execute(cid, &mut cmd, Some(args.db)).await?;
    ScanLikeResult::<Field, String>::build(value)
}

#[derive(Deserialize)]
struct HSetArgs {
    name: String,
    field: String,
    value: String,
    db: u8,
}
pub async fn hset<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: HSetArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("hset")
                .arg(&args.name)
                .arg(&[args.field, args.value]),
            Some(args.db),
        )
        .await
}
#[derive(Deserialize)]
struct HDelArgs {
    name: String,
    fields: Vec<String>,
    db: u8,
}

pub async fn hdel<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: HDelArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("hdel").arg(&args.name).arg(&args.fields),
            Some(args.db),
        )
        .await
}
