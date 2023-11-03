// use crate::{
//     err::CusError,
//     model::Command,
//     response::{self, Field},
//     ssh::{self, SshProxy},
//     utils,
// };
// use chrono::prelude::*;
// use redis::aio::{Connection, ConnectionLike};
// use redis::cluster::ClusterClient;
// use redis::cluster_async::ClusterConnection;
// use redis::Client;
// use redis::Cmd;
// use redis::{Arg, FromRedisValue, Value};
// use serde::ser::{Serialize as CusSerialize, SerializeStruct, Serializer};
// use ssh_jumper::model::SshForwarderEnd;
// use std::collections::HashMap;
// use std::net::SocketAddr;
// use std::time::Duration;
// use tokio::sync::oneshot::Receiver;
// use tokio::sync::{mpsc::Sender, Mutex};
// use tokio::time::timeout;

// #[derive(Clone, Debug)]
// pub struct Node {
//     pub id: String,
//     pub host: String,
//     pub port: u16,
//     pub flags: String,
//     pub master: String,
//     pub ping_sent: i64,
//     pub pong_recv: i64,
//     pub config_epoch: String,
//     pub link_state: String,
//     pub slot: String,
//     pub params: RedisConnectionParams,
// }

// impl Connectable for Node {
//     fn get_params(&self) -> RedisConnectionParams {
//         self.params.clone()
//     }
// }

// impl CusSerialize for Node {
//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//         S: Serializer,
//     {
//         let mut node = serializer.serialize_struct("node", 10)?;
//         node.serialize_field("id", &self.id)?;
//         node.serialize_field("host", &self.host)?;
//         node.serialize_field("port", &self.port)?;
//         node.serialize_field("flags", &self.flags)?;
//         node.serialize_field("master", &self.master)?;
//         node.serialize_field("ping_sent", &self.ping_sent)?;
//         node.serialize_field("pong_recv", &self.pong_recv)?;
//         node.serialize_field("config_epoch", &self.config_epoch)?;
//         node.serialize_field("link_state", &self.link_state)?;
//         node.serialize_field("slot", &self.slot)?;
//         node.end()
//     }
// }

// impl Node {
//     pub fn build(s: String, params: RedisConnectionParams) -> Self {
//         let mut v: Vec<&str> = s.split(" ").collect();
//         let get_fn = |v: &mut Vec<&str>, index: usize| -> String {
//             if v.len() > index {
//                 return String::from(v.remove(index));
//             }
//             "".to_string()
//         };
//         let mut host = get_fn(&mut v, 1);
//         let mut port = 0;
//         if let Some(u) = host.find("@") {
//             host = host[0..u].to_string();
//             if let Some(u) = host.find(":") {
//                 let port_str = host[u + 1..].to_string();
//                 host = host[0..u].to_string();
//                 port = port_str.parse().unwrap()
//             }
//         }
//         let mut p: RedisConnectionParams = params.clone();
//         p.is_cluster = false;
//         p.redis_params.tcp_host = host.clone();
//         p.redis_params.tcp_port = port;
//         if let Some(mut ssh) = p.ssh_params {
//             ssh.target_host = host.clone();
//             ssh.target_port = port;
//             p.ssh_params = Some(ssh)
//         }
//         let node = Self {
//             id: get_fn(&mut v, 0),
//             host: host.clone(),
//             port,
//             flags: get_fn(&mut v, 0),
//             master: get_fn(&mut v, 0),
//             ping_sent: get_fn(&mut v, 0).parse::<i64>().unwrap_or_default(),
//             pong_recv: get_fn(&mut v, 0).parse::<i64>().unwrap_or_default(),
//             config_epoch: get_fn(&mut v, 0),
//             link_state: get_fn(&mut v, 0),
//             slot: get_fn(&mut v, 0),
//             params: p,
//         };
//         node
//     }
// }

// #[derive(Clone, Debug)]
// pub struct RedisParam {
//     pub tcp_host: String,
//     pub tcp_port: u16,
//     pub username: Option<String>,
//     pub password: Option<String>,
//     pub is_cluster: bool,
// }

// impl redis::IntoConnectionInfo for RedisParam {
//     fn into_connection_info(self) -> redis::RedisResult<redis::ConnectionInfo> {
//         Ok(redis::ConnectionInfo {
//             addr: redis::ConnectionAddr::Tcp(self.tcp_host.clone(), self.tcp_port),
//             redis: redis::RedisConnectionInfo {
//                 db: 0,
//                 username: self.username,
//                 password: self.password,
//             },
//         })
//     }
// }

