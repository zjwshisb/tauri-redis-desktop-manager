use crate::{
    conn::{ConnectionManager, CusConnection},
    err::CusError,
    model::Connection,
};
use serde::Deserialize;
use tauri::State;

#[derive(Deserialize)]
struct AddArgs {
    host: String,
    port: i32,
    password: String,
    is_cluster: bool,
    readonly: bool,
}

pub fn add(payload: String) -> Result<Connection, CusError> {
    let args: AddArgs = serde_json::from_str(&payload)?;
    let connection = Connection {
        id: 0,
        host: args.host,
        port: args.port,
        password: args.password,
        is_cluster: args.is_cluster,
        readonly: args.readonly,
        nodes: vec![],
        dbs: vec![],
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
    id: u32,
    host: String,
    port: i32,
    password: String,
    is_cluster: bool,
    readonly: bool,
}

pub fn update(payload: String) -> Result<Connection, CusError> {
    let args: UpdateArgs = serde_json::from_str(&payload)?;
    let mut connection = Connection::first(args.id)?;

    connection.host = args.host;
    connection.password = args.password;
    connection.port = args.port;
    connection.is_cluster = args.is_cluster;
    connection.readonly = args.readonly;
    connection.save()
}

pub async fn open<'r>(cid: u32, manager: State<'r, ConnectionManager>) -> Result<(), CusError> {
    let conn = CusConnection::build(cid).await?;
    manager.add(cid, conn).await;
    Ok(())
}

pub async fn close<'r>(cid: u32, manager: State<'r, ConnectionManager>) -> Result<(), CusError> {
    manager.remove(cid).await;
    Ok(())
}
