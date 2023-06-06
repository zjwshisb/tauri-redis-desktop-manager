// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod err;
mod model;
mod redis_conn;
mod response;
mod route;
mod sqlite;
mod state;
mod utils;
use redis_conn::RedisManager;
use state::PubsubManager;
use tauri::Menu;

fn main() {
    sqlite::init_sqlite();

    let app_name = "Tauri Redis Desktop Manager";
    let menu: Menu = Menu::os_default(app_name);
    let mut m = RedisManager::new();
    // tokio::spawn(async move {
    //     while let Some(m) = m.rx.recv().await {
    //         dbg!(m);
    //     }
    // });

    tauri::Builder::default()
        .menu(menu)
        .manage(m)
        .manage(PubsubManager::new())
        .enable_macos_default_menu(true)
        .invoke_handler(tauri::generate_handler![route::dispatch])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
