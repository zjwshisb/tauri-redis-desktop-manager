use chrono::prelude::*;
use redis::Cmd;
use std::collections::HashMap;
use tokio::sync::oneshot;

use crate::redis_conn::RedisConnection;
use crate::{err::CusError, redis_conn::CusCmd};
use std::sync::Mutex as SMutex;
use tokio::sync::{mpsc::Sender, Mutex};

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
    tx: Mutex<Vec<Sender<CusCmd>>>,
}

impl ConnectionManager {
    pub fn new() -> ConnectionManager {
        ConnectionManager {
            map: Mutex::new(HashMap::new()),
            tx: Mutex::new(vec![]),
        }
    }
    pub async fn add(&self, cid: u32, conn: RedisConnection) {
        self.map.lock().await.insert(cid, conn);
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            let _ = self.set_name(conn, "tauri-redis".to_string()).await;
        }
    }

    pub async fn set_name(&self, conn: &mut RedisConnection, name: String) -> Result<(), CusError> {
        self.execute_with(redis::cmd("CLIENT").arg("SETNAME").arg(&name), conn)
            .await?;
        Ok(())
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

    pub async fn execute_with(
        &self,
        cmd: &mut Cmd,
        conn: &mut RedisConnection,
    ) -> Result<redis::Value, CusError> {
        let (c, cus_cmd) = conn.execute(cmd).await?;
        if let Some(tx) = self.tx.lock().await.get_mut(0) {
            let _ = tx.send(cus_cmd).await;
        }
        return Ok(c);
    }

    pub async fn execute(
        &self,
        cid: u32,
        db: u8,
        cmd: &mut redis::Cmd,
    ) -> Result<redis::Value, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            if !conn.is_cluster && conn.db != db {
                let _ = self
                    .execute_with(redis::cmd("select").arg(db), conn)
                    .await?;
                conn.db = db
            }
            let v = self.execute_with(cmd, conn).await?;
            return Ok(v);
        }
        return Err(CusError::App(String::from("Connection Not Found")));
    }

    pub async fn remove(&self, cid: u32) {
        self.map.lock().await.remove(&cid);
    }

    pub async fn set_tx(&self, tx: Sender<CusCmd>) {
        self.tx.lock().await.insert(0, tx);
    }

    pub async fn remove_tx(&self) {
        self.tx.lock().await.remove(0);
    }
}
