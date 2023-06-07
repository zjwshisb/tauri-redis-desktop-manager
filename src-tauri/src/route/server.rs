use crate::{err::CusError, redis_conn};
use redis::{Client, FromRedisValue, Value};
use serde::Deserialize;
use tokio::time::{timeout, Duration};

#[derive(Deserialize, Debug)]
struct P {
    host: String,
    port: i64,
    password: String,
}

pub async fn info(cid: u32) -> Result<String, CusError> {
    let mut connection = redis_conn::get_connection(cid, 0).await?;
    let v: Value = redis::cmd("info").query_async(&mut connection).await?;

    Ok(String::from_redis_value(&v)?)
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
