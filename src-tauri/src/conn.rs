use std::collections::HashMap;
use std::fmt::Debug;
use std::time::Duration;

use crate::err::CusError;
use crate::sqlite::Connection as Conn;
use crate::utils::random_str;
use crate::{response, utils};
use chrono::prelude::*;
use redis::aio::{Connection, ConnectionLike};
use redis::cluster::ClusterClient;
use redis::cluster_async::ClusterConnection;
use redis::{Arg, Client, FromRedisValue, Value};
use redis::{Cmd, IntoConnectionInfo};
use serde::Serialize;
use tokio::time::timeout;

use tokio::sync::{mpsc::Sender, Mutex};

/**
 * see https://redis.io/commands/cluster-nodes/
 */
#[derive(Serialize, Clone, Debug)]
pub struct Node {
    pub id: String,
    pub host: String,
    pub port: u16,
    pub flags: String,
    pub master: String,
    pub ping_sent: i64,
    pub pong_recv: i64,
    pub config_epoch: String,
    pub link_state: String,
    pub slot: String,
    pub password: Option<String>,
}

impl Node {
    pub fn build(s: String) -> Self {
        let mut v: Vec<&str> = s.split(" ").collect();
        let get_fn = |v: &mut Vec<&str>, index: usize| -> String {
            if v.len() > index {
                return String::from(v.remove(index));
            }
            "".to_string()
        };
        let mut host = get_fn(&mut v, 1);
        let mut port = 0;
        if let Some(u) = host.find("@") {
            host = host[0..u].to_string();
            if let Some(u) = host.find(":") {
                let port_str = host[u + 1..].to_string();
                host = host[0..u].to_string();
                dbg!(&port_str);
                port = port_str.parse().unwrap()
            }
        }
        let node = Self {
            id: get_fn(&mut v, 0),
            host: host,
            port: port,
            flags: get_fn(&mut v, 0),
            master: get_fn(&mut v, 0),
            ping_sent: get_fn(&mut v, 0).parse::<i64>().unwrap_or_default(),
            pong_recv: get_fn(&mut v, 0).parse::<i64>().unwrap_or_default(),
            config_epoch: get_fn(&mut v, 0),
            link_state: get_fn(&mut v, 0),
            slot: get_fn(&mut v, 0),
            password: None,
        };
        node
    }
}
impl IntoConnectionInfo for Node {
    fn into_connection_info(self) -> redis::RedisResult<redis::ConnectionInfo> {
        Ok(redis::ConnectionInfo {
            addr: redis::ConnectionAddr::Tcp(self.host.clone(), self.port),
            redis: redis::RedisConnectionInfo {
                db: 0,
                username: None,
                password: self.password,
            },
        })
    }
}

#[derive(Serialize)]
pub struct CusCmd {
    pub id: String,
    pub cmd: String,
    pub response: String,
    pub host: String,
    pub created_at: String,
    pub duration: i64,
}

pub struct CusConnection {
    pub conn: Box<dyn ConnectionLike + Send>,
    pub is_cluster: bool,
    pub host: String,
    pub id: String,
    pub cid: u32,
    pub nodes: Vec<Node>,
    pub db: u8,
    pub created_at: chrono::DateTime<Local>,
    pub connection_model: Option<Conn>,
}
/**
 * custom redis connection
 */
impl CusConnection {
    // get the conn with connection id
    pub async fn build(cid: u32) -> Result<Self, CusError> {
        let conn = Conn::first(cid)?;
        let b: Box<dyn ConnectionLike + Send>;
        let host = conn.get_host();
        if conn.is_cluster {
            b = Box::new(Self::get_cluster(conn.clone()).await?);
        } else {
            b = Box::new(Self::get_normal(conn.clone()).await?);
        }
        Ok(Self {
            id: utils::random_str(32),
            cid,
            conn: b,
            is_cluster: conn.is_cluster,
            host: host.clone(),
            nodes: vec![],
            db: 0,
            created_at: Local::now(),
            connection_model: Some(conn),
        })
    }
    // get the conn with host
    pub async fn build_anonymous<T: redis::IntoConnectionInfo + Debug>(
        params: T,
    ) -> Result<Self, CusError> {
        let b: Box<dyn ConnectionLike + Send>;
        b = Box::new(Self::get_normal(params).await?);
        Ok(Self {
            id: utils::random_str(32),
            cid: 0,
            conn: b,
            is_cluster: false,
            host: String::from(""),
            nodes: vec![],
            db: 0,
            created_at: Local::now(),
            connection_model: None,
        })
    }

