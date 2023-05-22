use redis::{Value};
use serde::{Serialize, Deserialize};
use crate::{err::CusError, redis_conn};
use crate::model::{Field};

#[derive(Deserialize)]
struct HScanArgs {
    name: String,
    cursor: String,
    db: u8
}
#[derive(Serialize)]
pub struct HScanResp {
    cursor: String,
    fields: Vec<Field>
}

pub fn hscan(payload : &str, cid: u32) -> Result<HScanResp, CusError> {
    let args: HScanArgs = serde_json::from_str(&payload)?;
    let mut connection = redis_conn::get_connection(cid, args.db)?;
    let _ : Value = redis::cmd("select").arg(args.db).query(&mut connection)?;
    let value: Value = redis::cmd("hscan")
    .arg(args.name).arg(args.cursor)
    .arg(&["COUNT", "100"])
    .query(& mut connection)?;
    if let Value::Bulk(s) = value {
        let cursor_value = s.get(0).unwrap();
        let mut cursor   = String::from("0");
        let mut fields : Vec<Field>= vec![];
        dbg!(&s);
        if let Value::Data(vv) = cursor_value {
             cursor = std::str::from_utf8(&vv).unwrap().into()
        }
        let keys_vec = s.get(1);
         if let Some(s)  = keys_vec {
                if let Value::Bulk(vec)  = s {
                    let length = vec.len();
                    let mut current: usize = 0;
                    while current < length {
                        let mut field : Field = Field { 
                            name: String::from(""), 
                            value: String::from("")
                         };
                        let key_value = vec.get(current).unwrap();
                        if let Value::Data(key) = key_value {
                            field.name = std::str::from_utf8(key).unwrap().into()
                        }
                        current = current + 1;
                        let value_value = vec.get(current).unwrap();
                        if let Value::Data(value) = value_value {
                            field.value = std::str::from_utf8(value).unwrap().into()
                        }
                        current = current + 1;
                        fields.push(field);
                    }
                   
                };
            };
            Ok(HScanResp{
                cursor, 
                fields
            })
    } else {
        Err(CusError::App(("not a hash key").into()))

    }
}

#[derive(Deserialize)]
struct HSetArgs {
    name: String,
    field: String,
    value: String,
    db: u8,
}
pub fn hset(payload: &str, cid: u32) -> Result<i64, CusError> {
    let args: HSetArgs = serde_json::from_str(&payload)?;
    let mut connection = redis_conn::get_connection(cid, args.db)?;
    let value: Value = redis::cmd("hset").arg(&args.name).arg(&[args.field, args.value]).query(&mut connection)?;
    if let Value::Int(count) = value {
        return Ok(count);
    }
    Err(CusError::App(String::from("something wrong")))
}
#[derive(Deserialize)]
struct  HDelArgs{
    name: String,
    fields: Vec<String>,
    db: u8,
}

pub fn hdel(payload: &str, cid: u32) ->Result<i64, CusError> {
    let args: HDelArgs = serde_json::from_str(&payload)?;
    let mut connection = redis_conn::get_connection(cid, args.db)?;
    let value: Value = redis::cmd("hdel").arg(&args.name).arg(&args.fields).query(&mut connection)?;
    if let Value::Int(count) = value {
        return Ok(count);
    }
    Err(CusError::App(String::from("something wrong")))
}
