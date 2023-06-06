use crate::model::EventResp;
use crate::state::{self, PubsubItem, PubsubManager};
use crate::{
    err::{self, CusError},
    redis_conn,
};
use chrono::prelude::*;
use futures::stream::StreamExt;
use rand::distributions::Alphanumeric;
use rand::prelude::*;
use redis::FromRedisValue;
use serde::{Deserialize, Serialize};
use tauri::State;
use tokio::sync::oneshot;

#[derive(Deserialize)]
struct SubscribeArgs {
    db: u8,
    channels: Vec<String>,
}
#[derive(Serialize)]
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
    let conn = redis_conn::get_connection(cid, args.db).await?;

    let mut pubsub = conn.into_pubsub();
    for x in args.channels {
        pubsub.subscribe(&x).await?;
    }
    let mut rng = rand::thread_rng();
    let event_name = Alphanumeric
        .sample_iter(&mut rng)
        .take(20)
        .map(char::from)
        .collect::<String>();
    let event_name_resp = event_name.clone();
    let (tx, rx) = oneshot::channel::<()>();
    // let rx_ref: RefCell<oneshot::Receiver<()>> = RefCell::new(rx);
    pubsub_manager.add(event_name_resp.clone(), PubsubItem(tx, Utc::now()));
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
                            let result = window.emit(event_str, serde_json::to_string(&r).unwrap());
                            if let Err(e) = result {
                                dbg!(e);
                            }
                        }
                    }
                }
            } => {}
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
pub async fn publish(payload: String, cid: u32) -> Result<i64, CusError> {
    let args: PublishArgs = serde_json::from_str(&payload)?;
    let mut conn = redis_conn::get_connection(cid, args.db).await?;
    let v: redis::Value = redis::cmd("publish")
        .arg(args.channel)
        .arg(args.value)
        .query_async(&mut conn)
        .await?;
    if let redis::Value::Int(count) = v {
        return Ok(count);
    }
    Err(err::new_normal())
}

#[derive(Deserialize)]
struct CancelArgs {
    name: String,
    db: u8,
}
pub async fn cancel<'r>(
    payload: String,
    pubsub_manager: State<'r, PubsubManager>,
) -> Result<String, CusError> {
    let args: CancelArgs = serde_json::from_str(&payload)?;
    if let Some(x) = pubsub_manager.0.lock().unwrap().get_mut(&args.name) {
        x.close();
    }
    Ok(String::from("Ok"))
}
