use crate::model::EventResp;
use crate::state::{PubsubItem, PubsubManager};
use crate::{err::CusError, redis_conn};
use chrono::prelude::*;
use futures::stream::StreamExt;
use rand::distributions::Alphanumeric;
use rand::prelude::*;
use redis::FromRedisValue;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::prelude::*;
use tauri::State;

use tokio::sync::{mpsc, oneshot};

#[derive(Deserialize)]
struct SubscribeArgs {
    db: u8,
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
    pubsub_manager.add(event_name_resp.clone(), PubsubItem(tx, Local::now()));
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

pub async fn publish(payload: String, cid: u32) -> Result<i64, CusError> {
    let args: PublishArgs = serde_json::from_str(&payload)?;
    let mut conn = redis_conn::get_connection(cid, args.db).await?;
    let v: redis::Value = redis::cmd("publish")
        .arg(args.channel)
        .arg(args.value)
        .query_async(&mut conn)
        .await?;
    Ok(i64::from_redis_value(&v)?)
}

#[derive(Deserialize, PartialEq)]
struct MonitorArgs {
    file: bool,
}

#[derive(Serialize)]
pub struct MonitorResp {
    pub event_name: String,
    pub file_name: String,
}

pub async fn monitor<'r>(
    window: tauri::Window,
    pubsub_manager: State<'r, PubsubManager>,
    payload: String,
    cid: u32,
) -> Result<MonitorResp, CusError> {
    let args: MonitorArgs = serde_json::from_str(&payload)?;
    let conn = redis_conn::get_connection(cid, 0).await?;

    let mut monitor = conn.into_monitor();

    let mut rng = rand::thread_rng();
    let event_name = Alphanumeric
        .sample_iter(&mut rng)
        .take(20)
        .map(char::from)
        .collect::<String>();
    let event_name_resp = event_name.clone();
    let (tx, rx) = oneshot::channel::<()>();
    let mut log_file = String::from("");
    if args.file {
        let dir_o = dirs_next::home_dir();
        match dir_o {
            Some(dir) => {
                log_file.push_str(dir.to_str().unwrap());
                log_file.push_str("/monitor-");
                log_file.push_str(&event_name);
                log_file.push_str(".log");
            }
            None => return Err(CusError::App(String::from("home dir not found"))),
        }
    }
    let file_name_resp = log_file.clone();
    pubsub_manager.add(event_name_resp.clone(), PubsubItem(tx, Local::now()));
    tokio::spawn(async move {
        let event_str = event_name.as_str();
        let _ = monitor.monitor().await;
        let mut stream = monitor.into_on_message::<redis::Value>();
        // a channel to stop file loop
        let (stop_file_tx, stop_file_rx) = oneshot::channel::<()>();
        tokio::select! {
            _ = async {
                let (file_tx, mut file_rx) = mpsc::channel::<String>(32);
                if args.file  {
                    let mut f =  File::create(log_file).unwrap();
                    tokio::spawn(async move {
                        tokio::select! {
                            _ = async {
                                let mut count = 0;
                                while let Some(mut msg) = file_rx.recv().await {
                                    msg.push_str("\r\n");
                                    dbg!(&msg);
                                    f.write(msg.as_bytes()).unwrap();
                                    count = count + 1;
                                    if count > 4 {
                                        f.flush().unwrap();
                                        count = 0;
                                    }
                                }
                            } => {

                            }
                            _ = stop_file_rx => {
                            }
                        }

                    });
                }
                while let Some(msg) = stream.next().await {
                    let msg_string =  String::from_redis_value(&msg).unwrap();
                    if args.file {
                        file_tx.send(msg_string.clone()).await.unwrap();
                    }
                    let r: EventResp<String> = EventResp::new(
                        msg_string,
                        String::from(event_str),
                    );
                    let _ = window.emit(event_str, serde_json::to_string(&r).unwrap());
                }
            } => {
            }
            _ = rx => {
                stop_file_tx.send(()).unwrap();
            }
        }
    });
    Ok(MonitorResp {
        event_name: event_name_resp,
        file_name: file_name_resp,
    })
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
    if let Some(x) = pubsub_manager.0.lock().unwrap().remove(&args.name) {
        let _ = x.0.send(());
    }
    Ok(String::from("Ok"))
}
