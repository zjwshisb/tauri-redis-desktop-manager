use std::collections::HashMap;
use std::time::Duration;

use crate::err::CusError;
use crate::model::Connection as Conn;
use chrono::prelude::*;
use rand::distributions::Alphanumeric;
use rand::prelude::*;
use redis::aio::{Connection, ConnectionLike};
use redis::cluster::ClusterClient;
use redis::cluster_async::ClusterConnection;
use redis::{Arg, Client, FromRedisValue, Value};
use serde::Serialize;
use tokio::time::timeout;

#[derive(Serialize)]
pub struct CusCmd {
    pub id: String,
    pub cmd: String,
    pub response: String,
    pub host: String,
    pub created_at: String,
    pub duration: i64,
}

pub struct RedisConnection {
    pub conn: Box<dyn ConnectionLike + Send>,
    pub is_cluster: bool,
    pub host: String,
    pub id: u32,
    pub nodes: Vec<String>,
    pub db: u8,
}

impl RedisConnection {
    // get the conn with connection id
    pub async fn build(cid: u32) -> Result<Self, CusError> {
        let conn = Conn::first(cid)?;
        let b: Box<dyn ConnectionLike + Send>;
        let host = conn.get_host();
        if conn.is_cluster {
            b = Box::new(Self::get_cluster(&host, &conn.password).await?);
        } else {
            b = Box::new(Self::get_normal(&host, &conn.password).await?);
        }
        let mut conn = Self {
            id: cid,
            conn: b,
            is_cluster: conn.is_cluster,
            host: host.clone(),
            nodes: vec![],
            db: 0,
        };
        if conn.is_cluster {
            conn.get_nodes().await?;
        }
        return Ok(conn);
    }
    // get the conn with host
    pub async fn build_anonymous(host: &String, password: &String) -> Result<Self, CusError> {
        let b: Box<dyn ConnectionLike + Send>;
        b = Box::new(Self::get_normal(host, password).await?);
        let conn = Self {
            id: 0,
            conn: b,
            is_cluster: false,
            host: host.clone(),
            nodes: vec![],
            db: 0,
        };
        return Ok(conn);
    }

    // execute the redis command
    pub async fn execute(
        &mut self,
        cmd: &mut redis::Cmd,
    ) -> Result<(redis::Value, CusCmd), CusError> {
        let mut cmd_vec: Vec<String> = vec![];
        for arg in cmd.args_iter() {
            match arg {
                Arg::Simple(v) => {
                    let s = String::from_utf8(v.to_vec()).unwrap();
                    cmd_vec.push(s);
                }
                Arg::Cursor => {}
            }
        }
        let start = Local::now();
        let value: redis::Value = cmd.query_async(self).await?;
        let end = Local::now();
        let mut rep: Vec<String> = vec![];
        match &value {
            Value::Bulk(v) => {
                for vv in v {
                    match vv {
                        Value::Data(vvv) => {
                            let s = String::from_utf8(vvv.to_vec()).unwrap();
                            rep.push(s);
                        }
                        Value::Bulk(vvv) => {
                            for vvvv in vvv {
                                match vvvv {
                                    Value::Data(vvvvv) => {
                                        let s = String::from_utf8(vvvvv.to_vec()).unwrap();
                                        rep.push(s);
                                    }
                                    _ => {}
                                }
                            }
                        }
                        _ => {}
                    }
                }
            }
            Value::Int(v) => rep.push(v.to_string()),
            Value::Nil => rep.push(String::from("nil")),
            Value::Data(v) => {
                // maybe value is bitmap
                let s = String::from_utf8(v.to_vec());
                match s {
                    Ok(s) => rep.push(s),
                    Err(_) => {
                        let i: Vec<u8> = Vec::from_redis_value(&value).unwrap();
                        let binary = i
                            .iter()
                            .map(|u| format!("{:b}", u))
                            .collect::<Vec<String>>()
                            .join("");

                        rep.push(binary)
                    }
                }
            }
            Value::Status(v) => rep.push(v.to_string()),
            Value::Okay => {
                rep.push(String::from("OK"));
            }
        }
        let mut rng = rand::thread_rng();
        let id = Alphanumeric
            .sample_iter(&mut rng)
            .take(20)
            .map(char::from)
            .collect::<String>();
        let cus_cmd = CusCmd {
            id,
            cmd: cmd_vec.join(" "),
            response: rep.join(" "),
            created_at: Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
            host: self.host.clone(),
            duration: end.timestamp_micros() - start.timestamp_micros(),
        };
        Ok((value, cus_cmd))
    }

    // get the server info
    // if the cluster server, response is vec
    // so for unify, normal server is change to vec, the value is set to vec
    pub async fn get_info(&mut self) -> Result<Vec<HashMap<String, String>>, CusError> {
        let (v, _) = self.execute(&mut redis::cmd("info")).await?;
        let format_fn = |str_value: String| {
            let arr: Vec<&str> = str_value.split("\r\n").collect();
            let mut kv: HashMap<String, String> = HashMap::new();
            for v in arr {
                if v.contains(":") {
                    let key_value: Vec<&str> = v.split(":").collect();
                    if let Some(key) = key_value.get(0) {
                        if let Some(value) = key_value.get(1) {
                            kv.insert(key.to_string(), value.to_string());
                        }
                    }
                }
            }
            return kv;
        };
        match v {
            Value::Data(cc) => {
                if let Ok(r) = String::from_utf8(cc) {
                    return Ok(vec![format_fn(r)]);
                }
            }
            Value::Bulk(vv) => {
                let mut r: Vec<HashMap<String, String>> = vec![];
                for vvv in vv {
                    r.push(format_fn(String::from_redis_value(&vvv)?));
                }
                return Ok(r);
            }
            _ => {}
        }
        return Err(CusError::App(String::from("Connected Timeout")));
    }

    // get redis server version
    pub async fn get_version(&mut self) -> Result<String, CusError> {
        let info = self.get_info().await?;
        if let Some(fields) = info.get(0) {
            if let Some(version) = fields.get("redis_version") {
                return Ok(version.clone());
            }
        }
        Ok(String::from(""))
    }

    // get the cluster node
    pub async fn get_nodes(&mut self) -> Result<Vec<String>, CusError> {
        if !self.is_cluster {
            return Err(CusError::App(String::from("Not a Cluster Server")));
        }
        if self.nodes.len() == 0 {
            let (values, _) = self.execute(redis::cmd("CLUSTER").arg("nodes")).await?;
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

    // get normal redis connection
    pub async fn get_normal(host: &str, password: &str) -> Result<Connection, CusError> {
        let client = Client::open(host)?;
        let rx = timeout(Duration::from_secs(2), client.get_async_connection()).await;
        match rx {
            Ok(conn_result) => match conn_result {
                Ok(mut connection) => {
                    if password != "" {
                        redis::cmd("auth")
                            .arg(password)
                            .query_async(&mut connection)
                            .await?;
                    }
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
    // get cluster redis connection
    pub async fn get_cluster(host: &str, password: &str) -> Result<ClusterConnection, CusError> {
        let client = ClusterClient::new(vec![host]).unwrap();
        let rx = timeout(Duration::from_secs(2), client.get_async_connection()).await;
        match rx {
            Ok(conn_result) => match conn_result {
                Ok(mut connection) => {
                    if password != "" {
                        redis::cmd("auth")
                            .arg(password)
                            .query_async(&mut connection)
                            .await?;
                    }
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
