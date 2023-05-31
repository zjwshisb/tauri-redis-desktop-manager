use crate::err::CusError;
use crate::response::Response;

pub mod connection;
pub mod server;
pub mod key;
pub mod config;
pub mod hash;
pub mod client;
pub mod list;
pub mod zset;
pub mod set;
pub mod db;

#[tauri::command]
pub fn dispatch(path: &str, cid: u32, payload: &str) -> Result<String, CusError>{
    let r = match path {
        "connections/get" => {
            Response::new(connection::get()?)
        },
        "connections/add" => {
            Response::new(connection::add(payload)?)
        },
        "connections/del" => {
            Response::new(connection::del(payload)?)
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
        "key/list/lrange" => {
            Response::new(list::lrange(payload, cid)?)
        }
        "key/list/lset" => {
            Response::new(list::lset(payload, cid)?)
        }
        "key/list/ltrim" => {
            Response::new(list::ltrim(payload, cid)?)
        }
        "key/list/linsert" => {
            Response::new(list::linsert(payload, cid)?)
        }
        "key/zset/zscan" => {
            Response::new(zset::zscan(payload, cid)?)
        }
        "key/zset/zrem" => {
            Response::new(zset::zrem(payload, cid)?)
        }
        "key/set/sscan" => {
            Response::new(set::sscan(payload, cid)?)
        }
        "key/set/sadd" => {
            Response::new(set::sadd(payload, cid)?)
        }
        "key/set/srem" => {
            Response::new(set::srem(payload, cid)?)
        }
        "key/rename" => {
            Response::new(key::rename(payload, cid)?)
        }
        "key/add" => {
            Response::new(key::add(payload, cid)?)
        }
        "key/del" => {
            Response::new(key::del(payload, cid)?)
        }
        "key/get" => {
            Response::new(key::get(payload, cid)?)
        }
        "key/set" => {
            Response::new(key::set(payload, cid)?)
        }
        "key/expire"=> {
            Response::new(key::expire(payload, cid)?)
        }
        "db/dbsize" => {
            Response::new(db::dbsize(payload, cid)?)
        }
        "client/list" => {
            Response::new(client::list(payload, cid)?)
        }
        "client/kill" => {
            Response::new(client::kill(payload, cid)?)
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