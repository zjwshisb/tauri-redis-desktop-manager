use tauri::Window;

use crate::connection::{EventManager, Manager};
use crate::err::CusError;
use crate::pubsub::PubsubManager;
use crate::response::Response;

pub mod bloom;
pub mod client;
pub mod cluster;
pub mod cms;
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
pub async fn dispatch(
    pubsub: tauri::State<'_, PubsubManager>,
    manager: tauri::State<'_, Manager>,
    event_manage: tauri::State<'_, EventManager>,
    window: Window,
    path: String,
    cid: u32,
    payload: String,
) -> Result<String, CusError> {
    dbg!(&path);
    dbg!(&payload);
    let r = match path.as_str() {
        "connections/get" => Response::string(connection::get().await?),
        "connections/add" => Response::string(connection::add(payload)?),
        "connections/del" => Response::string(connection::del(payload)?),
        "connections/update" => Response::string(connection::update(payload)?),
        "connections/open" => Response::string(connection::open(cid, manager).await?),
        "connections/close" => Response::string(connection::close(cid, manager).await?),
        "server/ping" => Response::string(server::ping(payload, manager).await?),
        "server/info" => Response::string(server::info(cid, manager).await?),
        "server/version" => Response::string(server::version(cid, manager).await?),
        "server/slow-log" => Response::string(server::slow_log(cid, manager).await?),
        "server/reset-slow-log" => Response::string(server::reset_slow_log(cid, manager).await?),
        "server/module" => Response::string(server::module(cid, manager).await?),

        "hash/hscan" => Response::string(hash::hscan(payload, cid, manager).await?),
        "hash/hdel" => Response::string(hash::hdel(payload, cid, manager).await?),
        "hash/hexists" => Response::string(hash::hexists(payload, cid, manager).await?),
        "hash/hget" => Response::string(hash::hget(payload, cid, manager).await?),
        "hash/hgetall" => Response::string(hash::hget_all(payload, cid, manager).await?),
        "hash/hincrby" => Response::string(hash::hincrby(payload, cid, manager).await?),
        "hash/hincrbyfloat" => Response::string(hash::hincrby_float(payload, cid, manager).await?),
        "hash/hkeys" => Response::string(hash::hkeys(payload, cid, manager).await?),
        "hash/hlen" => Response::string(hash::hlen(payload, cid, manager).await?),
        "hash/hmget" => Response::string(hash::hmget(payload, cid, manager).await?),
        "hash/hrandfield" => Response::string(hash::hrand_field(payload, cid, manager).await?),
        "hash/hset" => Response::string(hash::hset(payload, cid, manager).await?),
        "hash/hsetnx" => Response::string(hash::hsetnx(payload, cid, manager).await?),
        "hash/hstrlen" => Response::string(hash::hstr_len(payload, cid, manager).await?),
        "hash/hvals" => Response::string(hash::hvals(payload, cid, manager).await?),

        "list/blmove" => Response::string(list::bl_move(payload, cid, manager).await?),
        "list/blmpop" => Response::string(list::blm_pop(payload, cid, manager).await?),
        "list/blpop" => Response::string(list::bl_pop(payload, cid, manager).await?),
        "list/brpop" => Response::string(list::br_pop(payload, cid, manager).await?),
        "list/brpoplpush" => Response::string(list::br_pop_lpush(payload, cid, manager).await?),
        "list/lindex" => Response::string(list::lindex(payload, cid, manager).await?),
        "list/linsert" => Response::string(list::linsert(payload, cid, manager).await?),
        "list/llen" => Response::string(list::llen(payload, cid, manager).await?),
        "list/lmove" => Response::string(list::lmove(payload, cid, manager).await?),
        "list/lmpop" => Response::string(list::lm_pop(payload, cid, manager).await?),
        "list/lpos" => Response::string(list::lpos(payload, cid, manager).await?),
        "list/lpush" => Response::string(list::lpush(payload, cid, manager).await?),
        "list/lpushx" => Response::string(list::lpush_x(payload, cid, manager).await?),
        "list/lrange" => Response::string(list::lrange(payload, cid, manager).await?),
        "list/lrem" => Response::string(list::lrem(payload, cid, manager).await?),
        "list/lset" => Response::string(list::lset(payload, cid, manager).await?),
        "list/ltrim" => Response::string(list::ltrim(payload, cid, manager).await?),
        "list/lpop" => Response::string(list::lpop(payload, cid, manager).await?),
        "list/rpop" => Response::string(list::rpop(payload, cid, manager).await?),
        "list/rpoplpush" => Response::string(list::rpop_lpush(payload, cid, manager).await?),
        "list/rpush" => Response::string(list::rpush(payload, cid, manager).await?),
        "list/rpushx" => Response::string(list::rpushx(payload, cid, manager).await?),

        "zset/zscan" => Response::string(zset::zscan(payload, cid, manager).await?),

        "zset/zadd" => Response::string(zset::zadd(payload, cid, manager).await?),
        "zset/bzmpop" => Response::string(zset::bzmpop(payload, cid, manager).await?),
        "zset/bzpopmax" => Response::string(zset::bzpop_max(payload, cid, manager).await?),
        "zset/bzpopmin" => Response::string(zset::bzpop_min(payload, cid, manager).await?),
        "zset/zcount" => Response::string(zset::zcount(payload, cid, manager).await?),
        "zset/zdiff" => Response::string(zset::zdiff(payload, cid, manager).await?),
        "zset/zdiffstore" => Response::string(zset::zdiff_store(payload, cid, manager).await?),
        "zset/zincrby" => Response::string(zset::zincr_by(payload, cid, manager).await?),
        "zset/zinter" => Response::string(zset::zinter(payload, cid, manager).await?),
        "zset/zintercard" => Response::string(zset::zinter_card(payload, cid, manager).await?),
        "zset/zinterstore" => Response::string(zset::zinter_store(payload, cid, manager).await?),
        "zset/zlexcount" => Response::string(zset::zlex_count(payload, cid, manager).await?),
        "zset/zmpop" => Response::string(zset::zmpop(payload, cid, manager).await?),
        "zset/zmscore" => Response::string(zset::zmscore(payload, cid, manager).await?),
        "zset/zpopmax" => Response::string(zset::zpop_max(payload, cid, manager).await?),
        "zset/zpopmin" => Response::string(zset::zpop_min(payload, cid, manager).await?),
        "zset/zrandmember" => Response::string(zset::zrand_member(payload, cid, manager).await?),
        "zset/zrange" => Response::string(zset::zrange(payload, cid, manager).await?),
        "zset/zrangestore" => Response::string(zset::zrange_store(payload, cid, manager).await?),
        "zset/zrank" => Response::string(zset::zrank(payload, cid, manager).await?),
        "zset/zrem" => Response::string(zset::zrem(payload, cid, manager).await?),
        "zset/zremrangebylex" => {
            Response::string(zset::zrem_range_by_lex(payload, cid, manager).await?)
        }
        "zset/zremrangebyrank" => {
            Response::string(zset::zrem_range_by_rank(payload, cid, manager).await?)
        }
        "zset/zremrangebyscore" => {
            Response::string(zset::zrem_range_by_score(payload, cid, manager).await?)
        }
        "zset/zrevrank" => Response::string(zset::zrev_rank(payload, cid, manager).await?),
        "zset/zscore" => Response::string(zset::zscore(payload, cid, manager).await?),
        "zset/zunion" => Response::string(zset::zunion(payload, cid, manager).await?),
        "zset/zunionstore" => Response::string(zset::zunion_store(payload, cid, manager).await?),

        "key/copy" => Response::string(key::copy(payload, cid, manager).await?),
        "key/rename" => Response::string(key::rename(payload, cid, manager).await?),
        "key/add" => Response::string(key::add(payload, cid, manager).await?),
        "key/del" => Response::string(key::del(payload, cid, manager).await?),
        "key/get" => Response::string(key::get(payload, cid, manager).await?),
        "key/dump" => Response::string(key::dump(payload, cid, manager).await?),
        "key/restore" => Response::string(key::restore(payload, cid, manager).await?),
        "key/expire" => Response::string(key::expire(payload, cid, manager).await?),
        "key/scan" => Response::string(key::scan(payload, cid, manager).await?),
        "key/ttl" => Response::string(key::ttl(payload, cid, manager).await?),
        "key/object" => Response::string(key::object(payload, cid, manager).await?),
        "key/move" => Response::string(key::move_key(payload, cid, manager).await?),
        "key/randomkey" => Response::string(key::random_key(payload, cid, manager).await?),

        "set/sscan" => Response::string(set::sscan(payload, cid, manager).await?),
        "set/sadd" => Response::string(set::sadd(payload, cid, manager).await?),
        "set/srem" => Response::string(set::srem(payload, cid, manager).await?),
        "set/sdiff" => Response::string(set::sdiff(payload, cid, manager).await?),
        "set/sdiffstore" => Response::string(set::sdiff_store(payload, cid, manager).await?),
        "set/sinter" => Response::string(set::sinter(payload, cid, manager).await?),
        "set/sintercard" => Response::string(set::sinter_card(payload, cid, manager).await?),
        "set/sinterstore" => Response::string(set::sinter_store(payload, cid, manager).await?),
        "set/sismember" => Response::string(set::sis_member(payload, cid, manager).await?),
        "set/smismember" => Response::string(set::sm_is_member(payload, cid, manager).await?),
        "set/smembers" => Response::string(set::smembers(payload, cid, manager).await?),
        "set/smove" => Response::string(set::smove(payload, cid, manager).await?),
        "set/spop" => Response::string(set::spop(payload, cid, manager).await?),
        "set/srandmember" => Response::string(set::srand_member(payload, cid, manager).await?),
        "set/sunion" => Response::string(set::sunion(payload, cid, manager).await?),
        "set/sunionstore" => Response::string(set::sunion_store(payload, cid, manager).await?),

        "string/set" => Response::string(string::set(payload, cid, manager).await?),
        "string/decrby" => Response::string(string::decrby(payload, cid, manager).await?),
        "string/decr" => Response::string(string::decr(payload, cid, manager).await?),
        "string/incr" => Response::string(string::incr(payload, cid, manager).await?),
        "string/incrby" => Response::string(string::incrby(payload, cid, manager).await?),
        "string/incrbyfloat" => Response::string(string::incrby_float(payload, cid, manager).await?),
        "string/getrange" => Response::string(string::get_range(payload, cid, manager).await?),
        "string/setrange" => Response::string(string::set_range(payload, cid, manager).await?),
        "string/append" => Response::string(string::append(payload, cid, manager).await?),
        "string/lcs" => Response::string(string::lcs(payload, cid, manager).await?),
        "string/mget" => Response::string(string::mget(payload, cid, manager).await?),
        "string/getdel" => Response::string(string::getdel(payload, cid, manager).await?),
        "string/getset" => Response::string(string::getset(payload, cid, manager).await?),
        "string/mset" => Response::string(string::mset(payload, cid, manager).await?),

        "memory/analysis" => Response::string(memory::analysis(payload, cid, manager).await?),
        "memory/usage" => Response::string(memory::memory_usage(payload, cid, manager).await?),
        "memory/doctor" => Response::string(memory::memory_doctor(cid, manager).await?),
        "memory/stats" => Response::string(memory::memory_stats(cid, manager).await?),
        "memory/purge" => Response::string(memory::memory_purge(cid, manager).await?),
        "migrate" => Response::string(migrate::migrate(payload, cid, manager).await?),
        "db/dbsize" => Response::string(db::dbsize(payload, cid, manager).await?),
        "db/flush" => Response::string(db::flush(payload, cid, manager).await?),
        "client/list" => Response::string(client::list(payload, cid, manager).await?),
        "client/kill" => Response::string(client::kill(payload, cid, manager).await?),
        "config/databases" => Response::string(config::get_database(cid, manager).await?),
        "config/all" => Response::string(config::get_all(cid, manager).await?),
        "config/edit" => Response::string(config::edit(payload, cid, manager).await?),
        "config/rewrite" => Response::string(config::rewrite(cid, manager).await?),
        "config/resetstat" => Response::string(config::reset_stat(cid, manager).await?),
        "pubsub/subscribe" => Response::string(pubsub::subscribe(window, pubsub, payload, cid).await?),
        "pubsub/publish" => Response::string(pubsub::publish(payload, cid, manager).await?),
        "pubsub/cancel" => Response::string(pubsub::cancel(payload, pubsub).await?),
        "pubsub/monitor" => Response::string(pubsub::monitor(window, pubsub, cid).await?),
        "cluster/scan" => Response::string(cluster::scan(cid, payload, manager).await?),
        "cluster/nodes" => Response::string(cluster::node(cid, manager).await?),
        "cluster/nodesize" => Response::string(cluster::node_size(cid, payload, manager).await?),
        "cluster/analysis" => Response::string(cluster::analysis(cid, payload, manager).await?),
        "debug/log" => Response::string(debug::log(manager, window).await?),
        "debug/cancel" => Response::string(debug::cancel(manager).await?),
        "debug/clients" => Response::string(debug::clients(manager, pubsub).await?),
        "transfer/php_unserialize" => Response::string(transfer::php_unserialize(payload).await?),
        "json/set" => Response::string(json::set(payload, cid, manager).await?),

        "topk/list" => Response::string(topk::list(payload, cid, manager).await?),
        "topk/info" => Response::string(topk::info(payload, cid, manager).await?),
        "topk/add" => Response::string(topk::add(payload, cid, manager).await?),
        "topk/incrby" => Response::string(topk::incrby(payload, cid, manager).await?),
        "topk/reserve" => Response::string(topk::reserve(payload, cid, manager).await?),
        "topk/query" => Response::string(topk::query(payload, cid, manager).await?),
        "topk/count" => Response::string(topk::count(payload, cid, manager).await?),

        "timeseries/info" => Response::string(timeseries::info(payload, cid, manager).await?),
        "timeseries/range" => Response::string(timeseries::range(payload, cid, manager).await?),
        "timeseries/add" => Response::string(timeseries::add(payload, cid, manager).await?),
        "timeseries/del" => Response::string(timeseries::del(payload, cid, manager).await?),
        "timeseries/incrby" => Response::string(timeseries::incrby(payload, cid, manager).await?),
        "timeseries/decrby" => Response::string(timeseries::decrby(payload, cid, manager).await?),
        "timeseries/create" => Response::string(timeseries::create(payload, cid, manager).await?),
        "timeseries/alter" => Response::string(timeseries::alter(payload, cid, manager).await?),
        "timeseries/create-rule" => {
            Response::string(timeseries::create_rule(payload, cid, manager).await?)
        }
        "timeseries/delete-rule" => {
            Response::string(timeseries::delete_rule(payload, cid, manager).await?)
        }
        "tdigest/create" => Response::string(tdigest::create(payload, cid, manager).await?),
        "tdigest/info" => Response::string(tdigest::info(payload, cid, manager).await?),
        "tdigest/add" => Response::string(tdigest::add(payload, cid, manager).await?),
        "tdigest/rank" => Response::string(tdigest::rank(payload, cid, manager).await?),
        "tdigest/by-rank" => Response::string(tdigest::by_rank(payload, cid, manager).await?),
        "tdigest/rev-rank" => Response::string(tdigest::rev_rank(payload, cid, manager).await?),
        "tdigest/by-rev-rank" => Response::string(tdigest::by_rev_rank(payload, cid, manager).await?),
        "tdigest/quantile" => Response::string(tdigest::quantile(payload, cid, manager).await?),
        "tdigest/cdf" => Response::string(tdigest::cdf(payload, cid, manager).await?),
        "tdigest/reset" => Response::string(tdigest::reset(payload, cid, manager).await?),
        "tdigest/max" => Response::string(tdigest::max(payload, cid, manager).await?),
        "tdigest/min" => Response::string(tdigest::min(payload, cid, manager).await?),
        "tdigest/trimmed-mean" => {
            Response::string(tdigest::trimmed_mean(payload, cid, manager).await?)
        }

        "bloom-filter/info" => Response::string(bloom::info(payload, cid, manager).await?),
        "bloom-filter/reserve" => Response::string(bloom::reserve(payload, cid, manager).await?),
        "bloom-filter/madd" => Response::string(bloom::madd(payload, cid, manager).await?),
        "bloom-filter/exists" => Response::string(bloom::exists(payload, cid, manager).await?),

        "cuckoo-filter/info" => Response::string(cuckoo::info(payload, cid, manager).await?),
        "cuckoo-filter/add" => Response::string(cuckoo::add(payload, cid, manager).await?),
        "cuckoo-filter/addnx" => Response::string(cuckoo::addnx(payload, cid, manager).await?),
        "cuckoo-filter/exists" => Response::string(cuckoo::exists(payload, cid, manager).await?),
        "cuckoo-filter/mexists" => Response::string(cuckoo::mexists(payload, cid, manager).await?),
        "cuckoo-filter/del" => Response::string(cuckoo::del(payload, cid, manager).await?),
        "cuckoo-filter/insert" => Response::string(cuckoo::insert(payload, cid, manager).await?),
        "cuckoo-filter/insertnx" => Response::string(cuckoo::insertnx(payload, cid, manager).await?),
        "cuckoo-filter/reserve" => Response::string(cuckoo::reserve(payload, cid, manager).await?),
        "cuckoo-filter/count" => Response::string(cuckoo::count(payload, cid, manager).await?),

        "hyperloglog/pfcount" => Response::string(hyperloglog::pfcount(payload, cid, manager).await?),
        "hyperloglog/pfadd" => Response::string(hyperloglog::pfadd(payload, cid, manager).await?),

        "cms/init" => Response::string(cms::init(payload, cid, manager).await?),
        "cms/info" => Response::string(cms::info(payload, cid, manager).await?),
        "cms/incrby" => Response::string(cms::incrby(payload, cid, manager).await?),
        "cms/query" => Response::string(cms::query(payload, cid, manager).await?),
        "cms/merge" => Response::string(cms::merge(payload, cid, manager).await?),

        "terminal/open" => Response::string(terminal::open(cid, window, manager, event_manage).await?),
        "terminal/cancel" => Response::string(terminal::cancel(payload, window, event_manage).await?),

        "collections" => Response::string(collection::all().await?),
        "collections/add" => Response::string(collection::add(payload).await?),
        "collections/del" => Response::string(collection::del(payload).await?),

        _ => Err(CusError::App(format!("{} Not Found", path))),
    };
    r
}
