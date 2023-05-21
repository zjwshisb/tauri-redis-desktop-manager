use crate::err::CusError;
use crate::response::Response;

pub mod sqlite;
pub mod connection;
pub mod server;
pub mod key;
pub mod config;

#[tauri::command]
pub fn dispatch(path: &str, cid: u8, payload: &str) -> Result<String, CusError>{
    let r = match path {
        "connections/get" => {
            Response::new(connection::get()?)
        },
        "connections/add" => {
            Response::new(connection::add(payload)?)
        },
        "server/ping" => {
            Response::new(server::ping(payload)?)
        }
        "server/info" => {
            Response::new(server::info(payload, cid)?)
        }
        "key/scan" => {
            Response::new(key::scan(payload, cid)?)
        }
        "key/hscan" => {
            Response::new(key::hscan(payload, cid)?)
        }
        "key/get" => {
            Response::new(key::get(payload, cid)?)
        }
        "config/databases" => {
            Response::new(config::get_database(cid)?)
        }
        _ => {
            Err(CusError::App(format!("{} not found", path)))
        }
    };
    dbg!(&r);
    return r
}