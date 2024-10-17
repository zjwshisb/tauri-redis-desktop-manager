use std::collections::HashMap;

use tauri::AppHandle;
use tokio::sync::Mutex;

pub struct EventManager {
    inners: Mutex<HashMap<String, AppHandle>>,
}

impl EventManager {
    pub fn new() -> Self {
        Self {
            inners: Mutex::new(HashMap::new()),
        }
    }
    pub async fn add(&self, name: String, handle: AppHandle) {
        self.inners.lock().await.insert(name, handle);
    }

    pub async fn take(&self, name: String) -> Option<AppHandle> {
        self.inners.lock().await.remove(&name)
    }
}
