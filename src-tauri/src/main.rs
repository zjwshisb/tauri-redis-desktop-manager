// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod route;
mod model;
mod err;
mod response;
mod utils;
mod redis_conn;
mod sqlite;
use tauri::{Menu};


fn main() {
    sqlite::init_sqlite();
    let app_name = "Tauri Redis Desktop Manager";
    let menu: Menu = Menu::os_default(app_name); // 
    // menu.add_submenu(submenu)
    // menu.add_submenu(Submenu::new(app_name, Menu::new()));
    tauri::Builder::default()
    .menu(menu)
    .enable_macos_default_menu(true)

        .invoke_handler(tauri::generate_handler![
            route::dispatch
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}



