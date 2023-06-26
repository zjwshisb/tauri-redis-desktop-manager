use crate::{
    err::{self, CusError},
    redis_conn,
};
use redis::{FromRedisValue, Value};

pub async fn get_database(cid: u32) -> Result<String, CusError> {
    let mut conn = redis_conn::get_connection(cid, 0).await?;
    let value: Value = redis::cmd("config")
        .arg("get")
        .arg("databases")
        .query_async(&mut conn)
        .await?;
    let value_version: redis::Value = redis::cmd("config")
        .arg("get")
        .arg("version")
        .query_async(&mut conn)
        .await?;
    if let Value::Bulk(v) = value_version {
        if let Some(version) = v.get(1) {
            let vv: String = String::from_redis_value(version)?;
            dbg!(vv);
        }
    }
    if let Value::Bulk(s) = value {
        if let Some(size) = s.get(1) {
            return Ok(String::from_redis_value(size)?);
        }
    }

    Err(err::new_normal())
}
