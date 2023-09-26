use std::collections::HashMap;

use crate::{
    conn::{ConnectionManager, ConnectionWrapper},
    err::CusError,
    model::Node,
    request::{self, IdArgs},
    response::{KeyWithMemory, ScanLikeResult},
};
use redis::{FromRedisValue, Value};

pub async fn scan<'r>(
    cid: u32,
    payload: String,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<ScanLikeResult<String, Vec<HashMap<String, String>>>, CusError> {
    let args: request::ScanLikeArgs<Vec<HashMap<String, String>>> =
        serde_json::from_str(payload.as_str())?;
    let mut resp: ScanLikeResult<String, Vec<HashMap<String, String>>> = ScanLikeResult::default();
    let nodes = manager.get_nodes(cid).await?;
    for x in &args.cursor {
        if let Some(node_id) = x.get("node") {
            if let Some(cursor) = x.get("cursor") {
                for node in nodes.clone() {
                    if &node.id == node_id {
                        let mut conn = ConnectionWrapper::build(node).await?;
                        let mut cmd = redis::cmd("scan");
                        cmd.arg(cursor)
                            .arg(&["count", args.count.to_string().as_str()]);
                        if let Some(mut search) = args.search.clone() {
                            match args.exact {
                                None => search = format!("*{}*", search),
                                Some(exact) => {
                                    if !exact {
                                        search = format!("*{}*", search)
                                    }
                                }
                            }
                            cmd.arg(&["MATCH", &search]);
                        }
                        if let Some(types) = &args.types {
                            cmd.arg(&["TYPE", types]);
                        }
                        let value: Vec<Value> = manager.execute_with(&mut cmd, &mut conn).await?;
                        let mut result = ScanLikeResult::<String, String>::build(value)?;
                        let mut node_cursor: HashMap<String, String> = HashMap::new();
                        node_cursor.insert(String::from("cursor"), result.cursor);
                        node_cursor.insert(String::from("node"), node_id.clone());
                        resp.values.append(&mut result.values);
                        resp.cursor.push(node_cursor);
                    }
                }
            }
        }
    }
    Ok(resp)
}

pub async fn node_size<'r>(
    cid: u32,
    payload: String,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<i64, CusError> {
    let args: IdArgs<String> = serde_json::from_str(&payload.as_str())?;
    let nodes: Vec<Node> = manager.get_nodes(cid).await?;
    for n in nodes {
        if n.id == args.id {
            let mut conn = ConnectionWrapper::build(n).await?;
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
    manager.get_nodes(cid).await
}

pub async fn analysis<'r>(
    cid: u32,
    payload: String,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<ScanLikeResult<KeyWithMemory, Vec<HashMap<String, String>>>, CusError> {
    let args: request::ScanLikeArgs<Vec<HashMap<String, String>>> =
        serde_json::from_str(payload.as_str())?;
    let mut resp: ScanLikeResult<KeyWithMemory, Vec<HashMap<String, String>>> =
        ScanLikeResult::default();
    let nodes = manager.get_nodes(cid).await?;

    for x in &args.cursor {
        if let Some(node_id) = x.get("node") {
            if let Some(cursor) = x.get("cursor") {
                for node in nodes.clone() {
                    if node_id == &node.id {
                        let mut conn = ConnectionWrapper::build(node).await?;
                        let mut cmd = redis::cmd("scan");
                        cmd.arg(cursor)
                            .arg(&["count", args.count.to_string().as_str()]);
                        if let Some(search) = &args.search {
                            cmd.arg(&["MATCH", &format!("*{}*", search)]);
                        }
                        if let Some(types) = &args.types {
                            cmd.arg(&["TYPE", types]);
                        }
                        let value: Vec<Value> = manager.execute_with(&mut cmd, &mut conn).await?;
                        let result = ScanLikeResult::<String, String>::build(value)?;
                        let mut node_cursor: HashMap<String, String> = HashMap::new();
                        node_cursor.insert(String::from("cursor"), result.cursor);
                        node_cursor.insert(String::from("node"), node_id.clone());
                        resp.cursor.push(node_cursor);
                        for k in result.values {
                            let memory: i64 = manager
                                .execute_with(
                                    redis::cmd("memory")
                                        .arg("usage")
                                        .arg(&k)
                                        .arg(&["SAMPLES", "0"]),
                                    &mut conn,
                                )
                                .await?;
                            let types: String = manager
                                .execute_with(redis::cmd("type").arg(&k), &mut conn)
                                .await?;
                            let km = KeyWithMemory {
                                name: k,
                                memory: memory,
                                types: types,
                            };
                            resp.values.push(km);
                        }
                    }
                }
            }
        }
    }
    Ok(resp)
}
