use tauri::Window;

use crate::connection::{EventManager, Manager};
use crate::err::CusError;
use crate::request::IdArgs;
use crate::{response::EventResp, utils};
use redis::Value;
use std::cell::RefCell;
#[derive(serde::Serialize)]
pub struct OpenArgs {
    send: String,
    receive: String,
}

pub enum DynStr {
    Str(String),
    Vec(Vec<DynStr>),
    Int(i64),
}

impl serde::Serialize for DynStr {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match &self {
            DynStr::Str(s) => {
                return serializer.serialize_str(s);
            }
            DynStr::Vec(v) => v.serialize(serializer),
            DynStr::Int(v) => v.serialize(serializer),
        }
    }
}

impl DynStr {
    pub fn build(v: Value) -> Result<DynStr, CusError> {
        match v {
            Value::Okay => return Ok(Self::Str("Ok".to_string())),
            Value::Data(s) => {
                let result = String::from_utf8(s.clone());
                match result {
                    Ok(ss) => {
                        return Ok(Self::Str(ss));
                    }
                    Err(_) => {
                        let ss = utils::binary_to_redis_str(&s);
                        return Ok(Self::Str(ss));
                    }
                }
            }
            Value::Bulk(v) => {
                let mut vec = vec![];
                for x in v {
                    vec.push(Self::build(x)?);
                }
                return Ok(Self::Vec(vec));
            }
            Value::Nil => return Ok(Self::Str("(nil)".to_string())),
            Value::Status(s) => return Ok(Self::Str(s)),
            Value::Int(s) => return Ok(Self::Int(s)),
        }
    }
}

pub async fn open<'r>(
    cid: u32,
    window: Window,
    manager: tauri::State<'r, Manager>,
    event: tauri::State<'r, EventManager>,
) -> Result<OpenArgs, CusError> {
    let receive_event_name = utils::random_str(32);
    let send_event_name = utils::random_str(32);
    // a channel to stop loop when frontend close the page

    let inner_receive_event_name = receive_event_name.clone();
    let inner_send_event_name = send_event_name.clone();
    let window_copy = window.clone();
    let cell_conn = RefCell::new(manager.get_sync_conn(cid).await?);
    // let mut conn = manager.get_sync_connection(cid).await?;
    // let v: String = redis::cmd("get").arg("11").query(&mut conn)?;
    let event_handle = window.listen(inner_send_event_name.as_str(), move |event| {
        if let Some(p) = event.payload() {
            dbg!(p);
            let item: EventResp<Vec<String>> = serde_json::from_str(p).unwrap();
            let mut resp_item: EventResp<DynStr> =
                EventResp::new(DynStr::Str(String::new()), inner_receive_event_name.clone());
            if let Some(first) = item.data.get(0) {
                let mut cmd = redis::cmd(first);
                let mut i = 1;
                while i < item.data.len() {
                    cmd.arg(item.data.get(i).unwrap());
                    i = i + 1;
                }
                let mut conn = cell_conn.borrow_mut();
                let v: redis::RedisResult<Value> = cmd.query(&mut conn);
                dbg!(&v);
                match v {
                    Ok(vv) => {
                        resp_item.data = DynStr::build(vv).unwrap();
                    }
                    Err(e) => {
                        if let Some(s) = e.detail() {
                            resp_item.success = false;
                            resp_item.data = DynStr::Str(s.to_string())
                        }
                    }
                }
            } else {
                resp_item.success = false;
                resp_item.data = DynStr::Str("invalid args".to_string());
            }
            window_copy
                .emit(inner_receive_event_name.as_str(), &resp_item)
                .unwrap();
        }
    });
    event.add(inner_send_event_name, event_handle).await;
    // event.add(id, conn);
    Ok(OpenArgs {
        send: send_event_name,
        receive: receive_event_name,
    })
}

pub async fn cancel<'r>(
    payload: String,
    window: Window,
    event: tauri::State<'r, EventManager>,
) -> Result<(), CusError> {
    let args: IdArgs<String> = serde_json::from_str(&payload)?;
    if let Some(handle) = event.take(args.id).await {
        window.unlisten(handle);
    }
    dbg!(event.size().await);
    Ok(())
}
