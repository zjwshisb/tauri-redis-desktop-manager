// Prevents additional console window on Windows in release, DO NOT REMOVE!!
mod connection;
mod err;
mod key;
mod model;
mod pubsub;
mod request;
mod response;
mod route;
mod sqlite;
mod ssh;
mod utils;
use pubsub::PubsubManager;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    sqlite::init();
    tauri::Builder::default()
        .manage(PubsubManager::new())
        .manage(connection::Manager::new())
        .manage(connection::EventManager::new())
        .invoke_handler(tauri::generate_handler![route::dispatch])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
