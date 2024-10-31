use crate::connection::Manager;
use crate::err::CusError;

use crate::request::NameArgs;
use crate::response::{Field, KeyWithMemory, ScanLikeResult};
use crate::{request, response, sqlite};

use redis::FromRedisValue;
use redis::Value;

pub async fn memory_usage(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
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

pub async fn analysis(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
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
            if let Value::Int(i) = memory {
                reps.values.push(KeyWithMemory {
                    name: x.clone(),
                    memory: i,
                    types, 
                }
                )
            }
        }
    }
    Ok(reps)
}

pub async fn memory_stats(
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<Vec<Field>>, CusError> {
    let value: Vec<Value> = manager
        .execute(cid, redis::cmd("memory").arg("stats"), None)
        .await?;
    let conn = sqlite::Connection::first(cid)?;
    let mut r = vec![];
    if conn.is_cluster {
        for v in value {
            let vv: Vec<Value> = Vec::from_redis_value(&v)?;
            r.push(response::build_fields(&vv)?);
        }
    } else {
        r.push(response::build_fields(&value)?);
    }
    Ok(r)
}

pub async fn memory_doctor(
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<Vec<String>, CusError> {
    manager
        .execute(cid, redis::cmd("Memory").arg("doctor"), None)
        .await
}

pub async fn memory_purge(
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<String, CusError> {
    manager
        .execute(cid, redis::cmd("Memory").arg("PURGE"), None)
        .await
}
