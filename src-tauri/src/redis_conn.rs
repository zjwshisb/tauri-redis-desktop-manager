use redis::{Client, Connection, Commands};
use crate::err::CusError;
use crate::model::{Connection as Conn};
use crate::sqlite;

pub fn get_connection(connection_id: u32, db: u8) -> Result<Connection, CusError> {
    let conn = sqlite::get_sqlite_client().unwrap();
    let mut stmt = conn.prepare("select id, host, port, auth from connections where id= ?1").unwrap();
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
            let connection_result = client.get_connection();
            return match connection_result {
                Ok(mut connection) => {
                    if c.auth != "" {
                        redis::cmd("auth").arg(c.auth).query::<redis::Value>(& mut connection).unwrap();
                    } 
                    redis::cmd("select").arg(db).query(& mut connection)?;
                    redis::cmd("CLIENT")
                    .arg("SETNAME")
                    .arg(format!("{}:{}", c.host, c.port)).query(& mut  connection)?;
                    return Ok(connection)
                }
                Err(e) => {
                    Err(CusError::App(e.to_string()))
                }
            }
           
        }
        Err(_) => {
            Err(CusError::App("connection not found".to_string()))
        }
    }
}