use redis::{Client, Value};
use serde::{Deserialize};
use crate::{err::CusError, redis_conn};

#[derive(Deserialize, Debug)]
struct P {
    host: String,
    port: i64,
    auth: String
}

pub fn info(payload: &str, cid: u8) -> Result<String, CusError> {
  
    let mut connection = redis_conn::get_connection(cid)?;
    let v: Value = redis::cmd("info").query(&mut connection)?;
    match v {
        Value::Data(ve) => {
            let s = std::str::from_utf8(&ve).unwrap();
            return Ok(String::from(s))
        }
        Value::Status(s) => {
            return Ok(s);
        }
        _ => {}
    }
    Ok(String::from("OK"))
}

pub fn ping(payload: &str) -> Result<String, CusError> {
    let params : P = serde_json::from_str(payload)?;
    let url = format!("redis://{}:{}", params.host, params.port);
    println!("{}", url);
    let client = Client::open(url)?;
    let mut connection = client.get_connection()?;
    if params.auth != "" {
        redis::cmd("auth").arg(params.auth).query(&mut connection)?;
    }
    let v: Value = redis::cmd("ping").query(&mut connection)?;
    match v {
        Value::Data(ve) => {
            let s = std::str::from_utf8(&ve).unwrap();
            return Ok(String::from(s))
        }
        Value::Status(s) => {
            return Ok(s);
        }
        _ => {}
    }
    Ok(String::from("OK"))
}