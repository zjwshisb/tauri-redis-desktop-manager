use tauri::Window;

use crate::err::CusError;
use crate::response::Response;
use crate::state::PubsubManager;

pub mod client;
pub mod config;
pub mod connection;
pub mod db;
pub mod hash;
pub mod key;
pub mod list;
pub mod pubsub;
pub mod server;
pub mod set;
pub mod zset;

#[tauri::command]
pub async fn dispatch<'r>(
    pubsub: tauri::State<'r, PubsubManager>,
    window: Window,
    path: String,
    cid: u32,
    payload: String,
) -> Result<String, CusError> {
    let r = match path.as_str() {
        "connections/get" => Response::new(connection::get()?),
        "connections/add" => Response::new(connection::add(payload)?),
        "connections/del" => Response::new(connection::del(payload)?),
        "connections/update" => Response::new(connection::update(payload)?),
        "server/ping" => Response::new(server::ping(payload).await?),
        "server/info" => Response::new(server::info(cid).await?),
        "key/scan" => Response::new(key::scan(payload, cid).await?),
        "key/hash/hscan" => Response::new(hash::hscan(payload, cid).await?),
        "key/hash/hset" => Response::new(hash::hset(payload, cid).await?),
        "key/hash/hdel" => Response::new(hash::hdel(payload, cid).await?),
        "key/list/lrange" => Response::new(list::lrange(payload, cid).await?),
        "key/list/lset" => Response::new(list::lset(payload, cid).await?),
        "key/list/ltrim" => Response::new(list::ltrim(payload, cid).await?),
        "key/list/linsert" => Response::new(list::linsert(payload, cid).await?),
        "key/zset/zscan" => Response::new(zset::zscan(payload, cid).await?),
        "key/zset/zrem" => Response::new(zset::zrem(payload, cid).await?),
        "key/zset/zadd" => Response::new(zset::zadd(payload, cid).await?),
        "key/set/sscan" => Response::new(set::sscan(payload, cid).await?),
        "key/set/sadd" => Response::new(set::sadd(payload, cid).await?),
        "key/set/srem" => Response::new(set::srem(payload, cid).await?),
        "key/rename" => Response::new(key::rename(payload, cid).await?),
        "key/add" => Response::new(key::add(payload, cid).await?),
        "key/del" => Response::new(key::del(payload, cid).await?),
        "key/get" => Response::new(key::get(payload, cid).await?),
        "key/set" => Response::new(key::set(payload, cid).await?),
        "key/expire" => Response::new(key::expire(payload, cid).await?),
        "db/dbsize" => Response::new(db::dbsize(payload, cid).await?),
        "client/list" => Response::new(client::list(payload, cid).await?),
        "client/kill" => Response::new(client::kill(payload, cid).await?),
        "config/databases" => Response::new(config::get_database(cid).await?),
        "pubsub/subscribe" => Response::new(pubsub::subscribe(window, pubsub, payload, cid).await?),
        "pubsub/publish" => Response::new(pubsub::publish(payload, cid).await?),
        "pubsub/cancel" => Response::new(pubsub::cancel(payload, pubsub).await?),
        "pubsub/monitor" => Response::new(pubsub::monitor(window, pubsub, payload, cid).await?),
        _ => Err(CusError::App(format!("{} Not Found", path))),
    };
    r
}
