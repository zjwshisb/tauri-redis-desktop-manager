use tauri::Window;

use crate::err::CusError;
use crate::response::Response;
use crate::state::{ConnectionManager, PubsubManager};

pub mod client;
pub mod cluster;
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
    manager: tauri::State<'r, ConnectionManager>,
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
        "connections/open" => Response::new(connection::open(cid, manager).await?),
        "connections/close" => Response::new(connection::close(cid, manager).await?),
        "server/ping" => Response::new(server::ping(payload).await?),
        "server/info" => Response::new(server::info(cid, manager).await?),
        "key/scan" => Response::new(key::scan(payload, cid, manager).await?),
        "key/hash/hscan" => Response::new(hash::hscan(payload, cid, manager).await?),
        "key/hash/hset" => Response::new(hash::hset(payload, cid, manager).await?),
        "key/hash/hdel" => Response::new(hash::hdel(payload, cid, manager).await?),
        "key/list/lrange" => Response::new(list::lrange(payload, cid, manager).await?),
        "key/list/lset" => Response::new(list::lset(payload, cid, manager).await?),
        "key/list/ltrim" => Response::new(list::ltrim(payload, cid, manager).await?),
        "key/list/linsert" => Response::new(list::linsert(payload, cid, manager).await?),
        "key/zset/zscan" => Response::new(zset::zscan(payload, cid, manager).await?),
        "key/zset/zrem" => Response::new(zset::zrem(payload, cid, manager).await?),
        "key/zset/zadd" => Response::new(zset::zadd(payload, cid, manager).await?),
        "key/set/sscan" => Response::new(set::sscan(payload, cid, manager).await?),
        "key/set/sadd" => Response::new(set::sadd(payload, cid, manager).await?),
        "key/set/srem" => Response::new(set::srem(payload, cid, manager).await?),
        "key/rename" => Response::new(key::rename(payload, cid, manager).await?),
        "key/add" => Response::new(key::add(payload, cid, manager).await?),
        "key/del" => Response::new(key::del(payload, cid, manager).await?),
        "key/get" => Response::new(key::get(payload, cid, manager).await?),
        "key/set" => Response::new(key::set(payload, cid, manager).await?),
        "key/expire" => Response::new(key::expire(payload, cid, manager).await?),
        "key/setbit" => Response::new(key::setbit(payload, cid, manager).await?),
        "db/dbsize" => Response::new(db::dbsize(payload, cid, manager).await?),
        "client/list" => Response::new(client::list(payload, cid, manager).await?),
        "client/kill" => Response::new(client::kill(payload, cid, manager).await?),
        "config/databases" => Response::new(config::get_database(cid, manager).await?),
        "pubsub/subscribe" => Response::new(pubsub::subscribe(window, pubsub, payload, cid).await?),
        "pubsub/publish" => Response::new(pubsub::publish(payload, cid, manager).await?),
        "pubsub/cancel" => Response::new(pubsub::cancel(payload, pubsub).await?),
        "pubsub/monitor" => Response::new(pubsub::monitor(window, pubsub, payload, cid).await?),
        "cluster/nodes" => Response::new(cluster::get_nodes(cid, manager).await?),
        _ => Err(CusError::App(format!("{} Not Found", path))),
    };
    r
}
