use crate::{
    err::{self, CusError},
    state::ConnectionManager,
};
use redis::{FromRedisValue, Value};

pub async fn get_database<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let value: Value = manager
        .execute(cid, 0, redis::cmd("config").arg("get").arg("databases"))
        .await?;

    if let Value::Bulk(s) = value.clone() {
        if let Some(size) = s.get(1) {
            return Ok(String::from_redis_value(size)?);
        }
    }

    return Err(err::new_normal());
}
