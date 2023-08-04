use std::fmt::Debug;

use crate::{err::CusError, state::ConnectionManager};
use redis::{Client, FromRedisValue, Value};
use serde::Deserialize;
use tokio::time::{timeout, Duration};

#[derive(Deserialize, Debug)]
struct P {
    host: String,
    port: i64,
    password: String,
}

pub async fn info<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<String>, CusError> {
    let v: Value = manager.execute(cid, 0, &mut redis::cmd("info")).await?;
    match v {
        Value::Nil => {}
        Value::Data(cc) => {
            if let Ok(r) = String::from_utf8(cc) {
                return Ok(vec![r]);
            }
        }
        Value::Bulk(vv) => {
            let mut r: Vec<String> = vec![];
            for vvv in vv {
                r.push(String::from_redis_value(&vvv)?);
            }
            return Ok(r);
        }
        Value::Int(_) => todo!(),
        Value::Status(_) => todo!(),
        Value::Okay => todo!(),
    }
    return Err(CusError::App(String::from("Connected Timeout")));
}

pub async fn ping(payload: String) -> Result<String, CusError> {
    let params: P = serde_json::from_str(payload.as_str())?;
    let url = format!("redis://{}:{}", params.host, params.port);
    let client = Client::open(url)?;

    let rx = timeout(Duration::from_secs(5), client.get_async_connection()).await;
    match rx {
        Ok(c) => match c {
            Ok(mut connection) => {
                if params.password != "" {
                    redis::cmd("auth")
                        .arg(params.password)
                        .query_async(&mut connection)
                        .await?;
                }
                let v: Value = redis::cmd("ping").query_async(&mut connection).await?;
                Ok(String::from_redis_value(&v)?)
            }
            Err(r) => {
                return Err(CusError::App(r.to_string()));
            }
        },
        Err(_) => {
            return Err(CusError::App(String::from("Connected Timeout")));
        }
    }
}
