use tauri::{Emitter, Event, Listener, Window};

use crate::connection::{CValue, EventManager, Manager};
use crate::err::CusError;
use crate::request::IdArgs;
use crate::{response::EventResp, utils};
use redis::{Cmd, RedisResult, Value as RedisValue};
use std::cell::RefCell;
#[derive(serde::Serialize)]

pub struct OpenArgs {
    send: String,
    receive: String,
}

pub async fn open(
    cid: u32,
    window: Window,
    manager: tauri::State<'_, Manager>,
    event: tauri::State<'_, EventManager>,
) -> Result<OpenArgs, CusError> {
    let receive_event_name = utils::random_str(32);
    let send_event_name = utils::random_str(32);

    let inner_receive_event_name = receive_event_name.clone();
    let inner_send_event_name = send_event_name.clone();
    let window_copy = window.clone();
    fn cmd_handle<F>(s: &str, func: F) -> EventResp<CValue>
    where
        F: Fn(Cmd) -> RedisResult<RedisValue>,
    {
        let item: EventResp<Vec<String>> = serde_json::from_str(s).unwrap();
        let cmd_vec = item.data;
        let mut resp_item: EventResp<CValue> = EventResp::new(CValue::Nil, String::new());
        if let Some(first) = cmd_vec.first() {
            if first.to_lowercase() == "monitor" || first.to_lowercase() == "subscribe" {
                resp_item.success = false;
                resp_item.data = CValue::Str("not support this command".to_string());
            } else {
                let mut cmd = redis::cmd(first);
                let mut i = 1;
                while i < cmd_vec.len() {
                    cmd.arg(cmd_vec.get(i).unwrap());
                    i += 1;
                }
                let result = func(cmd);
                match result {
                    Ok(vv) => {
                        resp_item.data = CValue::build(vv);
                    }
                    Err(e) => {
                        if let Some(s) = e.detail() {
                            resp_item.success = false;
                            resp_item.data = CValue::Str(s.to_string())
                        }
                    }
                }
            }
        } else {
            resp_item.success = false;
            resp_item.data = CValue::Str("invalid args".to_string());
        }
        resp_item
    }

    if manager.get_is_cluster(cid).await {
        let cell_conn = RefCell::new(manager.get_sync_cluster_conn(cid).await?);
        let event_id = window.listen(inner_send_event_name.as_str(), move |event: Event| {
            let mut resp_item = cmd_handle(event.payload(), |cmd| {
                let mut conn = cell_conn.borrow_mut();
                cmd.query(&mut conn)
            });
            resp_item.event = inner_receive_event_name.clone();
            window_copy
                .emit(inner_receive_event_name.as_str(), &resp_item)
                .unwrap();
        });
        event.add(inner_send_event_name, event_id).await;
    } else {
        let cell_conn = RefCell::new(manager.get_sync_conn(cid).await?);
        let event_handle = window.listen(inner_send_event_name.as_str(), move |event| {
            let mut resp_item = cmd_handle(event.payload(), |cmd| {
                let mut conn = cell_conn.borrow_mut();
                cmd.query(&mut conn)
            });
            resp_item.event = inner_receive_event_name.clone();
            window_copy
                .emit(inner_receive_event_name.as_str(), &resp_item)
                .unwrap();
        });
        event.add(inner_send_event_name, event_handle).await;
    }

    // event.add(id, conn);
    Ok(OpenArgs {
        send: send_event_name,
        receive: receive_event_name,
    })
}

pub async fn cancel(
    payload: String,
    window: Window,
    event: tauri::State<'_, EventManager>,
) -> Result<(), CusError> {
    let args: IdArgs<String> = serde_json::from_str(&payload)?;
    if let Some(handle) = event.take(args.id).await {
        window.unlisten(handle);
    }
    Ok(())
}
