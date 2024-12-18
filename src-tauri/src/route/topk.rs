use crate::connection::{CValue, Manager};
use crate::err::CusError;
use crate::request::{CommonValueArgs, FieldValueItem, NameArgs};
use crate::response::{Field, FieldValue};
use redis::{FromRedisValue, Value};
use serde::Deserialize;
use crate::response;

#[derive(Deserialize)]
struct ReserveArgs {
    name: String,
    db: u8,
    width: i64,
    top_k: i64,
    depth: i64,
    decay: f32,
}
pub async fn reserve(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<String, CusError> {
    let args: ReserveArgs = serde_json::from_str(&payload)?;
    let v: String = manager
        .execute(
            cid,
            redis::cmd("TOPK.RESERVE")
                .arg(args.name)
                .arg(args.top_k)
                .arg(args.width)
                .arg(args.depth)
                .arg(args.decay),
            Some(args.db),
        )
        .await?;
    Ok(v)
}

pub async fn list(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<Field>, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    let v: Vec<Value> = manager
        .execute(
            cid,
            redis::cmd("TOPK.LIST").arg(args.name).arg("WITHCOUNT"),
            args.db,
        )
        .await?;
    let mut resp: Vec<Field> = vec![];
    let mut i = 0;
    let length = v.len();
    while i < length {
        if let Some(name) = v.get(i) {
            i = i + 1;
            if let Some(count) = v.get(i) {
                let f = Field {
                    field: String::from_redis_value(name)?,
                    value: FieldValue::Int(i64::from_redis_value(count)?),
                };
                i = i + 1;
                resp.push(f);
            }
        }
    }
    Ok(resp)
}

pub async fn info(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<Field>, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    let v: Vec<Value> = manager
        .execute(cid, redis::cmd("TOPK.INFO").arg(args.name), args.db)
        .await?;
    response::build_fields(&v)
}

pub async fn add(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<String, CusError> {
    let args: CommonValueArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("TOPK.ADD").arg(args.name).arg(args.value),
            args.db,
        )
        .await
    
}

pub async fn incrby(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<Vec<FieldValueItem<i64>>> = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("TOPK.INCRBY");
    cmd.arg(args.name);
    for x in args.value {
        cmd.arg((x.field, x.value));
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn query(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("TOPK.QUERY").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn count(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("TOPK.COUNT").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}
