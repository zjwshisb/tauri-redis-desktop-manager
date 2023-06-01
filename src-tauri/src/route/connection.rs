

use rusqlite::{self, params};

use serde::{Deserialize};
use crate::{err::CusError, model::Connection};




#[derive(Deserialize)]
struct AddArgs {
    host: String,
    port: i32,
    password: String
}

pub fn add(payload : &str) -> Result<(), CusError> {
    let conn = crate::sqlite::get_sqlite_client()?;
    let args: AddArgs = serde_json::from_str(&payload)?;
    let exists = conn.query_row("select * from connections where host= ?1 and port= ?2", (&args.host, &args.port), |_row| {
        Ok(())
    });
    if let Ok(()) = exists {
        return Err(CusError::App(String::from("Same Connection Exists")))
    }
    conn.execute("insert into connections (host, port, password) values(?1, ?2, ?3)", (&args.host, &args.port, &args.password))?;
    Ok(())
}

pub fn get() -> Result<Vec<Connection>, CusError> {
    let conn = crate::sqlite::get_sqlite_client()?;
    let mut stmt = conn.prepare("select id, host, port, password from connections")?;
    let connections_iter = stmt.query_map([], |row| {
        Ok(Connection {
           id: row.get(0).unwrap(),
           host: row.get(1).unwrap(),
           port: row.get(2).unwrap(),
           password: row.get(3).unwrap()
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

#[derive(Deserialize, Debug)]
struct UpdateArgs {
    pub id: u64,
    pub host: String,
    pub port: i32,
    pub password: String,
}

pub fn update(payload : &str) -> Result<(), CusError>  {
    let conn = crate::sqlite::get_sqlite_client()?;
    let args: UpdateArgs = serde_json::from_str(&payload)?;
    dbg!(&args);
    conn.execute("UPDATE connections set host= ?1,port= ?2, password= ?3 where id = ?4", 
    params!(args.host, args.port, args.password,args.id))?;
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