use std::time::Duration;

use crate::err::CusError;
use crate::model::Connection as Conn;
use redis::aio::{Connection, ConnectionLike};
use redis::cluster::ClusterClient;
use redis::cluster_async::ClusterConnection;
use redis::{Client, FromRedisValue};
use tokio::time::timeout;

pub struct CusConnectionLike {
    conn: Box<dyn ConnectionLike + Send>,
    is_cluster: bool,
    host: String,
    nodes: Vec<String>,
}
impl CusConnectionLike {
    pub async fn build(conn: Conn, db: u8) -> Self {}

    pub fn new(conn: Box<dyn ConnectionLike + Send>, is_cluster: bool) -> Self {
        return CusConnectionLike {
            conn,
            is_cluster,
            host: String::from(""),
            nodes: vec![],
        };
    }
    pub async fn get_cluster_nodes(&mut self) -> Result<Vec<String>, CusError> {
        let values: redis::Value = redis::cmd("CLUSTER").arg("nodes").query_async(self).await?;
        let csv = String::from_redis_value(&values)?;
        let items: Vec<&str> = csv.split("\n").collect();
        dbg!(items);
        Ok(vec![])
    }
}

impl ConnectionLike for CusConnectionLike {
    fn req_packed_command<'a>(
        &'a mut self,
        cmd: &'a redis::Cmd,
    ) -> redis::RedisFuture<'a, redis::Value> {
        return self.conn.req_packed_command(cmd);
    }

    fn req_packed_commands<'a>(
        &'a mut self,
        cmd: &'a redis::Pipeline,
        offset: usize,
        count: usize,
    ) -> redis::RedisFuture<'a, Vec<redis::Value>> {
        self.conn.req_packed_commands(cmd, offset, count)
    }

    fn get_db(&self) -> i64 {
        self.conn.get_db()
    }
}

pub struct BoxedConnectionLike(Box<dyn ConnectionLike + Send>, bool, Vec<String>);

impl BoxedConnectionLike {
    pub fn new(conn: Box<dyn ConnectionLike + Send>, cluster: bool) -> Self {
        return BoxedConnectionLike(conn, cluster, vec![]);
    }
    pub async fn get_cluster_nodes(&mut self) -> Result<Vec<String>, CusError> {
        let values: redis::Value = redis::cmd("CLUSTER").arg("nodes").query_async(self).await?;
        let csv = String::from_redis_value(&values)?;
        let items: Vec<&str> = csv.split("\n").collect();
        dbg!(items);
        Ok(vec![])
    }
}

impl ConnectionLike for BoxedConnectionLike {
    fn req_packed_command<'a>(
        &'a mut self,
        cmd: &'a redis::Cmd,
    ) -> redis::RedisFuture<'a, redis::Value> {
        return self.0.req_packed_command(cmd);
    }

    fn req_packed_commands<'a>(
        &'a mut self,
        cmd: &'a redis::Pipeline,
        offset: usize,
        count: usize,
    ) -> redis::RedisFuture<'a, Vec<redis::Value>> {
        self.0.req_packed_commands(cmd, offset, count)
    }

    fn get_db(&self) -> i64 {
        self.0.get_db()
    }
}

pub async fn get_normal_connection(conn: Conn, db: u8) -> Result<Connection, CusError> {
    let client = Client::open(format!("redis://{}:{}", conn.host, conn.port))?;
    let rx = timeout(Duration::from_secs(2), client.get_async_connection()).await;
    match rx {
        Ok(conn_result) => match conn_result {
            Ok(mut connection) => {
                if conn.password != "" {
                    redis::cmd("auth")
                        .arg(conn.password)
                        .query_async(&mut connection)
                        .await?;
                }
                if db > 0 {
                    redis::cmd("select")
                        .arg(db)
                        .query_async(&mut connection)
                        .await?;
                }
                redis::cmd("CLIENT")
                    .arg("SETNAME")
                    .arg(format!("{}:{}@tauri-redis", conn.host, conn.port))
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

pub async fn get_normal_connection_box(
    conn: Conn,
    db: u8,
) -> Result<BoxedConnectionLike, CusError> {
    let connection = get_normal_connection(conn, db).await?;
    return Ok(BoxedConnectionLike::new(Box::new(connection), false));
}

pub async fn get_cluster_connection(conn: Conn) -> Result<ClusterConnection, CusError> {
    let host = format!("redis://{}:{}", &conn.host, &conn.port);
    let client = ClusterClient::new(vec![
        "redis://127.0.0.1:7000",
        "redis://127.0.0.1:7001",
        "redis://127.0.0.1:7002",
        "redis://127.0.0.1:7003",
        "redis://127.0.0.1:7004",
    ])
    .unwrap();
    let rx = timeout(Duration::from_secs(2), client.get_async_connection()).await;
    match rx {
        Ok(conn_result) => match conn_result {
            Ok(mut connection) => {
                if conn.password != "" {
                    redis::cmd("auth")
                        .arg(&conn.password)
                        .query_async(&mut connection)
                        .await?;
                }
                redis::cmd("CLIENT")
                    .arg("SETNAME")
                    .arg(format!("{}:{}@tauri-redis", &conn.host, &conn.port))
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

pub async fn get_cluster_connection_box(conn: Conn) -> Result<BoxedConnectionLike, CusError> {
    let connection = get_cluster_connection(conn).await?;
    let mut b: BoxedConnectionLike = BoxedConnectionLike::new(Box::new(connection), true);
    b.get_cluster_nodes().await?;
    return Ok(b);
}

pub async fn get_connection(connection_id: u32, db: u8) -> Result<BoxedConnectionLike, CusError> {
    let c = Conn::first(connection_id)?;
    if c.is_cluster {
        return get_cluster_connection_box(c).await;
    } else {
        return get_normal_connection_box(c, db).await;
    }
}
