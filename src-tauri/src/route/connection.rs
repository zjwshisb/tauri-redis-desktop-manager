use crate::{
    conn::{ConnectionManager, CusConnection},
    err::CusError,
    form,
    sqlite::Connection,
};
use serde::Deserialize;
use tauri::State;

pub fn add(payload: String) -> Result<Connection, CusError> {
    let args: form::ConnectionForm = serde_json::from_str(&payload)?;
    let mut connection = Connection {
        id: 0,
        host: args.host,
        port: args.port,
        password: args.password,
        username: args.username,
        is_cluster: args.is_cluster,
        readonly: args.readonly,
    };
    connection.save()?;
    Ok(connection)
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

pub fn update(payload: String) -> Result<Connection, CusError> {
    let args: form::ConnectionForm = serde_json::from_str(&payload)?;
    if let Some(id) = args.id {
        let mut connection = Connection::first(id)?;
        connection.host = args.host;
        connection.password = args.password;
        connection.port = args.port;
        connection.is_cluster = args.is_cluster;
        connection.readonly = args.readonly;
        connection.username = args.username;
        connection.save()?;
        return Ok(connection);
    }
    Err(CusError::App(String::from("not found")))
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