// #[derive(Clone, Debug)]
// pub struct RedisConnectionParams {
//     pub redis_params: RedisParam,
//     pub ssh_params: Option<ssh::SshParams>,
//     pub model_name: String,
//     pub is_cluster: bool,
// }

// pub trait Connectable {
//     fn get_params(&self) -> RedisConnectionParams;
// }

// pub struct RedisConnection {
//     pub params: RedisConnectionParams,
//     pub cancel_tunnel_rx: Option<Receiver<SshForwarderEnd>>,
//     pub tunnel_addr: Option<SocketAddr>,
// }

// impl SshProxy for RedisConnection {
//     fn get_ssh_config(&self) -> Option<ssh::SshParams> {
//         self.params.ssh_params.clone()
//     }
//     fn store_addr(&mut self, addr: SocketAddr, rx: Receiver<SshForwarderEnd>) {
//         self.cancel_tunnel_rx = Some(rx);
//         self.tunnel_addr = Some(addr);
//     }
//     fn close_tunnel(&mut self) {
//         if let Some(mut rx) = self.cancel_tunnel_rx.take() {
//             rx.close();
//         }
//     }
// }
// impl Connectable for RedisConnection {
//     fn get_params(&self) -> RedisConnectionParams {
//         self.params.clone()
//     }
// }
// impl Drop for RedisConnection {
//     fn drop(&mut self) {
//         self.close_tunnel();
//     }
// }
// impl RedisConnection {
//     pub fn new(params: RedisConnectionParams) -> Self {
//         Self {
//             params: params,
//             cancel_tunnel_rx: None,
//             tunnel_addr: None,
//         }
//     }
//     // get the ssl proxy
//     pub fn get_proxy(&self) -> Option<String> {
//         if let Some(addr) = self.tunnel_addr {
//             return Some(format!("{}:{}", addr.ip().to_string(), addr.port()));
//         }
//         return None;
//     }
//     // the server is cluster or not
//     pub fn get_is_cluster(&self) -> bool {
//         self.params.is_cluster
//     }
//     // get the connection host
//     pub fn get_host(&self) -> String {
//         format!(
//             "redis://{}:{}",
//             self.params.redis_params.tcp_host.clone(),
//             self.params.redis_params.tcp_port
//         )
//     }
//     // get the redis params
//     // if proxy set
//     // host/port will be replace
//     pub fn get_redis_params(&self) -> RedisParam {
//         let mut params = self.params.redis_params.clone();
//         if let Some(addr) = self.tunnel_addr {
//             params.tcp_host = addr.ip().to_string();
//             params.tcp_port = addr.port();
//         }
//         params
//     }

//     pub async fn get_normal(&mut self) -> Result<Connection, CusError> {
//         ssh::create_tunnel(self).await?;
//         let params = self.get_redis_params();
//         let client = Client::open(params)?;
//         let rx = timeout(Duration::from_secs(2), client.get_async_connection()).await;
//         match rx {
//             Ok(conn_result) => match conn_result {
//                 Ok(connection) => {
//                     return Ok(connection);
//                 }
//                 Err(e) => {
//                     return Err(CusError::App(e.to_string()));
//                 }
//             },
//             Err(_) => {
//                 return Err(CusError::App(String::from("Connection Timeout")));
//             }
//         }
//     }
//     pub async fn get_cluster(&mut self) -> Result<ClusterConnection, CusError> {
//         ssh::create_tunnel(self).await?;
//         let params = self.get_redis_params();
//         let client = ClusterClient::new(vec![params]).unwrap();
//         let rx = timeout(Duration::from_secs(2), client.get_async_connection()).await;
//         match rx {
//             Ok(conn_result) => match conn_result {
//                 Ok(connection) => {
//                     return Ok(connection);
//                 }
//                 Err(e) => {
//                     return Err(CusError::App(e.to_string()));
//                 }
//             },
//             Err(_) => {
//                 return Err(CusError::App(String::from("Connection Timeout")));
//             }
//         }
//     }
// }

// pub struct ConnectionWrapper {
//     pub conn: Box<dyn ConnectionLike + Send>,
//     pub id: String,
//     pub nodes: Vec<Node>,
//     pub db: u8,
//     pub created_at: chrono::DateTime<Local>,
//     pub model: RedisConnection,
// }

