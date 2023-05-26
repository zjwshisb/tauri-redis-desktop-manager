use core::fmt;

use serde::{Deserialize, Serialize};
use crate::redis_conn;
use crate::err::{CusError, self};
use redis::{Value, Commands};

#[derive(Deserialize)]
struct SScanArgs<'a> {
    cursor: &'a str,
    name: &'a str,
    search: &'a str,
    db: u8
}
#[derive(Serialize)]
pub struct SScanResp {
    cursor: String,
    fields: Vec<String>
}

pub fn sscan(payload : &str, cid: u32) -> Result<SScanResp, CusError> {
    let args: SScanArgs = serde_json::from_str(payload)?;
    let mut conn  = redis_conn::get_connection(cid, args.db)?;
    let mut cmd  = redis::cmd("sscan");
    cmd.arg(&args.name) .arg(&args.cursor);
    if args.search != "" {
        cmd.arg(&["MATCH", &format!("*{}*", args.search)]);
    }
    let values = cmd.query(&mut conn)?;
    dbg!(&values);
    if let Value::Bulk(s) = values {
        let cursor_value = s.get(0).unwrap();
        let mut cursor   = String::from("0");
        let mut fields : Vec<String>= vec![];
        if let Value::Data(vv) = cursor_value {
            cursor = std::str::from_utf8(&vv).unwrap().into()
        }
        let keys_vec = s.get(1);
        if let Some(s)  = keys_vec {
            if let Value::Bulk(arr)  = s {
                for v in arr {
                    if let Value::Data(vv) = v {
                        fields.push(std::str::from_utf8(&vv).unwrap().into())
                    }
                }    
            };
        };
        return Ok(SScanResp{
            cursor: cursor,
            fields: fields
        })
    } 
    Err(err::new_normal())
}

#[derive(Deserialize)]
struct SAddArgs<'a> {
    name: &'a str,
    db: u8,
    value: &'a str
}

pub fn sadd(payload : &str, cid: u32) -> Result<i64, CusError> {
    let args: SAddArgs = serde_json::from_str(payload)?;
    let mut conn  = redis_conn::get_connection(cid, args.db)?;
    let v : i64 = conn.sadd(args.name, args.value)?;
    match v {
        0 => {
            return Err(CusError::App(format!("{} exists in {}", args.value, args.name)));
        }
        _ => {}
    }
    Ok(v)
}

#[derive(Deserialize)]
struct SRemArgs<'a> {
    name: &'a str,
    db: u8,
    value: &'a str
}

pub fn srem(payload : &str, cid: u32) -> Result<i64, CusError> {
    let args: SAddArgs = serde_json::from_str(payload)?;
    let mut conn  = redis_conn::get_connection(cid, args.db)?;
    let v : i64 = conn.srem(args.name, args.value)?;
    match v {
        0 => {
            return Err(CusError::App(format!("{} exists in {}", args.value, args.name)));
        }
        _ => {}
    }
    Ok(v)
}