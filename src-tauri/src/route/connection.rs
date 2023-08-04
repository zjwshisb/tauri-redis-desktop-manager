use crate::{err::CusError, model::Connection, redis_conn, state::ConnectionManager};
use serde::Deserialize;
use tauri::State;

#[derive(Deserialize)]
struct AddArgs {
    host: String,
    port: i32,
    password: String,
    is_cluster: bool,
}

pub fn add(payload: String) -> Result<Connection, CusError> {
    let args: AddArgs = serde_json::from_str(&payload)?;
    let connection = Connection {
        id: 0,
        host: args.host,
        port: args.port,
        password: args.password,
        is_cluster: args.is_cluster,
    };
    connection.save()
}

pub fn get() -> Result<Vec<Connection>, CusError> {
    Connection::all()
}

#[derive(Deserialize)]
struct DelArgs {
    id: u32,
}

pub fn del(payload: String) -> Result<(), CusError> {
    let args: DelArgs = serde_json::from_str(&payload)?;
    let conn = Connection::first(args.id)?;
    conn.del()
}

#[derive(Deserialize, Debug)]
struct UpdateArgs {
    pub id: u32,
    pub host: String,
    pub port: i32,
    pub password: String,
    pub is_cluster: bool,
}

pub fn update(payload: String) -> Result<Connection, CusError> {
    let args: UpdateArgs = serde_json::from_str(&payload)?;
    let mut connection = Connection::first(args.id)?;

    connection.host = args.host;
    connection.password = args.password;
    connection.port = args.port;
    connection.is_cluster = args.is_cluster;
    connection.save()
}

pub async fn open<'r>(cid: u32, manager: State<'r, ConnectionManager>) -> Result<(), CusError> {
    let conn = redis_conn::RedisConnection::build(cid, 0).await?;
    manager.add(cid, conn).await;
    Ok(())
}

pub async fn close<'r>(cid: u32, manager: State<'r, ConnectionManager>) -> Result<(), CusError> {
    manager.remove(cid).await;
    Ok(())
}
