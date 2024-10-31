use crate::connection::{CValue, Manager};
use crate::err::CusError;
use crate::request::{CommonValueArgs, FieldValueArgs, FieldValueItem, ItemScanArgs, NameArgs};
use crate::response::{Field, ScanLikeResult};
use redis::Value;

pub async fn hscan(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<ScanLikeResult<Field, String>, CusError> {
    let args: ItemScanArgs = serde_json::from_str(&payload)?;
    let mut cmd: redis::Cmd = redis::cmd("HSCAN");
    cmd.arg(args.name)
        .arg(args.cursor)
        .arg(&["COUNT", &args.count.to_string()]);
    if let Some(search) = args.search {
        cmd.arg(&["MATCH", format!("*{}*", search).as_str()]);
    }

    let value: Vec<Value> = manager.execute(cid, &mut cmd, args.db).await?;
    ScanLikeResult::<Field, String>::build(value)
}

pub async fn hset(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<Vec<FieldValueItem<String>>> = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("HSET");
    cmd.arg(&args.name);
    for x in args.value {
        cmd.arg(&[x.field, x.value]);
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn hdel(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("HDEL").arg(&args.name).arg(&args.value),
            args.db,
        )
        .await
}

pub async fn hexists(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<String> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("HEXISTS").arg(&args.name).arg(&args.value),
            args.db,
        )
        .await
}

pub async fn hget(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<String> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("HGET").arg(&args.name).arg(&args.value),
            args.db,
        )
        .await
}

pub async fn hget_all(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    manager
        .execute(cid, redis::cmd("HGETALL").arg(&args.name), args.db)
        .await
}

pub async fn hincrby(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: FieldValueArgs<i64, String> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("HINCRBY")
                .arg(&args.name)
                .arg(args.field)
                .arg(args.value),
            args.db,
        )
        .await
}

pub async fn hincrby_float(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: FieldValueArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("HINCRBYFLOAT")
                .arg(&args.name)
                .arg(args.field)
                .arg(args.value),
            args.db,
        )
        .await
}

pub async fn hkeys(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    manager
        .execute(cid, redis::cmd("HKEYS").arg(&args.name), args.db)
        .await
}

pub async fn hlen(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    manager
        .execute(cid, redis::cmd("HLEN").arg(&args.name), args.db)
        .await
}

pub async fn hmget(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("HMGET").arg(&args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn hrand_field(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: FieldValueArgs<Option<i64>, Option<bool>> = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("HRANDFIELD");
    cmd.arg(args.name).arg(args.value);
    if let Some(v) = args.field {
        if v {
            cmd.arg("WITHVALUEs");
        }
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn hsetnx(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: FieldValueArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("HSETNX")
                .arg(args.name)
                .arg(args.field)
                .arg(args.value),
            args.db,
        )
        .await
}

pub async fn hstr_len(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("HSTRLEN").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn hvals(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    manager
        .execute(cid, redis::cmd("HVALS").arg(&args.name), args.db)
        .await
}
