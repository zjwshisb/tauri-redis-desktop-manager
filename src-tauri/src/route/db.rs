use crate::{
    err::{self, CusError},
    redis_conn,
};
use serde::Deserialize;
use serde_json;

#[derive(Deserialize)]
struct DBSizeArgs {
    db: u8,
}

pub async fn dbsize(payload: String, cid: u32) -> Result<i64, CusError> {
    let args: DBSizeArgs = serde_json::from_str(&payload)?;
    let mut conn = redis_conn::get_connection(cid, args.db).await?;
    let value: redis::Value = redis::cmd("dbsize").query_async(&mut conn).await?;
    if let redis::Value::Int(count) = value {
        return Ok(count);
    }
    Err(err::new_normal())
}
