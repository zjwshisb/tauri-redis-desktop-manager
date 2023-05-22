use redis::{Client, Connection};
use crate::err::CusError;
use crate::model::{Connection as Conn};
use crate::sqlite;

pub fn get_connection(connection_id: u32, db: u8) -> Result<Connection, CusError> {
    let conn = sqlite::get_sqlite_client().unwrap();
    let mut stmt = conn.prepare("select id, host, port, auth from connections where id= ?").unwrap();
    return match stmt.query_row([connection_id], |r| {
        Ok(Conn{
            id: r.get(0).unwrap(),
            host: r.get(1).unwrap(),
            port: r.get(2).unwrap(),
            auth: r.get(3).unwrap(),
        })
    }) {
        Ok(c) => {
            let client = Client::open(format!("redis://{}:{}", c.host, c.port)).unwrap();
            let mut connection = client.get_connection().unwrap();
            if c.auth != "" {
                redis::cmd("auth").arg(c.auth).query::<redis::Value>(& mut connection).unwrap();
            } 
            redis::cmd("select").arg(db).query(& mut connection)?;
            Ok(connection)
        }
        Err(_) => {
            Err(CusError::App("connection not found".to_string()))
        }
    }
}