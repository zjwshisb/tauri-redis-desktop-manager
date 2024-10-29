use redis::{FromRedisValue, Value};
use serde::Deserialize;

use crate::{
    connection::{CValue, Manager},
    err::CusError,
    request::{CommonValueArgs, FieldValueArgs, NameArgs, RangeArgs},
};

#[derive(Deserialize)]
struct MoveArgs<T = f64> {
    source: String,
    destination: String,
    timeout: Option<T>,
    wherefrom: Option<String>,
    whereto: Option<String>,
    db: Option<u8>,
}

pub async fn bl_move<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: MoveArgs = serde_json::from_str(&payload)?;
    let v: Value = manager
        .execute(
            cid,
            redis::cmd("BLMOVE")
                .arg(args.source)
                .arg(args.destination)
                .arg(args.wherefrom)
                .arg(args.whereto)
                .arg(args.timeout),
            args.db,
        )
        .await?;
    match v {
        Value::Nil => Err(CusError::build("Timeout is reached.")),
        _ => Ok(CValue::from_redis_value(&v)?),
    }
}

#[derive(Deserialize)]
struct LMPopArgs {
    numkeys: i64,
    keys: Vec<String>,
    wherefrom: String,
    count: Option<i64>,
    timeout: Option<f64>,
    db: Option<u8>,
}
pub async fn blm_pop<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: LMPopArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("BLMPOP");
    cmd.arg(args.timeout)
        .arg(args.numkeys)
        .arg(args.keys)
        .arg(args.wherefrom);
    if let Some(v) = args.count {
        cmd.arg(("COUNT", v));
    }
    let v: Value = manager.execute(cid, &mut cmd, args.db).await?;
    match v {
        Value::Nil => Err(CusError::build("No element could be popped.")),
        _ => Ok(CValue::from_redis_value(&v)?),
    }
}

pub async fn bl_pop<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<f64, Vec<String>> = serde_json::from_str(&payload)?;
    let v: Value = manager
        .execute(
            cid,
            redis::cmd("BLPOP").arg(args.name).arg(args.value),
            args.db,
        )
        .await?;
    match v {
        Value::Nil => Err(CusError::build(
            "No element could be popped and the timeout expired",
        )),
        _ => Ok(CValue::from_redis_value(&v)?),
    }
}

pub async fn br_pop<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<f64, Vec<String>> = serde_json::from_str(&payload)?;
    let v: Value = manager
        .execute(
            cid,
            redis::cmd("BRPOP").arg(args.name).arg(args.value),
            args.db,
        )
        .await?;
    match v {
        Value::Nil => Err(CusError::build(
            "No element could be popped and the timeout expired",
        )),
        _ => Ok(CValue::from_redis_value(&v)?),
    }
}

pub async fn br_pop_lpush<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: MoveArgs<i64> = serde_json::from_str(&payload)?;
    let v: Value = manager
        .execute(
            cid,
            redis::cmd("BRPOPLPUSH")
                .arg(args.source)
                .arg(args.destination)
                .arg(args.timeout),
            args.db,
        )
        .await?;
    match v {
        Value::Nil => Err(CusError::build("Timeout is reached.")),
        _ => Ok(CValue::from_redis_value(&v)?),
    }
}

pub async fn lindex<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<i64> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("LINDEX").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn llen<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    manager
        .execute(cid, redis::cmd("LLEN").arg(args.name), args.db)
        .await
}

pub async fn lm_pop<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: LMPopArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("LMPOP");
    cmd.arg(args.numkeys).arg(args.keys).arg(args.wherefrom);
    if let Some(v) = args.count {
        cmd.arg(("COUNT", v));
    }
    let v: Value = manager.execute(cid, &mut cmd, args.db).await?;
    match v {
        Value::Nil => Err(CusError::build("No element could be popped.")),
        _ => Ok(CValue::from_redis_value(&v)?),
    }
}

pub async fn lmove<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: MoveArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("LMOVE")
                .arg(args.source)
                .arg(args.destination)
                .arg(args.wherefrom)
                .arg(args.whereto),
            args.db,
        )
        .await
}

#[derive(Deserialize)]
struct InsertArgs {
    name: String,
    db: Option<u8>,
    whereto: String,
    value: String,
    pivot: String,
}
pub async fn linsert<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: InsertArgs = serde_json::from_str(&payload)?;
    let value: i64 = manager
        .execute(
            cid,
            redis::cmd("linsert")
                .arg(&args.name)
                .arg(&args.whereto)
                .arg(&args.pivot)
                .arg(&args.value),
            args.db,
        )
        .await?;
    match value {
        0 => Err(CusError::key_not_exists()),
        -1 => Err(CusError::App(String::from("the pivot wasn't found."))),
        _ => Ok(value),
    }
}

pub async fn lpop<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<Option<i64>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("LPOP").arg(&args.name).arg(args.value),
            args.db,
        )
        .await
}

#[derive(Deserialize)]
struct LPosArgs {
    name: String,
    db: Option<u8>,
    element: String,
    rank: Option<i64>,
    count: Option<i64>,
    len: Option<i64>,
}

pub async fn lpos<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: LPosArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("LPOS");
    cmd.arg(args.name).arg(args.element);
    if let Some(v) = args.rank {
        cmd.arg(("RANK", v));
    }
    if let Some(v) = args.count {
        cmd.arg(("COUNT", v));
    }
    if let Some(v) = args.len {
        cmd.arg(("MAXLEN", v));
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn lpush<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("LPUSH").arg(&args.name).arg(&args.value),
            args.db,
        )
        .await
}

pub async fn lpush_x<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("LPUSHX").arg(&args.name).arg(&args.value),
            args.db,
        )
        .await
}

pub async fn lrange<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: RangeArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("lrange")
                .arg(&args.name)
                .arg(&args.start)
                .arg(&args.end),
            args.db,
        )
        .await
}

pub async fn lrem<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: FieldValueArgs<i64> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("lrem")
                .arg(&args.name)
                .arg(&args.value)
                .arg(&args.field),
            args.db,
        )
        .await
}

pub async fn lset<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: FieldValueArgs<String, i64> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("LSET")
                .arg(&args.name)
                .arg(args.field)
                .arg(&args.value),
            args.db,
        )
        .await
}

pub async fn ltrim<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: RangeArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("ltrim")
                .arg(&args.name)
                .arg(args.start)
                .arg(args.end),
            args.db,
        )
        .await
}

pub async fn rpop<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: CommonValueArgs<Option<i64>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("RPOP").arg(&args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn rpop_lpush<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: MoveArgs<i64> = serde_json::from_str(&payload)?;
    let v: Value = manager
        .execute(
            cid,
            redis::cmd("RPOPLPUSH")
                .arg(args.source)
                .arg(args.destination),
            args.db,
        )
        .await?;
    match v {
        Value::Nil => Err(CusError::build("The source list is empty.")),
        _ => Ok(CValue::from_redis_value(&v)?),
    }
}

pub async fn rpush<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    let value: i64 = manager
        .execute(
            cid,
            redis::cmd("rpush").arg(&args.name).arg(&args.value),
            args.db,
        )
        .await?;
    match value {
        0 => Err(CusError::key_not_exists()),
        _ => Ok(value),
    }
}

pub async fn rpushx<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("RPUSHX").arg(&args.name).arg(&args.value),
            args.db,
        )
        .await
}
