use std::collections::HashMap;

use crate::connection::{CValue, Manager};
use crate::err::CusError;

use crate::request::{CommonValueArgs, DBArgs, NameArgs};
use crate::response::{Field, FieldValue};
use crate::utils::compare_version;
use crate::{
    err::{self},
    key::Key,
    response::ScanLikeResult,
};
use crate::{request, utils};

use redis::FromRedisValue;
use redis::Value;
use serde::Deserialize;

pub async fn scan<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<ScanLikeResult<String, String>, CusError> {
    let args: request::ScanLikeArgs<String> = serde_json::from_str(&payload)?;

    let mut cmd = redis::cmd("scan");
    cmd.arg(&args.cursor)
        .arg(&["count", &args.count.to_string()]);

    if let Some(mut search) = args.search {
        match args.exact {
            None => search = format!("*{}*", search),
            Some(exact) => {
                if !exact {
                    search = format!("*{}*", search)
                }
            }
        }
        cmd.arg(&["MATCH", &search]);
    }
    if let Some(types) = args.types {
        cmd.arg(&["TYPE", &types]);
    }
    let value: Vec<Value> = manager.execute(cid, &mut cmd, args.db).await?;
    Ok(ScanLikeResult::<String, String>::build(value)?)
}

#[derive(Deserialize)]
struct CopyArgs {
    db: Option<u8>,
    source: String,
    destination: String,
    destination_db: Option<u8>,
    replace: bool,
}

pub async fn copy<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: CopyArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("COPY");
    cmd.arg(args.source).arg(args.destination);
    if let Some(v) = args.destination_db {
        cmd.arg(("DB", v));
    }
    if args.replace {
        cmd.arg("REPLACE");
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn get<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<Key, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    let mut key: Key = Key::build(args.name, args.db, cid, &manager).await?;
    if key.is_none() {
        return Err(CusError::App(format!("{} is not exist", key.get_name())));
    }
    match key.get_type().as_str() {
        "string" => {
            key.get_string_value(&manager).await?;
        }
        "ReJSON-RL" => {
            key.get_json_value(&manager).await?;
        }
        _ => (),
    }
    Ok(key)
}

#[derive(Deserialize)]
struct DelArgs {
    command: String,
    name: Vec<String>,
    db: Option<u8>,
}

pub async fn del<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: DelArgs = serde_json::from_str(&payload)?;
    manager
        .execute(cid, redis::cmd(&args.command).arg(&args.name), args.db)
        .await
}
#[derive(Deserialize)]
struct ExpireArgs {
    command: String,
    name: String,
    ttl: Option<i64>,
    db: u8,
    option: Option<String>,
}
pub async fn expire<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: ExpireArgs = serde_json::from_str(&payload)?;
    let mut cmd: redis::Cmd;
    match args.command.as_str() {
        "PERSIST" => {
            cmd = redis::cmd("PERSIST");
            cmd.arg(args.name);
        }
        s => {
            cmd = redis::cmd(s);
            cmd.arg(args.name).arg(args.ttl).arg(args.option);
        }
    }
    manager.execute(cid, &mut cmd, Some(args.db)).await
}

pub async fn ttl<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs = serde_json::from_str(&payload)?;
    manager
        .execute(cid, redis::cmd(&args.value).arg(args.name), args.db)
        .await
}

#[derive(Deserialize)]
struct RenameArgs {
    name: String,
    new_name: String,
    db: u8,
    command: String,
}

pub async fn rename<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: RenameArgs = serde_json::from_str(&payload)?;
    let v: CValue = manager
        .execute(
            cid,
            redis::cmd(&args.command)
                .arg(&args.name)
                .arg(&args.new_name),
            Some(args.db),
        )
        .await?;
    if let CValue::Int(0) = v {
        return Err(CusError::build("New key already exists."));
    }
    return Ok(v);
}

#[derive(Deserialize)]
struct AddArgs {
    name: String,
    types: String,
    db: u8,
    value: Option<String>,
}

pub async fn add<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: AddArgs = serde_json::from_str(&payload)?;
    match args.types.as_str() {
        "string" => {
            let v: Value = manager
                .execute(
                    cid,
                    redis::cmd("set").arg(&args.name).arg(args.value),
                    Some(args.db),
                )
                .await?;
            return Ok(String::from_redis_value(&v)?);
        }
        "ReJSON-RL" => {
            let v: String = manager
                .execute(
                    cid,
                    redis::cmd("JSON.SET")
                        .arg(&args.name)
                        .arg("$")
                        .arg(args.value),
                    Some(args.db),
                )
                .await?;
            return Ok(v.to_string());
        }
        _ => {}
    }
    Err(err::new_normal())
}

pub async fn dump<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    let v: Vec<u8> = manager
        .execute(cid, redis::cmd("dump").arg(&args.name), args.db)
        .await?;
    Ok(utils::binary_to_redis_str(&v))
}

#[derive(Deserialize, Debug)]
struct RestoreArgs {
    db: u8,
    name: String,
    ttl: u64,
    replace: Option<bool>,
    value: String,
}

pub async fn restore<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    let args: RestoreArgs = serde_json::from_str(&payload)?;
    let v = utils::redis_str_to_binary(args.value);
    let mut cmd = redis::cmd("restore");
    cmd.arg(args.name).arg(args.ttl).arg(v);
    if let Some(replace) = args.replace {
        if replace {
            cmd.arg("replace");
        }
    }
    manager.execute(cid, &mut cmd, Some(args.db)).await
}

pub async fn object<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<Vec<Field>, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    let version = manager.get_version(cid).await?;
    let mut resp: Vec<Field> = vec![];

    if compare_version(&version, "2.2.3") > -1 {
        let s: Result<CValue, CusError> = manager
            .execute(
                cid,
                redis::cmd("OBJECT").arg("ENCODING").arg(&args.name),
                args.db,
            )
            .await;
        if let Ok(v) = s {
            resp.push(Field {
                field: String::from("OBJECT ENCODING"),
                value: FieldValue::Value(v),
            })
        }
    }

    if compare_version(&version, "4.0.0") > -1 {
        let s: Result<CValue, CusError> = manager
            .execute(
                cid,
                redis::cmd("OBJECT").arg("FREQ").arg(&args.name),
                args.db,
            )
            .await;
        if let Ok(v) = s {
            resp.push(Field {
                field: String::from("OBJECT FREQ"),
                value: FieldValue::Value(v),
            })
        }
    }

    if compare_version(&version, "2.2.3") > -1 {
        let s: Result<CValue, CusError> = manager
            .execute(
                cid,
                redis::cmd("OBJECT").arg("IDLETIME").arg(&args.name),
                args.db,
            )
            .await;
        if let Ok(v) = s {
            resp.push(Field {
                field: String::from("OBJECT IDLETIME"),
                value: FieldValue::Value(v),
            })
        }
    }

    if compare_version(&version, "2.2.3") > -1 {
        let s: Result<CValue, CusError> = manager
            .execute(
                cid,
                redis::cmd("OBJECT").arg("REFCOUNT").arg(&args.name),
                args.db,
            )
            .await;
        if let Ok(v) = s {
            resp.push(Field {
                field: String::from("OBJECT REFCOUNT"),
                value: FieldValue::Value(v),
            })
        }
    }
    Ok(resp)
}

pub async fn move_key<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<i64> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("MOVE").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn random_key<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<CValue, CusError> {
    let args: DBArgs = serde_json::from_str(&payload)?;
    manager
        .execute(cid, &mut redis::cmd("RANDOMKEY"), args.db)
        .await
}