    // get normal redis connection
    pub async fn get_normal<T: redis::IntoConnectionInfo + Debug>(
        params: T,
    ) -> Result<Connection, CusError> {
        let client = Client::open(params)?;

        let rx = timeout(Duration::from_secs(2), client.get_async_connection()).await;
        match rx {
            Ok(conn_result) => match conn_result {
                Ok(connection) => {
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
    pub async fn get_cluster<T: redis::IntoConnectionInfo + Debug>(
        params: T,
    ) -> Result<ClusterConnection, CusError> {
        let client = ClusterClient::new(vec![params]).unwrap();
        let rx = timeout(Duration::from_secs(2), client.get_async_connection()).await;
        match rx {
            Ok(conn_result) => match conn_result {
                Ok(connection) => {
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

    // execute the redis command
    async fn execute(&mut self, cmd: &mut redis::Cmd) -> Result<(redis::Value, CusCmd), CusError> {
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
        let cus_cmd = CusCmd {
            id: utils::random_str(32),
            cmd: cmd_vec.join(" "),
            response: rep.join(" "),
            created_at: Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
            host: self.host.clone(),
            duration: end.timestamp_micros() - start.timestamp_micros(),
        };
        Ok((value, cus_cmd))
    }
}

impl ConnectionLike for CusConnection {
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

/**
 * connection manager state
 */
pub struct ConnectionManager {
    pub map: Mutex<HashMap<u32, CusConnection>>,
    debug_tx: Mutex<Vec<Sender<CusCmd>>>,
}

impl ConnectionManager {
    pub fn new() -> ConnectionManager {
        ConnectionManager {
            map: Mutex::new(HashMap::new()),
            debug_tx: Mutex::new(vec![]),
        }
    }
    pub async fn add(&self, cid: u32, conn: CusConnection) {
        self.map.lock().await.insert(cid, conn);
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            let _ = self.set_name(conn, "tauri-redis".to_string()).await;
        }
    }

    pub async fn set_name(&self, conn: &mut CusConnection, name: String) -> Result<(), CusError> {
        self.execute_with(redis::cmd("CLIENT").arg("SETNAME").arg(&name), conn)
            .await?;
        Ok(())
    }

    pub async fn get_config(
        &self,
        cid: u32,
        pattern: &str,
    ) -> Result<HashMap<String, String>, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            return self.get_config_with(pattern, conn).await;
        }
        return Err(CusError::App(String::from("Connection Not Found")));
    }

    pub async fn get_config_with(
        &self,
        pattern: &str,
        conn: &mut CusConnection,
    ) -> Result<HashMap<String, String>, CusError> {
        let value: Value = self
            .execute_with(redis::cmd("config").arg("get").arg(pattern), conn)
            .await?;
        let vec: Vec<String> = Vec::from_redis_value(&value)?;
        let mut map = HashMap::new();

        let mut i: usize = 0;
        while i < vec.len() {
            if let Some(key) = vec.get(i) {
                if let Some(value) = vec.get(i + 1) {
                    map.insert(key.clone(), value.clone());
                }
            }
            i += 2;
        }
        Ok(map)
    }

    pub async fn get_version(&self, cid: u32) -> Result<String, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            return self.get_version_with(conn).await;
        }
        return Err(CusError::App(String::from("Connection Not Found")));
    }

    // get redis server version
    pub async fn get_version_with(&self, conn: &mut CusConnection) -> Result<String, CusError> {
        let info = self.get_info_with(conn).await?;
        if let Some(fields) = info.get(0) {
            if let Some(version) = fields.get("redis_version") {
                return Ok(version.clone());
            }
        }
        Ok(String::from(""))
    }

    pub async fn get_info(&self, cid: u32) -> Result<Vec<HashMap<String, String>>, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            return self.get_info_with(conn).await;
        }
        return Err(CusError::App(String::from("Connection Not Found")));
    }

    // get the server info
    // if the cluster server, response is vec
    // so for unify, normal server is change to vec, the value is set to vec
    pub async fn get_info_with(
        &self,
        conn: &mut CusConnection,
    ) -> Result<Vec<HashMap<String, String>>, CusError> {
        let v = self.execute_with(&mut redis::cmd("info"), conn).await?;
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

    // get cluster server nodes
    pub async fn get_nodes(&self, cid: u32) -> Result<Vec<Node>, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            return Ok(self.get_nodes_with(conn).await?);
        }
        return Err(CusError::App(String::from("Connection Not Found")));
    }

    // get cluster server nodes
    pub async fn get_nodes_with(&self, conn: &mut CusConnection) -> Result<Vec<Node>, CusError> {
        if !conn.is_cluster {
            return Err(CusError::App(String::from("Not a Cluster Server")));
        }
        if conn.nodes.len() == 0 {
            let values = self
                .execute_with(redis::cmd("CLUSTER").arg("nodes"), conn)
                .await?;
            let csv = String::from_redis_value(&values)?;
            let items: Vec<&str> = csv.split("\n").collect();
            let mut nodes: Vec<Node> = vec![];
            for ss in items {
                if ss.trim() != "" {
                    let mut node = Node::build(ss.to_string());
                    if let Some(model) = conn.connection_model.clone() {
                        node.password = model.password
                    }
                    nodes.push(node)
                }
            }
            conn.nodes = nodes;
        }
        Ok(conn.nodes.to_vec())
    }

    pub async fn execute_with(
        &self,
        cmd: &mut Cmd,
        conn: &mut CusConnection,
    ) -> Result<redis::Value, CusError> {
        let (c, cus_cmd) = conn.execute(cmd).await?;
        if let Some(tx) = self.debug_tx.lock().await.get_mut(0) {
            let _ = tx.send(cus_cmd).await;
        }
        return Ok(c);
    }

    pub async fn execute(
        &self,
        cid: u32,
        db: u8,
        cmd: &mut redis::Cmd,
    ) -> Result<redis::Value, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            if !conn.is_cluster && conn.db != db {
                let _ = self
                    .execute_with(redis::cmd("select").arg(db), conn)
                    .await?;
                conn.db = db
            }
            let v = self.execute_with(cmd, conn).await?;
            return Ok(v);
        }
        return Err(CusError::App(String::from("Connection Not Found")));
    }

    pub async fn get_conns(&self) -> Vec<response::Conn> {
        let mut vec = vec![];
        for (_, v) in self.map.lock().await.iter() {
            vec.push(response::Conn {
                id: v.id.clone(),
                host: v.host.clone(),
                created_at: v.created_at.format("%Y-%m-%d %H:%M:%S").to_string(),
                types: "normal".to_string(),
            })
        }
        vec
    }

    pub async fn remove(&self, cid: u32) {
        self.map.lock().await.remove(&cid);
    }

    pub async fn set_tx(&self, tx: Sender<CusCmd>) {
        self.debug_tx.lock().await.insert(0, tx);
    }

    pub async fn remove_tx(&self) {
        self.debug_tx.lock().await.remove(0);
    }
}

