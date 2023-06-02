// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod err;
mod model;
mod redis_conn;
mod response;
mod route;
mod sqlite;
mod utils;
use tauri::Menu;
use tokio::sync;

static ARRAY: sync::OnceCell<redis_conn::RedisManager> = sync::OnceCell::const_new();

fn main() {
    sqlite::init_sqlite();
    tokio::spawn(async {
        ARRAY
            .get_or_init(|| async { redis_conn::RedisManager::new() })
            .await;
        while let Some(message) = ARRAY.get_mut().unwrap().rx.recv().await {
            dbg!(message);
        }
    });
    let app_name = "Tauri Redis Desktop Manager";
    let menu: Menu = Menu::os_default(app_name); //
                                                 // menu.add_submenu(submenu)
                                                 // menu.add_submenu(Submenu::new(app_name, Menu::new()));
    tauri::Builder::default()
        .menu(menu)
        .enable_macos_default_menu(true)
        .invoke_handler(tauri::generate_handler![route::dispatch])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
