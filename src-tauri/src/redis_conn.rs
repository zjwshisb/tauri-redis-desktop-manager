use std::time::Duration;

use crate::err::CusError;
use crate::model::Connection as Conn;
use redis::aio::{Connection, ConnectionLike};
use redis::cluster::ClusterClient;
use redis::cluster_async::ClusterConnection;
use redis::{Client, FromRedisValue};
use tokio::time::timeout;

pub struct RedisConnection {
    pub conn: Box<dyn ConnectionLike + Send>,
    pub is_cluster: bool,
    pub host: String,
    pub id: u32,
    pub nodes: Vec<String>,
    pub db: u8,
}
impl RedisConnection {
    pub async fn build(cid: u32, db: u8) -> Result<Self, CusError> {
        let conn = Conn::first(cid)?;
        let b: Box<dyn ConnectionLike + Send>;
        let host = format!("redis://{}:{}", &conn.host, &conn.port);
        if conn.is_cluster {
            b = Box::new(Self::get_cluster_connection(&conn).await?);
        } else {
            b = Box::new(Self::get_normal_connection(&conn, db).await?);
        }
        let mut conn = Self {
            id: cid,
            conn: b,
            is_cluster: conn.is_cluster,
            host,
            nodes: vec![],
            db,
        };
        if conn.is_cluster {
            conn.get_nodes().await?;
        }
        return Ok(conn);
    }

    pub async fn change_db(&mut self, db: u8) -> Result<(), CusError> {
        if !self.is_cluster {
            if self.db != db {
                self.db = db;
                redis::cmd("select").arg(db).query_async(self).await?;
            }
        }
        Ok(())
    }

    pub async fn get_nodes(&mut self) -> Result<Vec<String>, CusError> {
        if !self.is_cluster {
            return Err(CusError::App(String::from("Not a Cluster Server")));
        }
        if self.nodes.len() == 0 {
            let values: redis::Value = redis::cmd("CLUSTER").arg("nodes").query_async(self).await?;
            let csv = String::from_redis_value(&values)?;
            let items: Vec<&str> = csv.split("\n").collect();
            let mut nodes: Vec<String> = vec![];
            for ss in &items {
                let arr: Vec<&str> = ss.split(" ").collect();
                if let Some(t) = arr.get(2) {
                    if t.contains("master") {
                        if let Some(full_host) = arr.get(1) {
                            if let Some(i) = full_host.find("@") {
                                let host = &full_host[0..i];
                                let mut prefix = String::from("redis://");
                                prefix.push_str(host);
                                nodes.push(prefix);
                            }
                        }
                    }
                }
            }
            self.nodes = nodes;
        }
        Ok(self.nodes.clone())
    }

    pub async fn get_cluster_connection(conn: &Conn) -> Result<ClusterConnection, CusError> {
        let host = format!("redis://{}:{}", &conn.host, &conn.port);
        let client = ClusterClient::new(vec![host]).unwrap();

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

    pub async fn get_normal_connection(conn: &Conn, db: u8) -> Result<Connection, CusError> {
        if conn.is_cluster {
            return Err(CusError::App(String::from(
                "Server is a cluster server, not support this action",
            )));
        }
        let client = Client::open(format!("redis://{}:{}", conn.host, conn.port))?;
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
}

impl ConnectionLike for RedisConnection {
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
