use std::collections::HashMap;

use crate::{
    conn::{ConnectionManager, ConnectionWrapper},
    err::CusError,
    model::SlowLog,
    response::{self, Field},
    sqlite::{self, Connection},
};
use redis::{FromRedisValue, Value};

pub async fn info<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<HashMap<String, HashMap<String, String>>, CusError> {
    manager.get_info(cid).await
}

pub async fn ping<'r>(
    payload: String,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let params: Connection = serde_json::from_str(payload.as_str())?;
    let mut conn = ConnectionWrapper::build(params).await?;
    let _ = manager
        .execute_with(&mut redis::cmd("ping"), &mut conn)
        .await?;
    Ok(String::from("PONG"))
}
// get redis server version
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
// get slow logs
pub async fn slow_log<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<SlowLogResp, CusError> {
    let config = manager.get_config(cid, "slowlog*").await?;
    let conn = sqlite::Connection::first(cid)?;
    let mut time = String::default();
    if let Some(v) = Field::first("slowlog-log-slower-than", &config) {
        match v.value {
            response::FieldValue::Str(vv) => time = vv,
            _ => {}
        }
    }
    let mut count = String::default();
    if let Some(v) = Field::first("slowlog-max-len", &config) {
        match v.value {
            response::FieldValue::Str(vv) => count = vv,
            _ => {}
        }
    }
    let value: Vec<Value> = manager
        .execute(cid, &mut redis::cmd("slowlog").arg("get").arg(&count), None)
        .await?;
    let mut logs = vec![];
    for v in value {
        let vv: Vec<Value> = Vec::from_redis_value(&v)?;
        if conn.is_cluster {
            for vvv in vv {
                let arr: Vec<Value> = Vec::from_redis_value(&vvv)?;
                logs.push(SlowLog::build(&arr));
            }
        } else {
            logs.push(SlowLog::build(&vv));
        }
    }

    Ok(SlowLogResp { time, count, logs })
}

// reset slow log
pub async fn reset_slow_log<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    manager
        .execute(cid, &mut redis::cmd("SLOWLOG").arg("RESET"), None)
        .await
}
// get redis server module
pub async fn module<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<HashMap<String, String>>, CusError> {
    let arr: Vec<redis::Value> = manager
        .execute(cid, redis::cmd("MODULE").arg("LIST"), None)
        .await?;
    let mut resp: Vec<HashMap<String, String>> = vec![];
    for v in arr {
        match v {
            Value::Bulk(v) => {
                let mut i = 0;
                let length = v.len();
                let mut item: HashMap<String, String> = HashMap::new();
                while i < length {
                    let field_o = v.get(i);
                    i = i + 1;
                    if let Some(filed) = field_o {
                        let field_str = String::from_redis_value(filed)?;
                        let value_o = v.get(i);
                        i = i + 1;
                        if let Some(value) = value_o {
                            let mut value_str = String::from("");
                            match value {
                                Value::Data(vv) => {
                                    value_str = String::from_utf8(vv.to_vec())?;
                                }
                                Value::Int(vv) => value_str = vv.to_string(),
                                Value::Bulk(vv) => {
                                    let mut a = vec![];
                                    for x in vv {
                                        let s = String::from_redis_value(x)?;
                                        a.push(s)
                                    }
                                    value_str = a.join(",");
                                }
                                _ => {}
                            }
                            item.insert(field_str, value_str);
                        }
                    }
                }
                resp.push(item);
            }
            _ => {}
        }
    }

    Ok(resp)
}
