use crate::err::CusError;
use crate::response::Response;

pub mod sqlite;
pub mod connection;
pub mod server;
pub mod key;

#[tauri::command]
pub fn dispatch(path: &str, payload: &str) -> Result<String, CusError>{
    let r = match path {
        "connections/get" => {
            Response::new(connection::get_connections()?)
        },
        "server/ping" => {
            Response::new(server::ping(payload)?)
        }
        "server/info" => {
            Response::new(server::info(payload)?)
        }
        "key/scan" => {
            Response::new(key::scan(payload)?)
        }
        "key/hscan" => {
            Response::new(key::hscan(payload)?)
        }
        "key/get" => {
            Response::new(key::get(payload)?)
        }
        _ => {
            Err(CusError::App("not found".into()))
        }
    };
    dbg!(&r);
    return r
}