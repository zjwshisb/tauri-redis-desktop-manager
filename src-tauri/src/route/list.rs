use serde::Deserialize;

use crate::{err::{CusError, self}, redis_conn};

#[derive(Deserialize)]
struct LRangeArgs {
    name: String,
    start: i64,
    stop: i64,
    db: u8
}

pub fn lrange(payload : &str, cid: u32) -> Result<Vec<String>, CusError> {
    let args: LRangeArgs = serde_json::from_str(payload)?;
    let mut conn  = redis_conn::get_connection(cid, args.db)?;
    let values : redis::Value = redis::cmd("lrange")
    .arg(&args.name)
    .arg(&args.start).arg(&args.stop).query(&mut conn)?;
    if let redis::Value::Bulk(arr) = values {
        let mut res : Vec<String> = vec![];
        for i in arr {
            if let redis::Value::Data(vv) = i {
                res.push(std::str::from_utf8(&vv).unwrap().into())
            }
        }
        return Ok(res);
    }
    Err(err::new_normal())
}

#[derive(Deserialize)]
struct LSetArgs {
    name: String,
    index: i64,
    value: String,
    db: u8
}
pub fn lset(payload : &str, cid: u32) -> Result<String, CusError> {
    let args : LSetArgs = serde_json::from_str(payload)?;
    let mut conn  = redis_conn::get_connection(cid, args.db)?;
    let value : redis::Value = redis::cmd("lset")
    .arg(&args.name)
    .arg(args.index).arg(&args.value).query(&mut conn)?;
    if let redis::Value::Okay = value {
        return Ok(String::from("OK"));
    }
    Err(err::new_normal())
}

#[derive(Deserialize)]
struct LTrimArgs {
    name: String,
    db: u8,
    start: i64,
    stop: i64,
}

pub fn ltrim(payload : &str, cid: u32) -> Result<String, CusError> {
    let args : LTrimArgs = serde_json::from_str(payload)?;
    let mut conn  = redis_conn::get_connection(cid, args.db)?;
    let value : redis::Value = redis::cmd("ltrim")
    .arg(&args.name)
    .arg(args.start).arg(args.stop).query(&mut conn)?;
    if let redis::Value::Okay = value {
        return Ok(String::from("OK"));
    }
    Err(err::new_normal())
}

#[derive(Deserialize)]
struct InsertArgs {
    name: String,
    db: u8,
    types: String,
    value: String,
    pivot: String
}
pub fn linsert(payload : &str, cid: u32) -> Result<i64, CusError> {
    let args : InsertArgs = serde_json::from_str(payload)?;
    let mut conn  = redis_conn::get_connection(cid, args.db)?;
    let value : redis::Value = redis::cmd("linsert")
    .arg(&args.name)
    .arg(&args.types)
    .arg(&args.pivot)
    .arg(&args.value).
    query(&mut conn)?;
    if let redis::Value::Int(r) = value {
        match r {
            0 => {
                return Err(CusError::App(String::from("key not exist")))
            }
            -1 => {
                return Err(CusError::App(String::from("the pivot wasn't found.")))
            }
            _ => {
                return Ok(r)
            }
        }
    }
    Err(err::new_normal())
}