use std::collections::HashMap;

use crate::{
    conn::{ConnectionManager, CusConnection, Node, ScanResult},
    err::CusError,
    response::KeyWithMemory,
};
use redis::{FromRedisValue, Value};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
struct ScanArgs {
    cursor: Vec<HashMap<String, String>>,
    search: Option<String>,
    count: i64,
    types: Option<String>,
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
    let mut resp: ScanResp = ScanResp {
        cursor: vec![],
        keys: vec![],
    };
    let nodes = manager.get_nodes(cid).await?;
    for x in &args.cursor {
        if let Some(node_id) = x.get("node") {
            if let Some(cursor) = x.get("cursor") {
                for node in nodes.clone() {
                    if &node.id == node_id {
                        let mut conn = CusConnection::build_anonymous(node).await?;
                        let mut cmd = redis::cmd("scan");
                        cmd.arg(cursor)
                            .arg(&["count", args.count.to_string().as_str()]);
                        if let Some(search) = &args.search {
                            cmd.arg(&["MATCH", &format!("*{}*", search)]);
                        }
                        if let Some(types) = &args.types {
                            cmd.arg(&["TYPE", types]);
                        }
                        let value = manager.execute_with(&mut cmd, &mut conn).await?;
                        let mut result = ScanResult::build(&value);
                        let mut node_cursor: HashMap<String, String> = HashMap::new();
                        node_cursor.insert(String::from("cursor"), result.cursor);
                        node_cursor.insert(String::from("node"), node_id.clone());
                        resp.keys.append(&mut result.keys);
                        resp.cursor.push(node_cursor);
                    }
                }
            }
        }
    }
    Ok(resp)
}

#[derive(Deserialize, Debug)]
struct NodeSizeArgs {
    id: String,
}
pub async fn node_size<'r>(
    cid: u32,
    payload: String,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: NodeSizeArgs = serde_json::from_str(&payload.as_str())?;
    let nodes = manager.get_nodes(cid).await?;
    for n in nodes {
        if n.id == args.id {
            let mut conn = CusConnection::build_anonymous(n).await?;
            let value = manager
                .execute_with(&mut redis::cmd("dbsize"), &mut conn)
                .await?;
            return Ok(i64::from_redis_value(&value)?);
        }
    }
    return Ok(0);
}

pub async fn node<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<Node>, CusError> {
    Ok(manager.get_nodes(cid).await?)
}

#[derive(Serialize)]
pub struct AnalysisResp {
    pub cursor: Vec<HashMap<String, String>>,
    pub keys: Vec<KeyWithMemory>,
}
pub async fn analysis<'r>(
    cid: u32,
    payload: String,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<AnalysisResp, CusError> {
    let args: ScanArgs = serde_json::from_str(payload.as_str())?;
    let mut resp: AnalysisResp = AnalysisResp {
        cursor: vec![],
        keys: vec![],
    };
    let nodes = manager.get_nodes(cid).await?;

    for x in &args.cursor {
        if let Some(node_id) = x.get("node") {
            if let Some(cursor) = x.get("cursor") {
                for node in nodes.clone() {
                    if node_id == &node.id {
                        let mut conn = CusConnection::build_anonymous(node).await?;
                        let mut cmd = redis::cmd("scan");
                        cmd.arg(cursor)
                            .arg(&["count", args.count.to_string().as_str()]);
                        if let Some(search) = &args.search {
                            cmd.arg(&["MATCH", &format!("*{}*", search)]);
                        }
                        if let Some(types) = &args.types {
                            cmd.arg(&["TYPE", types]);
                        }
                        let value = manager.execute_with(&mut cmd, &mut conn).await?;
                        let result = ScanResult::build(&value);
                        let mut node_cursor: HashMap<String, String> = HashMap::new();
                        node_cursor.insert(String::from("cursor"), result.cursor);
                        node_cursor.insert(String::from("node"), node_id.clone());
                        resp.cursor.push(node_cursor);
                        for k in result.keys {
                            let memory = manager
                                .execute_with(
                                    redis::cmd("memory")
                                        .arg("usage")
                                        .arg(&k)
                                        .arg(&["SAMPLES", "0"]),
                                    &mut conn,
                                )
                                .await?;
                            let mut km = KeyWithMemory { name: k, memory: 0 };
                            match memory {
                                Value::Int(i) => km.memory = i,
                                _ => {}
                            }
                            resp.keys.push(km);
                        }
                    }
                }
            }
        }
    }
    Ok(resp)
}
