use chrono::prelude::*;
use std::collections::HashMap;
use tokio::sync::oneshot;

use crate::err::CusError;
use crate::redis_conn::RedisConnection;
use std::sync::Mutex as SMutex;
use tokio::sync::Mutex;

pub struct PubsubItem {
    pub tx: oneshot::Sender<()>,
    pub created_at: DateTime<Local>,
    pub types: String,
    pub host: String,
}
impl PubsubItem {
    pub fn new(tx: oneshot::Sender<()>, host: String, types: String) -> Self {
        Self {
            tx,
            created_at: Local::now(),
            types,
            host,
        }
    }
}

// a state to manager pubsub/monitor
pub struct PubsubManager(pub SMutex<HashMap<String, PubsubItem>>);
impl PubsubManager {
    pub fn new() -> PubsubManager {
        PubsubManager(SMutex::new(HashMap::new()))
    }
    pub fn add(&self, name: String, item: PubsubItem) {
        self.0.lock().unwrap().insert(name, item);
    }
    pub fn close(&self, name: &String) {
        if let Some(x) = self.0.lock().unwrap().remove(name) {
            let _ = x.tx.send(());
        }
    }
}

// a state to manager redis connection
pub struct ConnectionManager {
    pub map: Mutex<HashMap<u32, RedisConnection>>,
}

impl ConnectionManager {
    pub fn new() -> ConnectionManager {
        ConnectionManager {
            map: Mutex::new(HashMap::new()),
        }
    }
    pub async fn add(&self, cid: u32, item: RedisConnection) {
        self.map.lock().await.insert(cid, item);
    }

    pub async fn get_server_node(&self, cid: u32) -> Result<Vec<String>, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            return Ok(conn.get_nodes().await?);
        }
        return Err(CusError::App(String::from("Connection Not Found")));
    }

    pub async fn get_info(&self, cid: u32) -> Result<Vec<HashMap<String, String>>, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            return conn.get_info().await;
        }
        return Err(CusError::App(String::from("Connection Not Found")));
    }

    pub async fn get_version(&self, cid: u32) -> Result<String, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            return conn.get_version().await;
        }
        return Err(CusError::App(String::from("Connection Not Found")));
    }

    pub async fn execute(
        &self,
        cid: u32,
        db: u8,
        cmd: &mut redis::Cmd,
    ) -> Result<redis::Value, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            return conn.execute(cmd, db).await;
        }
        return Err(CusError::App(String::from("Connection Not Found")));
    }

    pub async fn remove(&self, cid: u32) {
        self.map.lock().await.remove(&cid);
    }
}
