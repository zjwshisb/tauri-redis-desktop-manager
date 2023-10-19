use std::collections::HashMap;

use crate::err::CusError;
use crate::request::{CommonValueArgs, NameArgs};
use crate::response::{Field, FieldValue};
use crate::ConnectionManager;
use redis::{FromRedisValue, Value};

pub async fn list<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<Field>, CusError> {
    let args: NameArgs = serde_json::from_str(&payload)?;
    let v: Vec<Value> = manager
        .execute(
            cid,
            redis::cmd("TOPK.LIST").arg(args.name).arg("WITHCOUNT"),
            Some(args.db),
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
                    name: String::from_redis_value(name)?,
                    value: FieldValue::Int(i64::from_redis_value(count)?),
                };
                i = i + 1;
                resp.push(f);
            }
        }
    }
    Ok(resp)
}

pub async fn info<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<HashMap<String, FieldValue>, CusError> {
    let mut resp: HashMap<String, FieldValue> = HashMap::new();
    let args: NameArgs = serde_json::from_str(&payload)?;
    let v: Vec<Value> = manager
        .execute(cid, redis::cmd("TOPK.INFO").arg(args.name), Some(args.db))
        .await?;
    let mut i = 0;
    let length = v.len();
    while i < length {
        if let Some(name) = v.get(i) {
            i = i + 1;
            if let Some(value) = v.get(i) {
                let name_str = String::from_redis_value(name)?;
                match value {
                    Value::Int(s) => {
                        resp.insert(name_str, FieldValue::Int(*s));
                    }
                    Value::Data(s) => {
                        resp.insert(name_str, FieldValue::Str(String::from_utf8(s.to_vec())?));
                    }
                    _ => {}
                }
                i = i + 1;
            }
        }
    }
    Ok(resp)
}

pub async fn add<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let args: CommonValueArgs = serde_json::from_str(&payload)?;
    let v: Value = manager
        .execute(
            cid,
            redis::cmd("TOPK.ADD").arg(args.name).arg(args.value),
            Some(args.db),
        )
        .await?;
    match v {
        Value::Okay => return Ok(String::from("OK")),
        Value::Nil => {
            return Ok(String::from("nil"));
        }
        _ => {}
    }
    Ok(String::from("OK"))
}
