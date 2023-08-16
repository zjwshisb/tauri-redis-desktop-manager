use chrono::prelude::*;
use std::collections::HashMap;
use std::sync::Mutex as SMutex;
use tokio::sync::oneshot;

use crate::response;

pub struct PubsubItem {
    pub tx: oneshot::Sender<()>,
    pub created_at: DateTime<Local>,
    pub types: String,
    pub host: String,
    pub id: String,
}
impl PubsubItem {
    pub fn new(tx: oneshot::Sender<()>, id: String, host: String, types: String) -> Self {
        Self {
            tx,
            created_at: Local::now(),
            types,
            host,
            id,
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

    pub fn get_conns(&self) -> Vec<response::Conn> {
        let mut vec = vec![];
        for (_, v) in self.0.lock().unwrap().iter() {
            vec.push(response::Conn {
                id: v.id.clone(),
                host: v.host.clone(),
                created_at: v.created_at.format("%Y-%m-%d %H:%M:%S").to_string(),
                types: v.types.clone(),
            })
        }
        vec
    }
}
