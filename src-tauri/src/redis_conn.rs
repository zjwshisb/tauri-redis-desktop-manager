use std::collections::HashMap;
use std::time::Duration;

use crate::err::CusError;
use crate::model::{Connection as Conn, Log};
use chrono::prelude::*;
use redis::aio::{Connection, ConnectionLike};
use redis::cluster::ClusterClient;
use redis::cluster_async::ClusterConnection;
use redis::{Arg, Client, FromRedisValue, Value};
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
        conn.set_name(format!("{}@tauri-redis", host.clone()))
            .await?;
        if conn.is_cluster {
            conn.get_nodes().await?;
        }
        return Ok(conn);
    }

    pub async fn build_anonymous(host: &String, password: &String) -> Result<Self, CusError> {
        let b: Box<dyn ConnectionLike + Send>;
        b = Box::new(Self::get_normal(host, password).await?);
        let mut conn = Self {
            id: 0,
            conn: b,
            is_cluster: false,
            host: host.clone(),
            nodes: vec![],
            db: 0,
        };
        conn.set_name(format!("{}@tauri-redis", host.clone()))
            .await?;
        return Ok(conn);
    }

    pub async fn execute_base(&mut self, cmd: &mut redis::Cmd) -> Result<redis::Value, CusError> {
        let value: redis::Value = cmd.query_async(self).await?;
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
                rep.push(String::from_utf8(v.to_vec()).unwrap());
            }
            Value::Status(v) => rep.push(v.to_string()),
            Value::Okay => {
                rep.push(String::from("ok"));
            }
        }
        let log = Log {
            id: 0,
            cmd: cmd_vec.join(" "),
            response: rep.join(" "),
            created_at: Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
            host: self.host.clone(),
        };
        let _ = log.save().unwrap();
        Ok(value)
    }

    pub async fn execute(
        &mut self,
        cmd: &mut redis::Cmd,
        db: u8,
    ) -> Result<redis::Value, CusError> {
        self.change_db(db).await?;
        self.execute_base(cmd).await
    }

    pub async fn set_name(&mut self, name: String) -> Result<(), CusError> {
        self.execute(&mut redis::cmd("CLIENT").arg("SETNAME").arg(name), 0)
            .await?;
        Ok(())
    }

    pub async fn get_info(&mut self) -> Result<Vec<HashMap<String, String>>, CusError> {
        let v: Value = self.execute(&mut redis::cmd("info"), 0).await?;
        let format = |str_value: String| {
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
                    return Ok(vec![format(r)]);
                }
            }
            Value::Bulk(vv) => {
                let mut r: Vec<HashMap<String, String>> = vec![];
                for vvv in vv {
                    r.push(format(String::from_redis_value(&vvv)?));
                }
                return Ok(r);
            }
            _ => {}
        }
        return Err(CusError::App(String::from("Connected Timeout")));
    }

    pub async fn get_version(&mut self) -> Result<String, CusError> {
        let info = self.get_info().await?;
        if let Some(fields) = info.get(0) {
            if let Some(version) = fields.get("redis_version") {
                return Ok(version.clone());
            }
        }
        Ok(String::from(""))
    }

    pub async fn change_db(&mut self, db: u8) -> Result<(), CusError> {
        if !self.is_cluster {
            if self.db != db {
                self.execute_base(redis::cmd("select").arg(db)).await?;
                self.db = db;
            }
        }
        Ok(())
    }

    pub async fn get_nodes(&mut self) -> Result<Vec<String>, CusError> {
        if !self.is_cluster {
            return Err(CusError::App(String::from("Not a Cluster Server")));
        }
        if self.nodes.len() == 0 {
            let values: redis::Value = self.execute(redis::cmd("CLUSTER").arg("nodes"), 0).await?;
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

    pub async fn get_normal(host: &String, password: &String) -> Result<Connection, CusError> {
        let client = Client::open(host.clone())?;
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

    pub async fn get_cluster(
        host: &String,
        password: &String,
    ) -> Result<ClusterConnection, CusError> {
        let client = ClusterClient::new(vec![host.clone()]).unwrap();

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
