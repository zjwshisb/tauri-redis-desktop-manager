use crate::{
    err::{self, CusError},
    redis_conn::{self, RedisManager},
};
use redis::Value;
use tauri::State;

pub async fn get_database(cid: u32) -> Result<String, CusError> {
    let mut conn = redis_conn::get_connection(cid, 0).await?;
    let value: Value = redis::cmd("config")
        .arg("get")
        .arg("databases")
        .query_async(&mut conn)
        .await?;
    if let Value::Bulk(s) = value {
        if let Some(size) = s.get(1) {
            if let Value::Data(vv) = size {
                return Ok(std::str::from_utf8(vv).unwrap().into());
            }
        }
    }

    Err(err::new_normal())
}
