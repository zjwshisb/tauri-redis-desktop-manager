use std::collections::HashMap;

use crate::{
    err::{new_normal, CusError},
    model::Connection,
    redis_conn::{self, RedisConnection},
    state::ConnectionManager,
};
use redis::{FromRedisValue, Value};
use serde::{Deserialize, Serialize};

pub async fn get_nodes<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<String>, CusError> {
    return manager.get_server_node(cid).await;
}

#[derive(Deserialize, Debug)]
struct ScanArgs {
    cursor: Vec<HashMap<String, String>>,
    search: String,
    count: i64,
    types: String,
}

#[derive(Deserialize, Serialize)]
pub struct ScanResp {
    pub cursor: Vec<HashMap<String, String>>,
    pub keys: Vec<String>,
}

pub async fn scan(cid: u32, payload: String) -> Result<ScanResp, CusError> {
    let args: ScanArgs = serde_json::from_str(payload.as_str())?;
    let connection = Connection::first(cid)?;
    let mut resp: ScanResp = ScanResp {
        cursor: vec![],
        keys: vec![],
    };
    for x in &args.cursor {
        if let Some(node) = x.get("node") {
            if let Some(cursor) = x.get("cursor") {
                let mut conn =
                    RedisConnection::build_anonymous(&node, &connection.password).await?;
                let mut cmd = redis::cmd("scan");
                cmd.arg(cursor)
                    .arg(&["count", args.count.to_string().as_str()]);
                if args.search != "" {
                    let mut search = args.search.clone();
                    search.insert_str(0, "*");
                    search.push_str("*");
                    cmd.arg(&["MATCH", &search]);
                }
                if args.types != "" {
                    cmd.arg(&["TYPE", &args.types]);
                }
                let value: Value = conn.execute(&mut cmd, 0).await?;
                match value {
                    Value::Bulk(s) => {
                        let cursor = String::from_redis_value(s.get(0).unwrap())?;
                        let keys_vec = s.get(1);
                        if let Some(s) = keys_vec {
                            let mut keys = Vec::from_redis_value(&s)?;
                            resp.keys.append(&mut keys);
                            let mut node_cursor: HashMap<String, String> = HashMap::new();
                            node_cursor.insert(String::from("cursor"), cursor);
                            node_cursor.insert(String::from("node"), node.clone());
                            resp.cursor.push(node_cursor);
                        };
                    }
                    _ => {
                        return Err(new_normal());
                    }
                };
            }
        }
    }
    Ok(resp)
}

#[derive(Deserialize, Debug)]
struct NodeSizeArgs {
    node: String,
}
pub async fn node_size(cid: u32, payload: String) -> Result<i64, CusError> {
    let model = Connection::first(cid)?;
    let args: NodeSizeArgs = serde_json::from_str(&payload.as_str())?;
    let mut conn =
        redis_conn::RedisConnection::build_anonymous(&args.node, &model.password).await?;
    let v: Value = conn.execute(&mut redis::cmd("dbsize"), 0).await?;
    Ok(i64::from_redis_value(&v)?)
}
