// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod conn;
mod err;
mod form;
mod key;
mod pubsub;
mod response;
mod route;
mod sqlite;
mod utils;
use conn::ConnectionManager;
use pubsub::PubsubManager;
use tauri::{CustomMenuItem, Menu, Submenu};

fn main() {
    sqlite::init_sqlite();

    let app_name = "Tauri Redis Desktop Manager";
    let mut menu: Menu = Menu::os_default(app_name);

    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let close = CustomMenuItem::new("close".to_string(), "Close");
    let submenu = Submenu::new("Function", Menu::new().add_item(quit).add_item(close));
    menu = menu.add_submenu(submenu);

    tauri::Builder::default()
        .menu(menu)
        .manage(PubsubManager::new())
        .manage(ConnectionManager::new())
        .invoke_handler(tauri::generate_handler![route::dispatch])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
