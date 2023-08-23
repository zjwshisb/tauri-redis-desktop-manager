use crate::conn::ConnectionManager;
use crate::model::Connection as Conn;
use crate::pubsub::{PubsubItem, PubsubManager};
use crate::response::EventResp;
use crate::utils;
use crate::{conn::CusConnection, err::CusError};
use futures::stream::StreamExt;
use redis::aio::Connection;
use redis::FromRedisValue;
use serde::{Deserialize, Serialize};

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

pub async fn subscribe<'r>(
    window: tauri::Window,
    pubsub_manager: State<'r, PubsubManager>,
    payload: String,
    cid: u32,
) -> Result<String, CusError> {
    let args: SubscribeArgs = serde_json::from_str(&payload)?;
    let model = Conn::first(cid)?;
    let host = model.get_host();
    let conn: Connection = CusConnection::get_normal(&host, &model.password).await?;
    let mut pubsub = conn.into_pubsub();
    for x in args.channels {
        pubsub.subscribe(&x).await?;
    }
    let event_name = utils::random_str(32);
    let event_name_resp = event_name.clone();
    // a channel to stop loop when frontend close the page
    let (tx, rx) = oneshot::channel::<()>();
    pubsub_manager.add(
        event_name.clone(),
        PubsubItem::new(tx, event_name.clone(), host, "pubsub".to_string()),
    );
    tokio::spawn(async move {
        let event_str = event_name.as_str();
        let mut stream = pubsub.on_message();
        tokio::select! {
            _ = async {
                while let Some(msg) = stream.next().await {
                    let channel_r: Result<redis::Value, redis::RedisError> = msg.get_channel::<redis::Value>();
                    if let Ok(channel) = channel_r {
                        let payload_r = msg.get_payload::<redis::Value>();
                        if let Ok(payload) = payload_r {
                            let r: EventResp<Message> = EventResp::new(
                                Message {
                                    payload: String::from_redis_value(&payload).unwrap(),
                                    channel: String::from_redis_value(&channel).unwrap(),
                                },
                                String::from(event_str),
                            );
                            let _ = window.emit(event_str, serde_json::to_string(&r).unwrap());

                        }
                    }
                }
            } => {

            }
            _ = rx => {
            }
        }
    });
    Ok(event_name_resp)
}

#[derive(Deserialize)]
struct PublishArgs {
    db: u8,
    channel: String,
    value: String,
}

pub async fn publish<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: PublishArgs = serde_json::from_str(&payload)?;
    let v: redis::Value = manager
        .execute(
            cid,
            args.db,
            redis::cmd("publish").arg(args.channel).arg(args.value),
        )
        .await?;
    Ok(i64::from_redis_value(&v)?)
}

pub async fn monitor<'r>(
    window: tauri::Window,
    pubsub_manager: State<'r, PubsubManager>,
    cid: u32,
) -> Result<String, CusError> {
    let model = Conn::first(cid)?;
    let host = model.get_host();
    let conn: Connection = CusConnection::get_normal(&host, &model.password).await?;
    let mut monitor: redis::aio::Monitor = conn.into_monitor();

    let event_name = utils::random_str(32);
    let event_name_resp = event_name.clone();

    // a channel to stop loop when frontend close the page
    let (tx, rx) = oneshot::channel::<()>();
    pubsub_manager.add(
        event_name_resp.clone(),
        PubsubItem::new(tx, event_name.clone(), host, "monitor".to_string()),
    );
    tokio::spawn(async move {
        let event_str = event_name.as_str();
        let _ = monitor.monitor().await;
        let mut stream = monitor.into_on_message::<redis::Value>();

        tokio::select! {
            _ = async {
                while let Some(msg) = stream.next().await {
                    let msg_string =  String::from_redis_value(&msg).unwrap();
                    let r: EventResp<String> = EventResp::new(
                        msg_string,
                        String::from(event_str),
                    );
                    let _ = window.emit(event_str, serde_json::to_string(&r).unwrap());
                }
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
pub async fn cancel<'r>(
    payload: String,
    pubsub_manager: State<'r, PubsubManager>,
) -> Result<String, CusError> {
    let args: CancelArgs = serde_json::from_str(&payload)?;
    pubsub_manager.close(&args.name);
    Ok(String::from("Ok"))
}
