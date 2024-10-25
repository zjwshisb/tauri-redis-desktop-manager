
use std::collections::HashMap;

use tokio::sync::Mutex;

pub struct EventManager {
    inners: Mutex<HashMap<String, u32>>,
}

impl EventManager {
    pub fn new() -> Self {
        Self {
            inners: Mutex::new(HashMap::new()),
        }
    }
    pub async fn add(&self, name: String, id: u32) {
        self.inners.lock().await.insert(name, id);
    }

    pub async fn take(&self, name: String) -> Option<u32> {
        self.inners.lock().await.remove(&name)
    }
}