// impl ConnectionWrapper {
//     pub async fn build<T: Connectable>(model: T) -> Result<Self, CusError> {
//         let b: Box<dyn ConnectionLike + Send>;
//         let params: RedisConnectionParams = model.get_params();
//         let mut connection = RedisConnection::new(params);
//         let cluster = connection.params.is_cluster;
//         if cluster {
//             b = Box::new(connection.get_cluster().await?)
//         } else {
//             b = Box::new(connection.get_normal().await?);
//         }
//         let r = Self {
//             id: utils::random_str(32),
//             nodes: vec![],
//             db: 0,
//             created_at: Local::now(),
//             model: connection,
//             conn: b,
//         };
//         Ok(r)
//     }

//     pub fn get_host(&self) -> String {
//         self.model.get_host()
//     }

//     pub fn is_cluster(&self) -> bool {
//         return self.model.get_is_cluster();
//     }

//     // execute the redis command
//     async fn execute<T>(
//         &mut self,
//         cmd: &mut redis::Cmd,
//     ) -> Result<(T, Command), (CusError, Command)>
//     where
//         T: FromRedisValue,
//     {
//         let mut cmd_vec: Vec<String> = vec![];
//         for arg in cmd.args_iter() {
//             match arg {
//                 Arg::Simple(v) => match String::from_utf8(v.to_vec()) {
//                     Ok(s) => {
//                         cmd_vec.push(s);
//                     }
//                     Err(_) => {
//                         cmd_vec.push(utils::binary_to_redis_str(&v.to_vec()));
//                     }
//                 },
//                 Arg::Cursor => {}
//             }
//         }
//         let start = Local::now();
//         let value_r = cmd.query_async(self).await;
//         let end = Local::now();
//         let mut rep: Vec<String> = vec![];
//         let mut cus_cmd = Command {
//             id: utils::random_str(32),
//             cmd: cmd_vec.join(" "),
//             response: String::new(),
//             created_at: Local::now().format("%Y-%m-%d %H:%M:%S").to_string(),
//             host: self.model.get_host(),
//             duration: end.timestamp_micros() - start.timestamp_micros(),
//         };
//         match value_r {
//             Ok(value) => {
//                 match &value {
//                     Value::Bulk(v) => {
//                         for vv in v {
//                             match vv {
//                                 Value::Data(vvv) => {
//                                     let s = String::from_utf8(vvv.to_vec()).unwrap();
//                                     rep.push(s);
//                                 }
//                                 Value::Bulk(vvv) => {
//                                     for vvvv in vvv {
//                                         match vvvv {
//                                             Value::Data(vvvvv) => {
//                                                 let s = String::from_utf8(vvvvv.to_vec()).unwrap();
//                                                 rep.push(s);
//                                             }
//                                             _ => {}
//                                         }
//                                     }
//                                 }
//                                 _ => {}
//                             }
//                         }
//                     }
//                     Value::Int(v) => rep.push(v.to_string()),
//                     Value::Nil => rep.push(String::from("nil")),
//                     Value::Data(v) => {
//                         // maybe value is bitmap
//                         let s = String::from_utf8(v.to_vec());
//                         match s {
//                             Ok(s) => rep.push(s),
//                             Err(_) => {
//                                 let i: Vec<u8> = Vec::from_redis_value(&value).unwrap();
//                                 let binary = i
//                                     .iter()
//                                     .map(|u| format!("{:b}", u))
//                                     .collect::<Vec<String>>()
//                                     .join("");

//                                 rep.push(binary)
//                             }
//                         }
//                     }
//                     Value::Status(v) => rep.push(v.to_string()),
//                     Value::Okay => {
//                         rep.push(String::from("OK"));
//                     }
//                 }
//                 cus_cmd.response = rep.join(" ");
//                 match T::from_redis_value(&value) {
//                     Ok(v) => Ok((v, cus_cmd)),
//                     Err(err) => Err((CusError::App(err.to_string()), cus_cmd)),
//                 }
//             }
//             Err(err) => {
//                 rep.push(err.to_string());
//                 cus_cmd.response = rep.join(" ");
//                 Err((CusError::App(err.to_string()), cus_cmd))
//             }
//         }
//     }
// }

// impl ConnectionLike for ConnectionWrapper {
//     fn req_packed_command<'a>(
//         &'a mut self,
//         cmd: &'a redis::Cmd,
//     ) -> redis::RedisFuture<'a, redis::Value> {
//         self.conn.req_packed_command(cmd)
//     }

