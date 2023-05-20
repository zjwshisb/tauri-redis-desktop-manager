// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod route;
mod err;
mod response;
mod utils;
mod redis_conn;
mod sqlite;


fn main() {
    dbg!(sqlite::init_sqlite());
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            route::dispatch
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}



