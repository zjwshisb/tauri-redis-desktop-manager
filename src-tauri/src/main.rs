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
use state::{ConnectionManager, PubsubManager};
use tauri::Menu;

fn main() {
    sqlite::init_sqlite();

    let app_name = "Tauri Redis Desktop Manager";
    let menu: Menu = Menu::os_default(app_name);

    tauri::Builder::default()
        .setup(|app| {
            // let docs_window = tauri::WindowBuilder::new(
            //     app,
            //     "main", /* the unique window label */
            //     tauri::WindowUrl::App("index.html".into()),
            // )
            // .build()?;
            // let local_window =
            //     tauri::WindowBuilder::new(app, "log", tauri::WindowUrl::App("index.html".into()))
            //         .build()?;
            Ok(())
        })
        .menu(menu)
        .manage(PubsubManager::new())
        .manage(ConnectionManager::new())
        .enable_macos_default_menu(true)
        .invoke_handler(tauri::generate_handler![route::dispatch])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
