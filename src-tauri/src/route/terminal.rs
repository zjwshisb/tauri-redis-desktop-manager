use tauri::{Event, Window};
use tokio::sync::oneshot;

use crate::connection::{ConnectionWrapper, Manager};
use crate::pubsub::{PubsubItem, PubsubManager};
use crate::{err::CusError, sqlite::Connection as ConnectionModel};
use crate::{response::EventResp, utils};

#[derive(serde::Serialize)]
pub struct OpenArgs {
    send: String,
    receive: String,
}

pub async fn open<'r>(
    cid: u32,
    window: Window,
    pubsub: tauri::State<'r, PubsubManager>,
    manager: tauri::State<'r, Manager>,
) -> Result<OpenArgs, CusError> {
    let receive_event_name = utils::random_str(32);
    let send_event_name = utils::random_str(32);
    // a channel to stop loop when frontend close the page

    let inner_receive_event_name = receive_event_name.clone();
    let inner_send_event_name = send_event_name.clone();
    let window_copy = window.clone();
    // let mut conn = manager.get_sync_connection(cid).await?;
    // let v: String = redis::cmd("get").arg("11").query(&mut conn)?;
    window.listen(inner_send_event_name.as_str(), move |event| {
        if let Some(p) = event.payload() {
            dbg!(p);
            let mut item: EventResp<Vec<String>> = serde_json::from_str(p).unwrap();
            let mut resp_item = EventResp::new(vec![], inner_receive_event_name.clone());

            if let Some(first) = item.data.get(0) {
                let mut cmd = redis::cmd(first);
                let mut i = 1;
                while i < item.data.len() {
                    cmd.arg(item.data.get(i).unwrap());
                    i = i + 1;
                }
                let result: redis::RedisResult<redis::Value> =
                    manager.execute_with(cid, cmd, db).await?;
            } else {
                resp_item.data.push(String::from("please enter command"));
            }

            window_copy
                .emit(inner_receive_event_name.as_str(), &resp_item)
                .unwrap();
        }
    });

    Ok(OpenArgs {
        send: send_event_name,
        receive: receive_event_name,
    })
}
