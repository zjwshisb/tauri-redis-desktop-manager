use std::time::Duration;

use redis::{Client, Value};
use redis::aio::{Connection};
use crate::err::CusError;
use crate::model::{Connection as Conn};
use crate::sqlite;
use tokio::time::{timeout};

pub  async fn get_connection(connection_id: u32, db: u8) -> Result<Connection, CusError> {
    let conn = sqlite::get_sqlite_client()?;
    let mut stmt = conn.prepare("select id, host, port, password from connections where id= ?1")?;
    return match stmt.query_row([connection_id], |r| {
        Ok(Conn{
            id: r.get(0).unwrap(),
            host: r.get(1).unwrap(),
            port: r.get(2).unwrap(),
            password: r.get(3).unwrap(),
        })
    }) {
        Ok(c) => {
            let client = Client::open(format!("redis://{}:{}", c.host, c.port))?;

            let rx = timeout(Duration::from_secs(5), client.get_async_connection()).await;
            match rx {
                Ok(conn_result) => {
                   match conn_result {
                       Ok(mut connection) => {
                            if c.password != "" {
                                redis::cmd("auth").arg(c.password).query_async(& mut connection).await?;
                            } 
                            redis::cmd("select").arg(db).query_async(& mut connection).await?;
                            redis::cmd("CLIENT")
                            .arg("SETNAME")
                            .arg(format!("{}:{}", c.host, c.port)).query_async(& mut  connection).await?;
                            return Ok(connection)
                       }
                       Err(r) => {
                        return Err(CusError::App(r.to_string())); 
                       },
                   }
                }
                Err(e) => {
                    
                    return Err(CusError::App(String::from("value"))); 
                }
            }
        
        }
        Err(_) => {
            Err(CusError::App("Connection Not Found".to_string()))
        }
    }
}