//     fn req_packed_commands<'a>(
//         &'a mut self,
//         cmd: &'a redis::Pipeline,
//         offset: usize,
//         count: usize,
//     ) -> redis::RedisFuture<'a, Vec<redis::Value>> {
//         self.conn.req_packed_commands(cmd, offset, count)
//     }

//     fn get_db(&self) -> i64 {
//         self.conn.get_db()
//     }
// }

// /**
//  * connection manager state
//  */
// pub struct ConnectionManager {
//     pub map: Mutex<HashMap<u32, ConnectionWrapper>>,
//     debug_tx: Mutex<Vec<Sender<Command>>>,
// }

// impl ConnectionManager {
//     pub fn new() -> ConnectionManager {
//         ConnectionManager {
//             map: Mutex::new(HashMap::new()),
//             debug_tx: Mutex::new(vec![]),
//         }
//     }
//     pub async fn add(&self, id: u32, conn: ConnectionWrapper) {
//         self.map.lock().await.insert(id, conn);
//         if let Some(conn) = self.map.lock().await.get_mut(&id) {
//             let _ = self.set_name(conn, "tauri-redis".to_string()).await;
//         }
//     }
//     pub async fn set_name(
//         &self,
//         conn: &mut ConnectionWrapper,
//         name: String,
//     ) -> Result<(), CusError> {
//         self.execute_with(redis::cmd("CLIENT").arg("SETNAME").arg(&name), conn)
//             .await?;
//         Ok(())
//     }

//     pub async fn get_config(&self, id: u32, pattern: &str) -> Result<Vec<Field>, CusError> {
//         if let Some(conn) = self.map.lock().await.get_mut(&id) {
//             return self.get_config_with(pattern, conn).await;
//         }
//         return Err(CusError::reopen());
//     }

//     pub async fn get_config_with(
//         &self,
//         pattern: &str,
//         conn: &mut ConnectionWrapper,
//     ) -> Result<Vec<Field>, CusError> {
//         let value: Vec<Value> = self
//             .execute_with(redis::cmd("config").arg("get").arg(pattern), conn)
//             .await?;
//         Ok(Field::build_vec(&value)?)
//     }

//     pub async fn get_version(&self, id: u32) -> Result<String, CusError> {
//         if let Some(conn) = self.map.lock().await.get_mut(&id) {
//             return self.get_version_with(conn).await;
//         }
//         return Err(CusError::reopen());
//     }

//     // get redis server version
//     pub async fn get_version_with(&self, conn: &mut ConnectionWrapper) -> Result<String, CusError> {
//         let info = self.get_info_with(conn).await?;
//         for x in info.keys() {
//             if let Some(fields) = info.get(x) {
//                 if let Some(version) = fields.get("redis_version") {
//                     return Ok(version.clone());
//                 }
//             }
//         }
//         return Err(CusError::reopen());
//     }

//     pub async fn get_info(
//         &self,
//         id: u32,
//     ) -> Result<HashMap<String, HashMap<String, String>>, CusError> {
//         if let Some(conn) = self.map.lock().await.get_mut(&id) {
//             return self.get_info_with(conn).await;
//         }
//         return Err(CusError::reopen());
//     }

//     // get the server info
//     // if the cluster server, response is vec
//     // so for unify, normal server is change to vec, the value is set to vec
//     pub async fn get_info_with(
//         &self,
//         conn: &mut ConnectionWrapper,
//     ) -> Result<HashMap<String, HashMap<String, String>>, CusError> {
//         let v = self.execute_with(&mut redis::cmd("info"), conn).await?;
//         let format_fn = |str_value: String| {
//             let arr: Vec<&str> = str_value.split("\r\n").collect();
//             let mut kv: HashMap<String, String> = HashMap::new();
//             for v in arr {
//                 if v.contains(":") {
//                     let key_value: Vec<&str> = v.split(":").collect();
//                     if let Some(key) = key_value.get(0) {
//                         if let Some(value) = key_value.get(1) {
//                             kv.insert(key.to_string(), value.to_string());
//                         }
//                     }
//                 }
//             }
//             return kv;
//         };
//         let mut result: HashMap<String, HashMap<String, String>> = HashMap::new();
//         match v {
//             Value::Data(cc) => {
//                 if let Ok(r) = String::from_utf8(cc) {
//                     result.insert(conn.get_host(), format_fn(r));
//                 }
//             }
//             Value::Bulk(vv) => {
//                 for vvv in vv {
//                     match &vvv {
//                         Value::Bulk(vvvv) => {
//                             if let Some(h) = vvvv.get(0) {
//                                 let host = String::from_redis_value(h)?;

