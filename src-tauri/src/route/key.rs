use crate::conn::ConnectionManager;
use crate::err::CusError;

use crate::request::{CommonValueArgs, NameArgs};
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
    manager: tauri::State<'r, ConnectionManager>,
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

pub async fn get<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
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
        _ => (),
    }
    Ok(key)
}

#[derive(Deserialize)]
struct DelArgs {
    names: Vec<String>,
    db: u8,
}
pub async fn del<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: DelArgs = serde_json::from_str(&payload)?;
    manager
        .execute(cid, redis::cmd("del").arg(&args.names), Some(args.db))
        .await
}
#[derive(Deserialize)]
struct ExpireArgs {
    name: String,
    ttl: i64,
    db: u8,
}
pub async fn expire<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: ExpireArgs = serde_json::from_str(&payload)?;
    if args.ttl == -1 {
        let i: i64 = manager
            .execute(cid, redis::cmd("PERSIST").arg(&args.name), Some(args.db))
            .await?;
        match i {
            0 => Err(CusError::build(
                "Key does not exist or does not have an associated timeout.",
            )),
            _ => Ok(i),
        }
    } else {
        let i: i64 = manager
            .execute(
                cid,
                redis::cmd("EXPIRE").arg(&args.name).arg(args.ttl),
                Some(args.db),
            )
            .await?;
        match i {
            0 => Err(CusError::build(
                "Key doesn't exist, or operation skipped due to the provided arguments.",
            )),
            _ => Ok(i),
        }
    }
}

#[derive(Deserialize)]
struct RenameArgs {
    name: String,
    new_name: String,
    db: u8,
}

pub async fn rename<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let args: RenameArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("rename").arg(&args.name).arg(&args.new_name),
            Some(args.db),
        )
        .await
}

pub async fn set<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let args: CommonValueArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("set").arg(&args.name).arg(&args.value),
            Some(args.db),
        )
        .await
}

#[derive(Deserialize)]
struct AddArgs {
    name: String,
    types: String,
    db: u8,
}

pub async fn add<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let args: AddArgs = serde_json::from_str(&payload)?;
    match args.types.as_str() {
        "string" => {
            let v: Value = manager
                .execute(
                    cid,
                    redis::cmd("set").arg(&args.name).arg("Hello World"),
                    Some(args.db),
                )
                .await?;
            return Ok(String::from_redis_value(&v)?);
        }
        "hash" => {
            let v: i64 = manager
                .execute(
                    cid,
                    redis::cmd("HSET")
                        .arg(&args.name)
                        .arg("rust")
                        .arg("Hello World"),
                    Some(args.db),
                )
                .await?;
            return Ok(v.to_string());
        }
        "set" => {
            let v: i64 = manager
                .execute(
                    cid,
                    redis::cmd("sadd").arg(&args.name).arg("rust"),
                    Some(args.db),
                )
                .await?;
            return Ok(v.to_string());
        }
        "list" => {
            let v: i64 = manager
                .execute(
                    cid,
                    redis::cmd("lpush").arg(&args.name).arg("Hello World"),
                    Some(args.db),
                )
                .await?;
            return Ok(v.to_string());
        }
        "zset" => {
            let v: i64 = manager
                .execute(
                    cid,
                    redis::cmd("zadd").arg(&args.name).arg("9999").arg("rust"),
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
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let args: CommonValueArgs = serde_json::from_str(&payload)?;
    let v: Vec<u8> = manager
        .execute(cid, redis::cmd("dump").arg(&args.name), Some(args.db))
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
    manager: tauri::State<'r, ConnectionManager>,
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
