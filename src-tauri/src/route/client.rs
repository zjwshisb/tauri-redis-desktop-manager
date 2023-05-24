use crate::{err::{CusError, self}, redis_conn};
use redis;
use serde::Deserialize;

pub fn list(payload: &str, cid: u32) ->Result<String, CusError> {
    let mut conn = redis_conn::get_connection(cid, 0)?;
    let value: redis::Value = redis::cmd("client").arg("list").query(&mut conn)?;
    if let redis::Value::Data(v) = value {
        return Ok(std::str::from_utf8(&v).unwrap().into());
    }
    Err(err::new_normal())
}

#[derive(Deserialize)]
struct  KillArgs {
    id: String
}

pub fn kill(payload: &str, cid: u32) ->Result<i64, CusError> {
    let args : KillArgs = serde_json::from_str(payload)?;
    let mut conn = redis_conn::get_connection(cid, 0)?;
    let value: redis::Value = redis::cmd("CLIENT").arg("KILL").arg(&["id", &args.id]).query(&mut conn)?;
    if let redis::Value::Int(count) = value {
        match count {
            0 => {
                return  Err(CusError::App(String::from("Client has been kill")))
            }
            _ => {
                return Ok(count);
            }
        }
    }
    Err(err::new_normal())
}