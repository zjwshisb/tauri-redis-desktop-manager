use crate::err::CusError;
use crate::response::Response;

pub mod sqlite;
pub mod connection;
pub mod server;
pub mod key;
pub mod config;
pub mod hash;

#[tauri::command]
pub fn dispatch(path: &str, cid: u32, payload: &str) -> Result<String, CusError>{
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
        "key/hash/hscan" => {
            Response::new(hash::hscan(payload, cid)?)
        }
        "key/hash/hset" => {
            Response::new(hash::hset(payload, cid)?)
        }
        "key/hash/hdel" => {
            Response::new(hash::hdel(payload, cid)?)
        }
        "key/del" => {
            Response::new(key::del(payload, cid)?)
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