/**
 * see https://redis.io/commands/slowlog-get/
 */
#[derive(Serialize, Clone, Debug, Default)]
pub struct SlowLog {
    pub uid: String,
    pub id: i64,
    pub processed_at: i64,
    pub time: i64,
    pub cmd: String,
    pub client_ip: String,
    pub client_name: String,
}

impl SlowLog {
    pub fn build(s: &Vec<Value>) -> Self {
        let mut log = Self::default();
        if let Some(v) = s.get(0) {
            log.id = i64::from_redis_value(v).unwrap();
        }
        if let Some(v) = s.get(1) {
            log.processed_at = i64::from_redis_value(v).unwrap();
        }
        if let Some(v) = s.get(2) {
            log.time = i64::from_redis_value(v).unwrap();
        }
        if let Some(v) = s.get(3) {
            let cmd: Vec<String> = Vec::from_redis_value(v).unwrap_or(vec![]);
            log.cmd = cmd.join(" ")
        }
        if let Some(v) = s.get(4) {
            log.client_ip = String::from_redis_value(&v).unwrap();
        }
        if let Some(v) = s.get(5) {
            log.client_name = String::from_redis_value(&v).unwrap();
        }
        log.uid = random_str(32);
        log
    }
}

#[derive(Debug, Serialize)]
pub struct ScanResult {
    pub cursor: String,
    pub keys: Vec<String>,
}

impl ScanResult {
    pub fn build(value: &Value) -> Self {
        let mut cursor = String::from("0");
        let mut keys: Vec<String> = vec![];
        match value {
            Value::Bulk(s) => {
                if let Some(first) = s.get(0) {
                    cursor = String::from_redis_value(first).unwrap();
                }
                if let Some(second) = s.get(1) {
                    keys = Vec::from_redis_value(&second).unwrap();
                }
            }
            _ => {}
        };
        Self { cursor, keys }
    }
}
