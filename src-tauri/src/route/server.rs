use std::{collections::HashMap, fmt::Debug};

use crate::{
    conn::{ConnectionManager, CusConnection},
    err::CusError,
    model::redis::SlowLog,
};
use redis::{FromRedisValue, Value};
use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct PingArgs {
    host: String,
    port: i64,
    password: String,
}

pub async fn info<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<HashMap<String, String>>, CusError> {
    manager.get_info(cid).await
}

pub async fn ping<'r>(
    payload: String,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let params: PingArgs = serde_json::from_str(payload.as_str())?;
    let host = format!("redis://{}:{}", params.host, params.port);
    let mut conn = CusConnection::build_anonymous(&host, &params.password).await?;
    let v = manager
        .execute_with(&mut redis::cmd("ping"), &mut conn)
        .await?;
    Ok(String::from_redis_value(&v)?)
}

pub async fn version<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    manager.get_version(cid).await
}

#[derive(serde::Serialize)]
pub struct SlowLogResp {
    time: String,
    count: String,
    logs: Vec<SlowLog>,
}

pub async fn slow_log<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<SlowLogResp, CusError> {
    let config = manager.get_config(cid, "slowlog*").await?;

    let mut time = String::from("0");
    if let Some(v) = config.get("slowlog-log-slower-than") {
        time = v.clone();
    }
    let mut count = String::from("0");
    if let Some(v) = config.get("slowlog-max-len") {
        count = v.clone();
    }
    let value = manager
        .execute(cid, 0, &mut redis::cmd("slowlog").arg("get").arg(&count))
        .await?;
    let mut logs: Vec<SlowLog> = vec![];
    match value {
        Value::Bulk(v) => {
            for vv in v {
                match vv {
                    Value::Bulk(vvv) => {
                        if let Some(first) = vvv.get(0) {
                            match first {
                                // if cluster
                                Value::Bulk(_) => {
                                    for vvvv in vvv {
                                        match vvvv {
                                            Value::Bulk(arr) => {
                                                logs.push(SlowLog::build(&arr));
                                            }
                                            _ => {}
                                        }
                                    }
                                }
                                // normal
                                Value::Int(_) => {
                                    logs.push(SlowLog::build(&vvv));
                                }
                                _ => {}
                            }
                        }
                    }
                    _ => {}
                }
            }
        }
        _ => {}
    }

    Ok(SlowLogResp { time, count, logs })
}
