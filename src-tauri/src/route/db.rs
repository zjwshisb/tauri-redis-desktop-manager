use crate::{err::{self, CusError}, redis_conn};
use serde::Deserialize;
use serde_json;

#[derive(Deserialize)]
struct DBSizeArgs{
    db: u8
}

pub fn dbsize(payload : &str,cid : u32) -> Result<i64, CusError> {
    let args: DBSizeArgs = serde_json::from_str(payload)?;
    let mut conn = redis_conn::get_connection(cid, args.db)?;
    let value: redis::Value = redis::cmd("dbsize").query(&mut conn)?;
    if let redis::Value::Int(count) = value {
        return Ok(count);
    }
    Err(err::new_normal())
}