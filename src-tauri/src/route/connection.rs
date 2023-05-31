
use std::env::args;

use rusqlite::{self};

use serde::{Serialize, Deserialize};
use crate::err::CusError;

#[derive(Debug, Serialize)]
pub struct Connection {
    pub id: u16,
    pub host: String,
    pub port: i32,
    pub auth: String,
}


impl Connection {
    pub fn save(&self) {
        
    }
    pub fn delete(&self) {

    }
}

pub fn get_sqlite_client() {

}

#[derive(Deserialize)]
struct AddArgs {
    host: String,
    port: i32,
    auth: String
}

pub fn add(payload : &str) -> Result<(), CusError> {
    let conn = crate::sqlite::get_sqlite_client()?;
    let args: AddArgs = serde_json::from_str(&payload)?;
    let exists = conn.query_row("select * from connections where host=?1 and port=?2", (&args.host, &args.port), |_row| {
        Ok(())
    });
    if let Ok(()) = exists {
        return Err(CusError::App(String::from("Same Connection Exists")))
    }
    conn.execute("insert into connections (host, port, auth) values(?1, ?2, ?3)", (&args.host, &args.port, &args.auth))?;
    Ok(())
}

pub fn get() -> Result<Vec<Connection>, CusError> {
    let conn = crate::sqlite::get_sqlite_client()?;
    let mut stmt = conn.prepare("select id, host, port, auth from connections")?;
    let connections_iter = stmt.query_map([], |row| {
        Ok(Connection {
           id: row.get(0).unwrap(),
           host: row.get(1).unwrap(),
           port: row.get(2).unwrap(),
           auth: row.get(3).unwrap()
        })
    })?;
    let mut result: Vec<Connection> = vec![];
    for x in connections_iter {
        result.push(x.unwrap());
    }
    Ok(result)
}

#[derive(Deserialize)]
struct DelArgs {
   id: i64
}

pub fn del(payload : &str) -> Result<(), CusError> {
    let conn = crate::sqlite::get_sqlite_client()?;
    let args: DelArgs = serde_json::from_str(&payload)?;
    conn.execute("delete from connections where id = ?1", [args.id])?;
    Ok(())
}   
//
// #[tauri::command]
// pub fn delete_connection(id: u16) -> Result<String, CusError>{
//     let conn = sqlite::get_sqlite_client()?;
//     conn.execute("DELETE FROM connections where id = ?1", params![id])?;
//     Ok("Ok".into())
// }
// pub fn update_connection() {
//
// }