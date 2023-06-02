use rusqlite::{self, params};

use crate::{err::CusError, model::Connection};
use serde::Deserialize;

#[derive(Deserialize)]
struct AddArgs {
    host: String,
    port: i32,
    password: String,
}

pub fn add(payload: String) -> Result<Connection, CusError> {
    let args: AddArgs = serde_json::from_str(&payload)?;
    let connection = Connection {
        id: 0,
        host: args.host,
        port: args.port,
        password: args.password,
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
}

pub fn update(payload: String) -> Result<Connection, CusError> {
    let args: UpdateArgs = serde_json::from_str(&payload)?;
    let mut connection = Connection::first(args.id)?;
    connection.host = args.host;
    connection.password = args.password;
    connection.port = args.port;
    connection.save()
}
