use crate::request::{CommonValueArgs, FieldValueItem, ItemScanArgs};
use crate::response::{Field, ScanLikeResult};
use crate::{connection::Manager, err::CusError};
use redis::Value;

pub async fn zscan<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<ScanLikeResult<Field, String>, CusError> {
    let args: ItemScanArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("zscan");
    cmd.arg(String::from(args.name))
        .arg(args.cursor)
        .arg(&["COUNT", args.count.to_string().as_str()]);
    if let Some(search) = args.search {
        cmd.arg(&["MATCH", &format!("*{}*", search)]);
    }
    let values: Vec<Value> = manager.execute(cid, &mut cmd, args.db).await?;
    ScanLikeResult::<Field, String>::build(values)
}

pub async fn zrem<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("zrem").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn zadd<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<Vec<FieldValueItem<String>>> = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("zadd");
    cmd.arg(args.name);
    for x in args.value {
        cmd.arg(x.value).arg(x.field);
    }
    manager.execute(cid, &mut cmd, args.db).await
}
