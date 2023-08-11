// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod err;
mod key;
mod model;
mod redis_conn;
mod response;
mod route;
mod sqlite;
mod state;
use state::{ConnectionManager, PubsubManager};
use tauri::Menu;

fn main() {
    sqlite::init_sqlite();

    let app_name = "Tauri Redis Desktop Manager";
    let menu: Menu = Menu::os_default(app_name);

    tauri::Builder::default()
        .menu(menu)
        .manage(PubsubManager::new())
        .manage(ConnectionManager::new())
        .invoke_handler(tauri::generate_handler![route::dispatch])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
