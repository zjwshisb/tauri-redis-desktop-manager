use crate::connection::Manager;
use crate::err::CusError;

use crate::request::NameArgs;
use crate::response::{Field, KeyWithMemory, ScanLikeResult};
use crate::{request, response, sqlite};

use redis::FromRedisValue;
use redis::Value;

pub async fn memory_usage<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<i64, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("memory")
                .arg("usage")
                .arg(&args.name)
                .arg(&["SAMPLES", "0"]),
            args.db,
        )
        .await
}

pub async fn analysis<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<ScanLikeResult<KeyWithMemory, String>, CusError> {
    let args: request::ScanLikeArgs<String> = serde_json::from_str(&payload)?;

    let mut cmd = redis::cmd("scan");
    cmd.arg(&args.cursor)
        .arg(&["count", &args.count.to_string()]);
    if let Some(search) = args.search {
        cmd.arg(&["MATCH", &format!("*{}*", search)]);
    }
    if let Some(types) = args.types {
        cmd.arg(&["TYPE", &types]);
    }
    let value: Vec<Value> = manager.execute(cid, &mut cmd, args.db).await?;
    let result = ScanLikeResult::<String, String>::build(value)?;
    let mut reps = ScanLikeResult::<KeyWithMemory, String> {
        cursor: result.cursor.clone(),
        values: vec![],
    };
    for x in &result.values {
        let types: String = manager
            .execute(cid, redis::cmd("type").arg(x), args.db)
            .await?;
        if types != "none" {
            let memory = manager
                .execute(
                    cid,
                    redis::cmd("memory")
                        .arg("usage")
                        .arg(x)
                        .arg(&["SAMPLES", "0"]),
                    args.db,
                )
                .await?;
            match memory {
                Value::Int(i) => reps.values.push(KeyWithMemory {
                    name: x.clone(),
                    memory: i,
                    types,
                }),
                _ => {}
            }
        }
    }
    Ok(reps)
}

pub async fn memory_stats<'r>(
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<Vec<Vec<response::Field>>, CusError> {
    let value: Vec<Value> = manager
        .execute(cid, redis::cmd("memory").arg("stats"), None)
        .await?;
    let conn = sqlite::Connection::first(cid)?;
    let mut r = vec![];
    if conn.is_cluster {
        for v in value {
            let vv: Vec<Value> = Vec::from_redis_value(&v)?;
            r.push(Field::build_vec(&vv)?);
        }
    } else {
        r.push(Field::build_vec(&value)?);
    }
    Ok(r)
}

pub async fn memory_doctor<'r>(
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<Vec<String>, CusError> {
    let values = manager
        .execute(cid, redis::cmd("Memory").arg("doctor"), None)
        .await?;
    let mut r = vec![];
    match values {
        Value::BulkString(v) => {
            r.push(String::from_utf8(v)?);
        }
        Value::Array(v) => {
            for vv in v {
                r.push(String::from_redis_value(&vv)?)
            }
        }
        _ => {}
    }
    Ok(r)
}

pub async fn memory_purge<'r>(
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<String, CusError> {
    manager
        .execute(cid, redis::cmd("Memory").arg("PURGE"), None)
        .await
}
