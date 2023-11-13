use std::collections::HashMap;

use tauri::EventHandler;
use tokio::sync::Mutex;

pub struct EventManager {
    inners: Mutex<HashMap<String, EventHandler>>,
}

impl EventManager {
    pub fn new() -> Self {
        Self {
            inners: Mutex::new(HashMap::new()),
        }
    }
    pub async fn add(&self, name: String, handle: EventHandler) {
        self.inners.lock().await.insert(name, handle);
    }

    pub async fn take(&self, name: String) -> Option<EventHandler> {
        self.inners.lock().await.remove(&name)
    }
}
