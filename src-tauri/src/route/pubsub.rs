use crate::connection::{Connectable, Connection, Manager};
use crate::err::CusError;
use crate::pubsub::{PubsubItem, PubsubManager};
use crate::response::EventResp;
use crate::sqlite::Connection as ConnectionModel;
use crate::utils;
use futures::StreamExt;

use redis::FromRedisValue;
use serde::{Deserialize, Serialize};

use tauri::Emitter;
use tauri::State;

use tokio::sync::oneshot;

#[derive(Deserialize)]
struct SubscribeArgs {
    channels: Vec<String>,
}
#[derive(Serialize, Debug)]
struct Message {
    channel: String,
    payload: String,
}

pub async fn subscribe(
    window: tauri::Window,
    pubsub_manager: State<'_, PubsubManager>,
    payload: String,
    cid: u32,
) -> Result<String, CusError> {
    let args: SubscribeArgs = serde_json::from_str(&payload)?;

    let event_name = utils::random_str(32);
    let event_name_resp = event_name.clone();
    let model = ConnectionModel::first(cid)?;
    let (tx, rx) = oneshot::channel::<()>();
    // a channel to stop loop when frontend close the page
    let connection = Connection::new(model.get_params());
    pubsub_manager.add(
        event_name.clone(),
        PubsubItem::new(
            tx,
            event_name.clone(),
            connection.get_host(),
            "pubsub".to_string(),
            connection.get_proxy(),
        ),
    );
    tokio::spawn(async move {
        let conn_result = connection.get_sync_one().await;
        match conn_result {
            Err(e) => {
                println!("{}", e)
            }
            Ok(mut conn) => {
                let mut subpub = conn.as_pubsub();
                for x in args.channels {
                    let result = subpub.subscribe(&x);
                    match result {
                        Err(e) => {
                            println!("{}", e)
                        }
                        Ok(_) => {
                            println!("ok")
                        }
                    }
                }
                let event_str = event_name.as_str();
                tokio::select! {
                    _ = async {
                        loop {
                            let msg = subpub.get_message();
                            if let Ok(message) = msg {
                                let payload = message.get_payload::<String>()?;
                                let r: EventResp<Message> = EventResp::new(
                                    Message {
                                        channel: message.get_channel_name().to_string(),
                                        payload,
                                    },
                                    String::from(event_str),
                                );
                                let _ = window.emit(event_str, serde_json::to_string(&r)?);
                            } else {
                                break
                            }
                        }
                        Ok::<(), CusError>(())
                    } => {},
                    _ = rx => {
                    }
                }
            }
        }
        drop(connection);
    });
    Ok(event_name_resp)
}

#[derive(Deserialize)]
struct PublishArgs {
    db: u8,
    channel: String,
    value: String,
}

pub async fn publish(
    payload: String,
    cid: u32,
    manager: State<'_, Manager>,
) -> Result<i64, CusError> {
    let args: PublishArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("publish").arg(args.channel).arg(args.value),
            Some(args.db),
        )
        .await
}

pub async fn monitor(
    window: tauri::Window,
    pubsub_manager: State<'_, PubsubManager>,
    cid: u32,
) -> Result<String, CusError> {
    let model = ConnectionModel::first(cid)?;
    let connection = Connection::new(model.get_params());

    let event_name = utils::random_str(32);
    let event_name_resp = event_name.clone();

    // // a channel to stop loop when frontend close the page
    let (tx, rx) = oneshot::channel::<()>();
    pubsub_manager.add(
        event_name_resp.clone(),
        PubsubItem::new(
            tx,
            event_name.clone(),
            connection.get_host(),
            "monitor".to_string(),
            connection.get_proxy(),
        ),
    );
    let mut monitor = connection.get_monitor().await?;
    tokio::spawn(async move {
        let event_str = event_name.as_str();
        let _ = monitor.monitor().await;
        let mut stream = monitor.into_on_message();
        tokio::select! {
            _ = async {
                loop {
                    if let Some(msg) = stream.next().await {
                        let msg_string =  String::from_redis_value(&msg)?;
                        let r: EventResp<String> = EventResp::new(
                            msg_string,
                            String::from(event_str),
                        );
                        let _ = window.emit(event_str, serde_json::to_string(&r)?);
                    } else {
                        break;
                    }
                }
                Ok::<_, CusError>(())
            } => {
            }
            _ = rx => {
            }
        }
    });
    Ok(event_name_resp)
}

#[derive(Deserialize)]
struct CancelArgs {
    name: String,
}
pub async fn cancel(
    payload: String,
    pubsub_manager: State<'_, PubsubManager>,
) -> Result<String, CusError> {
    let args: CancelArgs = serde_json::from_str(&payload)?;
    pubsub_manager.close(&args.name);
    Ok(String::from("OK"))
}
