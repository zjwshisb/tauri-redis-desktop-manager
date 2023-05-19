
use rusqlite::{self};

use serde::Serialize;
use crate::err::CusError;
use super::{sqlite};

#[derive(Debug, Serialize)]
pub struct Connection {
    pub id: u16,
    pub host: String,
    pub port: u16,
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

// #[tauri::command]
// pub fn add_connection(host: String, port: u16, auth: String ) -> Result<Connection, CusError> {
//     let conn = sqlite::get_sqlite_client()?;
//     let connection = Connection{
//         id: 0,
//         host,
//         port,
//         auth,
//     };
//     conn.execute("insert into connections (host, port, auth) values(?1, ?2, ?3)", (&connection.host, &connection.port, &connection.auth))?;
//     Ok(connection)
// }
//
#[tauri::command]
pub fn get_connections() -> Result<Vec<Connection>, CusError> {
    let conn = sqlite::get_sqlite_client()?;
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