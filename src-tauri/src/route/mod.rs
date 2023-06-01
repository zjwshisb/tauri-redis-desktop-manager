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
pub async fn dispatch(path: &str, cid: u32, payload: &str) -> Result<String, CusError>{
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
        "connections/update"=> {
            Response::new(connection::update(payload)?)
        }
        "server/ping" => {
            Response::new(server::ping(payload).await?)
        }
        "server/info" => {
            Response::new(server::info(payload, cid).await?)
        }
        "key/scan" => {
            Response::new(key::scan(payload, cid).await?)
        }
        "key/hash/hscan" => {
            Response::new(hash::hscan(payload, cid).await?)
        }
        "key/hash/hset" => {
            Response::new(hash::hset(payload, cid).await?)
        }
        "key/hash/hdel" => {
            Response::new(hash::hdel(payload, cid).await?)
        }
        "key/list/lrange" => {
            Response::new(list::lrange(payload, cid).await?)
        }
        "key/list/lset" => {
            Response::new(list::lset(payload, cid).await?)
        }
        "key/list/ltrim" => {
            Response::new(list::ltrim(payload, cid).await?)
        }
        "key/list/linsert" => {
            Response::new(list::linsert(payload, cid).await?)
        }
        "key/zset/zscan" => {
            Response::new(zset::zscan(payload, cid).await?)
        }
        "key/zset/zrem" => {
            Response::new(zset::zrem(payload, cid).await?)
        }
        "key/set/sscan" => {
            Response::new(set::sscan(payload, cid).await?)
        }
        "key/set/sadd" => {
            Response::new(set::sadd(payload, cid).await?)
        }
        "key/set/srem" => {
            Response::new(set::srem(payload, cid).await?)
        }
        "key/rename" => {
            Response::new(key::rename(payload, cid).await?)
        }
        "key/add" => {
            Response::new(key::add(payload, cid).await?)
        }
        "key/del" => {
            Response::new(key::del(payload, cid).await?)
        }
        "key/get" => {
            Response::new(key::get(payload, cid).await?)
        }
        "key/set" => {
            Response::new(key::set(payload, cid).await?)
        }
        "key/expire"=> {
            Response::new(key::expire(payload, cid).await?)
        }
        "db/dbsize" => {
            Response::new(db::dbsize(payload, cid).await?)
        }
        "client/list" => {
            Response::new(client::list(payload, cid).await?)
        }
        "client/kill" => {
            Response::new(client::kill(payload, cid).await?)
        }
        "config/databases" => {
            Response::new(config::get_database(cid).await?)
        }
        _ => {
            Err(CusError::App(format!("{} not found", path)))
        }
    };
    dbg!(&r);
    return r
}