//                                 if let Some(s) = vvvv.get(1) {
//                                     result.insert(host, format_fn(String::from_redis_value(s)?));
//                                 }
//                             }
//                         }
//                         _ => {}
//                     }
//                 }
//             }
//             _ => {}
//         }
//         Ok(result)
//     }

//     // get cluster server nodes
//     pub async fn get_nodes(&self, id: u32) -> Result<Vec<Node>, CusError> {
//         if let Some(conn) = self.map.lock().await.get_mut(&id) {
//             return Ok(self.get_nodes_with(conn).await?);
//         }
//         return Err(CusError::reopen());
//     }

//     // get cluster server nodes
//     pub async fn get_nodes_with(
//         &self,
//         wrapper: &mut ConnectionWrapper,
//     ) -> Result<Vec<Node>, CusError> {
//         if !wrapper.model.get_is_cluster() {
//             return Err(CusError::App(String::from("Not a Cluster Server")));
//         }
//         if wrapper.nodes.len() == 0 {
//             let params = wrapper.model.get_params();
//             let values = self
//                 .execute_with(redis::cmd("CLUSTER").arg("nodes"), wrapper)
//                 .await?;
//             let csv = String::from_redis_value(&values)?;
//             let items: Vec<&str> = csv.split("\n").collect();
//             let mut nodes: Vec<Node> = vec![];
//             for ss in items {
//                 if ss.trim() != "" {
//                     let node = Node::build(ss.to_string(), params.clone());
//                     nodes.push(node)
//                 }
//             }
//             wrapper.nodes = nodes;
//         }
//         Ok(wrapper.nodes.to_vec())
//     }

//     // execute redis cmd with connection
//     pub async fn execute_with<T>(
//         &self,
//         cmd: &mut Cmd,
//         conn: &mut ConnectionWrapper,
//     ) -> Result<T, CusError>
//     where
//         T: FromRedisValue,
//     {
//         let result: Result<(T, Command), (CusError, Command)> = conn.execute(cmd).await;
//         match result {
//             Ok((value, cmd)) => {
//                 if let Some(tx) = self.debug_tx.lock().await.get_mut(0) {
//                     let _ = tx.send(cmd).await;
//                 }
//                 return Ok(value);
//             }
//             Err((err, cmd)) => {
//                 if let Some(tx) = self.debug_tx.lock().await.get_mut(0) {
//                     let _ = tx.send(cmd).await;
//                 }
//                 return Err(err);
//             }
//         }
//     }
//     // execute redis cmd with cid
//     pub async fn execute<T>(
//         &self,
//         cid: u32,
//         cmd: &mut redis::Cmd,
//         db: Option<u8>,
//     ) -> Result<T, CusError>
//     where
//         T: FromRedisValue,
//     {
//         if let Some(conn) = self.map.lock().await.get_mut(&cid) {
//             if !conn.model.get_is_cluster() {
//                 if let Some(database) = db {
//                     if database != conn.db {
//                         let _ = self
//                             .execute_with(redis::cmd("select").arg(db), conn)
//                             .await?;
//                         conn.db = database
//                     }
//                 }
//             }
//             let v = self.execute_with(cmd, conn).await?;
//             return Ok(v);
//         }
//         return Err(CusError::reopen());
//     }

//     // get connected connections info
//     pub async fn get_conns(&self) -> Vec<response::Conn> {
//         let mut vec = vec![];
//         for (_, v) in self.map.lock().await.iter() {
//             vec.push(response::Conn {
//                 id: v.id.clone(),
//                 host: v.model.get_host(),
//                 created_at: v.created_at.format("%Y-%m-%d %H:%M:%S").to_string(),
//                 types: "normal".to_string(),
//                 proxy: v.model.get_proxy(),
//             })
//         }
//         vec
//     }

//     // remove  connected connection
//     pub async fn remove(&self, id: u32) {
//         self.map.lock().await.remove(&id);
//     }

//     // set debug tx
//     pub async fn set_tx(&self, tx: Sender<Command>) {
//         self.debug_tx.lock().await.insert(0, tx);
//     }

//     // remove debug tx
//     pub async fn remove_tx(&self) {
//         self.debug_tx.lock().await.remove(0);
//     }
// }
