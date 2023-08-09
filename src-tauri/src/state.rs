use chrono::prelude::*;
use std::collections::HashMap;
use tokio::sync::oneshot;

use crate::err::CusError;
use crate::redis_conn::RedisConnection;
use std::sync::Mutex as SMutex;
use tokio::sync::Mutex;

pub struct PubsubItem(pub oneshot::Sender<()>, pub DateTime<Local>);

pub struct PubsubManager(pub SMutex<HashMap<String, PubsubItem>>);

impl PubsubManager {
    pub fn new() -> PubsubManager {
        PubsubManager(SMutex::new(HashMap::new()))
    }
    pub fn add(&self, name: String, item: PubsubItem) {
        self.0.lock().unwrap().insert(name, item);
    }
}

pub struct ConnectionManager {
    pub m: Mutex<HashMap<u32, RedisConnection>>,
}

impl ConnectionManager {
    pub fn new() -> ConnectionManager {
        ConnectionManager {
            m: Mutex::new(HashMap::new()),
        }
    }
    pub async fn add(&self, cid: u32, item: RedisConnection) {
        self.m.lock().await.insert(cid, item);
    }

    pub async fn get_server_node(&self, cid: u32) -> Result<Vec<String>, CusError> {
        if let Some(conn) = self.m.lock().await.get_mut(&cid) {
            return Ok(conn.get_nodes().await?);
        }
        return Err(CusError::App(String::from("Connection Not Found")));
    }

    pub async fn get_info(&self, cid: u32) -> Result<Vec<HashMap<String, String>>, CusError> {
        if let Some(conn) = self.m.lock().await.get_mut(&cid) {
            return conn.get_info().await;
        }
        return Err(CusError::App(String::from("Connection Not Found")));
    }

    pub async fn get_version(&self, cid: u32) -> Result<String, CusError> {
        if let Some(conn) = self.m.lock().await.get_mut(&cid) {
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
        if let Some(conn) = self.m.lock().await.get_mut(&cid) {
            return conn.execute(cmd, db).await;
        }
        return Err(CusError::App(String::from("Connection Not Found")));
    }

    pub async fn remove(&self, cid: u32) {
        self.m.lock().await.remove(&cid);
    }
}
