use core::fmt;

use serde::{Deserialize, Serialize};
use crate::redis_conn;
use crate::err::{CusError, self};
use redis::{Value, Commands};

#[derive(Deserialize)]
struct SScanArgs{
    cursor: String,
    name: String,
    search: String,
    db: u8,
    count: i64

}
#[derive(Serialize)]
pub struct SScanResp {
    cursor: String,
    fields: Vec<String>
}

pub async fn sscan(payload : &str, cid: u32) -> Result<SScanResp, CusError> {
    let args: SScanArgs = serde_json::from_str(payload)?;
    let mut conn  = redis_conn::get_connection(cid, args.db).await?;
    let mut cmd  = redis::cmd("sscan");
    cmd.arg(&args.name) .arg(&args.cursor).arg(&["COUNT", &args.count.to_string()]);
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
struct SAddArgs {
    name: String,
    db: u8,
    value: String
}

pub async fn sadd(payload : &str, cid: u32) -> Result<i64, CusError> {
    let args: SAddArgs = serde_json::from_str(payload)?;
    let mut conn  = redis_conn::get_connection(cid, args.db).await?;
    let v : i64 = conn.sadd(args.name, args.value)?;
    match v {
        0 => {
            return Err(CusError::App(String::from("value already exists in Set")));
        }
        _ => {}
    }
    Ok(v)
}

#[derive(Deserialize)]
struct SRemArgs {
    name: String,
    db: u8,
    value: String
}

pub async fn srem(payload : &str, cid: u32) -> Result<i64, CusError> {
    let args: SAddArgs = serde_json::from_str(payload)?;
    let mut conn  = redis_conn::get_connection(cid, args.db).await?;
    let v : i64 = conn.srem(args.name, args.value)?;
    match v {
        0 => {
            return Err(CusError::App(String::from("value not exists in Set")));
        }
        _ => {}
    }
    Ok(v)
}