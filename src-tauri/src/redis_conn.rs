use std::time::Duration;

use crate::err::CusError;
use crate::model::Connection as Conn;
use redis::aio::Connection;
use redis::Client;
use tokio::time::timeout;

pub async fn get_connection(connection_id: u32, db: u8) -> Result<Connection, CusError> {
    let c = Conn::first(connection_id)?;
    let client = Client::open(format!("redis://{}:{}", c.host, c.port))?;
    let rx = timeout(Duration::from_secs(2), client.get_async_connection()).await;
    match rx {
        Ok(conn_result) => match conn_result {
            Ok(mut connection) => {
                if c.password != "" {
                    redis::cmd("auth")
                        .arg(c.password)
                        .query_async(&mut connection)
                        .await?;
                }
                redis::cmd("select")
                    .arg(db)
                    .query_async(&mut connection)
                    .await?;
                redis::cmd("CLIENT")
                    .arg("SETNAME")
                    .arg(format!("{}:{}@tauri-redis", c.host, c.port))
                    .query_async(&mut connection)
                    .await?;
                return Ok(connection);
            }
            Err(e) => {
                return Err(CusError::App(e.to_string()));
            }
        },
        Err(_) => {
            return Err(CusError::App(String::from("Connection Timeout")));
        }
    }
}
