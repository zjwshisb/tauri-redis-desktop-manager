use std::{collections::HashMap, fmt::Debug};

use crate::{err::CusError, redis_conn::RedisConnection, state::ConnectionManager};
use redis::FromRedisValue;
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
    let mut conn = RedisConnection::build_anonymous(&host, &params.password).await?;
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
