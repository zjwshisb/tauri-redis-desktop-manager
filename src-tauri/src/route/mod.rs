use tauri::Window;

use crate::connection::{EventManager, Manager};
use crate::err::CusError;
use crate::pubsub::PubsubManager;
use crate::response::Response;

pub mod bloom;
pub mod client;
pub mod cluster;
pub mod collection;
pub mod config;
pub mod connection;
pub mod cuckoo;
pub mod db;
pub mod debug;
pub mod hash;
pub mod hyperloglog;
pub mod json;
pub mod key;
pub mod list;
pub mod memory;
pub mod migrate;
pub mod pubsub;
pub mod server;
pub mod set;
pub mod string;
pub mod tdigest;
pub mod terminal;
pub mod timeseries;
pub mod topk;
pub mod transfer;
pub mod zset;

#[tauri::command]
pub async fn dispatch<'r>(
    pubsub: tauri::State<'r, PubsubManager>,
    manager: tauri::State<'r, Manager>,
    event_manage: tauri::State<'r, EventManager>,
    window: Window,
    path: String,
    cid: u32,
    payload: String,
) -> Result<String, CusError> {
    dbg!(&path);
    dbg!(&payload);
    let r = match path.as_str() {
        "connections/get" => Response::new(connection::get().await?),
        "connections/add" => Response::new(connection::add(payload)?),
        "connections/del" => Response::new(connection::del(payload)?),
        "connections/update" => Response::new(connection::update(payload)?),
        "connections/open" => Response::new(connection::open(cid, manager).await?),
        "connections/close" => Response::new(connection::close(cid, manager).await?),
        "server/ping" => Response::new(server::ping(payload, manager).await?),
        "server/info" => Response::new(server::info(cid, manager).await?),
        "server/version" => Response::new(server::version(cid, manager).await?),
        "server/slow-log" => Response::new(server::slow_log(cid, manager).await?),
        "server/reset-slow-log" => Response::new(server::reset_slow_log(cid, manager).await?),
        "server/module" => Response::new(server::module(cid, manager).await?),

        "key/scan" => Response::new(key::scan(payload, cid, manager).await?),
        "key/hash/hscan" => Response::new(hash::hscan(payload, cid, manager).await?),
        "key/hash/hset" => Response::new(hash::hset(payload, cid, manager).await?),
        "key/hash/hdel" => Response::new(hash::hdel(payload, cid, manager).await?),

        "key/list/lrange" => Response::new(list::lrange(payload, cid, manager).await?),
        "key/list/lset" => Response::new(list::lset(payload, cid, manager).await?),
        "key/list/ltrim" => Response::new(list::ltrim(payload, cid, manager).await?),
        "key/list/linsert" => Response::new(list::linsert(payload, cid, manager).await?),
        "key/list/lpush" => Response::new(list::lpush(payload, cid, manager).await?),
        "key/list/lpop" => Response::new(list::lpop(payload, cid, manager).await?),
        "key/list/rpush" => Response::new(list::rpush(payload, cid, manager).await?),
        "key/list/rpop" => Response::new(list::rpop(payload, cid, manager).await?),

        "key/zset/zscan" => Response::new(zset::zscan(payload, cid, manager).await?),
        "key/zset/zrem" => Response::new(zset::zrem(payload, cid, manager).await?),
        "key/zset/zadd" => Response::new(zset::zadd(payload, cid, manager).await?),
        "key/rename" => Response::new(key::rename(payload, cid, manager).await?),

        "key/add" => Response::new(key::add(payload, cid, manager).await?),
        "key/del" => Response::new(key::del(payload, cid, manager).await?),
        "key/get" => Response::new(key::get(payload, cid, manager).await?),

        "key/dump" => Response::new(key::dump(payload, cid, manager).await?),
        "key/restore" => Response::new(key::restore(payload, cid, manager).await?),
        "key/expire" => Response::new(key::expire(payload, cid, manager).await?),

        "set/sscan" => Response::new(set::sscan(payload, cid, manager).await?),
        "set/sadd" => Response::new(set::sadd(payload, cid, manager).await?),
        "set/srem" => Response::new(set::srem(payload, cid, manager).await?),
        "set/sdiff" => Response::new(set::sdiff(payload, cid, manager).await?),
        "set/sdiffstore" => Response::new(set::sdiff_store(payload, cid, manager).await?),
        "set/sinter" => Response::new(set::sinter(payload, cid, manager).await?),
        "set/sintercard" => Response::new(set::sinter_card(payload, cid, manager).await?),
        "set/sinterstore" => Response::new(set::sinter_store(payload, cid, manager).await?),
        "set/sismember" => Response::new(set::sis_member(payload, cid, manager).await?),

        "string/set" => Response::new(string::set(payload, cid, manager).await?),
        "string/decrby" => Response::new(string::decrby(payload, cid, manager).await?),
        "string/decr" => Response::new(string::decr(payload, cid, manager).await?),
        "string/incr" => Response::new(string::incr(payload, cid, manager).await?),
        "string/incrby" => Response::new(string::incrby(payload, cid, manager).await?),
        "string/incrbyfloat" => Response::new(string::incrby_float(payload, cid, manager).await?),
        "string/getrange" => Response::new(string::get_range(payload, cid, manager).await?),
        "string/setrange" => Response::new(string::set_range(payload, cid, manager).await?),
        "string/append" => Response::new(string::append(payload, cid, manager).await?),
        "string/lcs" => Response::new(string::lcs(payload, cid, manager).await?),
        "string/mget" => Response::new(string::mget(payload, cid, manager).await?),
        "string/getdel" => Response::new(string::getdel(payload, cid, manager).await?),
        "string/getset" => Response::new(string::getset(payload, cid, manager).await?),
        "string/mset" => Response::new(string::mset(payload, cid, manager).await?),

        "memory/analysis" => Response::new(memory::analysis(payload, cid, manager).await?),
        "memory/usage" => Response::new(memory::memory_usage(payload, cid, manager).await?),
        "memory/doctor" => Response::new(memory::memory_doctor(cid, manager).await?),
        "memory/stats" => Response::new(memory::memory_stats(cid, manager).await?),
        "memory/purge" => Response::new(memory::memory_purge(cid, manager).await?),
        "migrate" => Response::new(migrate::migrate(payload, cid, manager).await?),
        "db/dbsize" => Response::new(db::dbsize(payload, cid, manager).await?),
        "db/flush" => Response::new(db::flush(payload, cid, manager).await?),
        "client/list" => Response::new(client::list(payload, cid, manager).await?),
        "client/kill" => Response::new(client::kill(payload, cid, manager).await?),
        "config/databases" => Response::new(config::get_database(cid, manager).await?),
        "config/all" => Response::new(config::get_all(cid, manager).await?),
        "config/edit" => Response::new(config::edit(payload, cid, manager).await?),
        "config/rewrite" => Response::new(config::rewrite(cid, manager).await?),
        "config/resetstat" => Response::new(config::reset_stat(cid, manager).await?),
        "pubsub/subscribe" => Response::new(pubsub::subscribe(window, pubsub, payload, cid).await?),
        "pubsub/publish" => Response::new(pubsub::publish(payload, cid, manager).await?),
        "pubsub/cancel" => Response::new(pubsub::cancel(payload, pubsub).await?),
        "pubsub/monitor" => Response::new(pubsub::monitor(window, pubsub, cid).await?),
        "cluster/scan" => Response::new(cluster::scan(cid, payload, manager).await?),
        "cluster/nodes" => Response::new(cluster::node(cid, manager).await?),
        "cluster/nodesize" => Response::new(cluster::node_size(cid, payload, manager).await?),
        "cluster/analysis" => Response::new(cluster::analysis(cid, payload, manager).await?),
        "debug/log" => Response::new(debug::log(manager, window).await?),
        "debug/cancel" => Response::new(debug::cancel(manager).await?),
        "debug/clients" => Response::new(debug::clients(manager, pubsub).await?),
        "transfer/php_unserialize" => Response::new(transfer::php_unserialize(payload).await?),
        "json/set" => Response::new(json::set(payload, cid, manager).await?),
        "topk/list" => Response::new(topk::list(payload, cid, manager).await?),
        "topk/info" => Response::new(topk::info(payload, cid, manager).await?),
        "topk/add" => Response::new(topk::add(payload, cid, manager).await?),
        "topk/incrby" => Response::new(topk::incrby(payload, cid, manager).await?),
        "topk/reserve" => Response::new(topk::reserve(payload, cid, manager).await?),
        "timeseries/info" => Response::new(timeseries::info(payload, cid, manager).await?),
        "timeseries/range" => Response::new(timeseries::range(payload, cid, manager).await?),
        "timeseries/add" => Response::new(timeseries::add(payload, cid, manager).await?),
        "timeseries/del" => Response::new(timeseries::del(payload, cid, manager).await?),
        "timeseries/incrby" => Response::new(timeseries::incrby(payload, cid, manager).await?),
        "timeseries/decrby" => Response::new(timeseries::decrby(payload, cid, manager).await?),
        "timeseries/create" => Response::new(timeseries::create(payload, cid, manager).await?),
        "timeseries/alter" => Response::new(timeseries::alter(payload, cid, manager).await?),
        "timeseries/create-rule" => {
            Response::new(timeseries::create_rule(payload, cid, manager).await?)
        }
        "timeseries/delete-rule" => {
            Response::new(timeseries::delete_rule(payload, cid, manager).await?)
        }
        "tdigest/create" => Response::new(tdigest::create(payload, cid, manager).await?),
        "tdigest/info" => Response::new(tdigest::info(payload, cid, manager).await?),
        "tdigest/add" => Response::new(tdigest::add(payload, cid, manager).await?),
        "tdigest/rank" => Response::new(tdigest::rank(payload, cid, manager).await?),
        "tdigest/by-rank" => Response::new(tdigest::by_rank(payload, cid, manager).await?),
        "tdigest/rev-rank" => Response::new(tdigest::rev_rank(payload, cid, manager).await?),
        "tdigest/by-rev-rank" => Response::new(tdigest::by_rev_rank(payload, cid, manager).await?),
        "tdigest/quantile" => Response::new(tdigest::quantile(payload, cid, manager).await?),
        "tdigest/cdf" => Response::new(tdigest::cdf(payload, cid, manager).await?),
        "tdigest/reset" => Response::new(tdigest::reset(payload, cid, manager).await?),
        "tdigest/max" => Response::new(tdigest::max(payload, cid, manager).await?),
        "tdigest/min" => Response::new(tdigest::min(payload, cid, manager).await?),
        "tdigest/trimmed-mean" => {
            Response::new(tdigest::trimmed_mean(payload, cid, manager).await?)
        }

        "bloom-filter/info" => Response::new(bloom::info(payload, cid, manager).await?),
        "bloom-filter/reserve" => Response::new(bloom::reserve(payload, cid, manager).await?),
        "bloom-filter/madd" => Response::new(bloom::madd(payload, cid, manager).await?),
        "bloom-filter/exists" => Response::new(bloom::exists(payload, cid, manager).await?),

        "cuckoo-filter/info" => Response::new(cuckoo::info(payload, cid, manager).await?),
        "cuckoo-filter/add" => Response::new(cuckoo::add(payload, cid, manager).await?),
        "cuckoo-filter/addnx" => Response::new(cuckoo::addnx(payload, cid, manager).await?),
        "cuckoo-filter/exists" => Response::new(cuckoo::exists(payload, cid, manager).await?),
        "cuckoo-filter/mexists" => Response::new(cuckoo::mexists(payload, cid, manager).await?),
        "cuckoo-filter/del" => Response::new(cuckoo::del(payload, cid, manager).await?),
        "cuckoo-filter/insert" => Response::new(cuckoo::insert(payload, cid, manager).await?),
        "cuckoo-filter/insertnx" => Response::new(cuckoo::insertnx(payload, cid, manager).await?),
        "cuckoo-filter/reserve" => Response::new(cuckoo::reserve(payload, cid, manager).await?),
        "cuckoo-filter/count" => Response::new(cuckoo::count(payload, cid, manager).await?),

        "hyperloglog/pfcount" => Response::new(hyperloglog::pfcount(payload, cid, manager).await?),
        "hyperloglog/pfadd" => Response::new(hyperloglog::pfadd(payload, cid, manager).await?),

        "terminal/open" => Response::new(terminal::open(cid, window, manager, event_manage).await?),
        "terminal/cancel" => Response::new(terminal::cancel(payload, window, event_manage).await?),

        "collections" => Response::new(collection::all().await?),
        "collections/add" => Response::new(collection::add(payload).await?),
        "collections/del" => Response::new(collection::del(payload).await?),

        _ => Err(CusError::App(format!("{} Not Found", path))),
    };
    r
}
