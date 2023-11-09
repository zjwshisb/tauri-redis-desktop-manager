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
        // self.inners.as_mut();
        // self.inners.insert(id.clone(), EventItem { conn, id });
        self.inners.lock().await.insert(name, handle);
    }

    pub async fn take(&self, name: String) -> Option<EventHandler> {
        self.inners.lock().await.remove(&name)
    }

    pub async fn size(&self) -> usize {
        return self.inners.lock().await.len();
    }
}
