use std::collections::HashMap;

use crate::{
    conn::{ConnectionManager, CusConnection},
    err::CusError,
    model::redis::Node,
    model::{redis::ScanResult, Connection},
};
use redis::FromRedisValue;
use serde::{Deserialize, Serialize};

pub async fn get_nodes<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<String>, CusError> {
    let nodes = manager.get_nodes(cid).await?;
    let mut node_str: Vec<String> = vec![];
    for n in nodes {
        if n.flags.contains("master") {
            let mut host = n.host.as_str();
            if let Some(index) = host.find("@") {
                host = &host[0..index];
            }
            let mut format_host = "redis://".to_string();
            format_host.push_str(host);
            node_str.push(format_host)
        }
    }
    return Ok(node_str);
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

pub async fn scan<'r>(
    cid: u32,
    payload: String,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<ScanResp, CusError> {
    let args: ScanArgs = serde_json::from_str(payload.as_str())?;
    let connection = Connection::first(cid)?;
    let mut resp: ScanResp = ScanResp {
        cursor: vec![],
        keys: vec![],
    };
    for x in &args.cursor {
        if let Some(node) = x.get("node") {
            if let Some(cursor) = x.get("cursor") {
                let mut conn = CusConnection::build_anonymous(&node, &connection.password).await?;
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
                let value = manager.execute_with(&mut cmd, &mut conn).await?;
                let mut result = ScanResult::build(&value);
                let mut node_cursor: HashMap<String, String> = HashMap::new();
                node_cursor.insert(String::from("cursor"), result.cursor);
                node_cursor.insert(String::from("node"), node.clone());
                resp.keys.append(&mut result.keys);
                resp.cursor.push(node_cursor);
            }
        }
    }
    Ok(resp)
}

#[derive(Deserialize, Debug)]
struct NodeSizeArgs {
    node: String,
}
pub async fn node_size<'r>(
    cid: u32,
    payload: String,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let model = Connection::first(cid)?;
    let args: NodeSizeArgs = serde_json::from_str(&payload.as_str())?;
    let mut conn = CusConnection::build_anonymous(&args.node, &model.password).await?;
    let value = manager
        .execute_with(&mut redis::cmd("dbsize"), &mut conn)
        .await?;
    Ok(i64::from_redis_value(&value)?)
}

pub async fn node<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<Node>, CusError> {
    Ok(manager.get_nodes(cid).await?)
}
