use crate::{
    connection::{Connectable, ConnectionWrapper, Node},
    err::CusError,
    model::Command,
    response::{self, Field},
};
use redis::cluster::ClusterConnection as RedisSyncClusterConnection;
use redis::{Cmd, Connection as RedisSyncConnection};
use redis::{FromRedisValue, Value};
use std::collections::HashMap;
use tokio::sync::{mpsc::Sender, Mutex};

/**
 * connection manager state
 */
pub struct Manager {
    pub map: Mutex<HashMap<u32, ConnectionWrapper>>,
    debug_tx: Mutex<Vec<Sender<Command>>>,
}

impl Manager {
    pub fn new() -> Manager {
        Manager {
            map: Mutex::new(HashMap::new()),
            debug_tx: Mutex::new(vec![]),
        }
    }
    pub async fn add(&self, id: u32, conn: ConnectionWrapper) {
        self.map.lock().await.insert(id, conn);
        if let Some(conn) = self.map.lock().await.get_mut(&id) {
            let _ = self.set_name(conn, "tauri-redis".to_string()).await;
        }
    }
    pub async fn set_name(
        &self,
        conn: &mut ConnectionWrapper,
        name: String,
    ) -> Result<(), CusError> {
        self.execute_with(redis::cmd("CLIENT").arg("SETNAME").arg(&name), conn)
            .await?;
        Ok(())
    }

    pub async fn get_config(&self, id: u32, pattern: &str) -> Result<Vec<Field>, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&id) {
            return self.get_config_with(pattern, conn).await;
        }
        return Err(CusError::reopen());
    }

    pub async fn get_config_with(
        &self,
        pattern: &str,
        conn: &mut ConnectionWrapper,
    ) -> Result<Vec<Field>, CusError> {
        let value: Vec<Value> = self
            .execute_with(redis::cmd("config").arg("get").arg(pattern), conn)
            .await?;
        Ok(Field::build_vec(&value)?)
    }

    pub async fn get_version(&self, id: u32) -> Result<String, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&id) {
            return self.get_version_with(conn).await;
        }
        return Err(CusError::reopen());
    }

    // get redis server version
    pub async fn get_version_with(&self, conn: &mut ConnectionWrapper) -> Result<String, CusError> {
        let info = self.get_info_with(conn).await?;
        for x in info.keys() {
            if let Some(fields) = info.get(x) {
                if let Some(version) = fields.get("redis_version") {
                    return Ok(version.clone());
                }
            }
        }
        return Err(CusError::reopen());
    }

    pub async fn get_info(
        &self,
        id: u32,
    ) -> Result<HashMap<String, HashMap<String, String>>, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&id) {
            return self.get_info_with(conn).await;
        }
        return Err(CusError::reopen());
    }

    // get the server info
    // if the cluster server, response is vec
    // so for unify, normal server is change to vec, the value is set to vec
    pub async fn get_info_with(
        &self,
        conn: &mut ConnectionWrapper,
    ) -> Result<HashMap<String, HashMap<String, String>>, CusError> {
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
        let mut result: HashMap<String, HashMap<String, String>> = HashMap::new();
        match v {
            Value::Data(cc) => {
                if let Ok(r) = String::from_utf8(cc) {
                    result.insert(conn.get_host(), format_fn(r));
                }
            }
            Value::Bulk(vv) => {
                for vvv in vv {
                    match &vvv {
                        Value::Bulk(vvvv) => {
                            if let Some(h) = vvvv.get(0) {
                                let host = String::from_redis_value(h)?;

                                if let Some(s) = vvvv.get(1) {
                                    result.insert(host, format_fn(String::from_redis_value(s)?));
                                }
                            }
                        }
                        _ => {}
                    }
                }
            }
            _ => {}
        }
        Ok(result)
    }

    // get cluster server nodes
    pub async fn get_nodes(&self, id: u32) -> Result<Vec<Node>, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&id) {
            return Ok(self.get_nodes_with(conn).await?);
        }
        return Err(CusError::reopen());
    }

    // get cluster server nodes
    pub async fn get_nodes_with(
        &self,
        wrapper: &mut ConnectionWrapper,
    ) -> Result<Vec<Node>, CusError> {
        if !wrapper.model.get_is_cluster() {
            return Err(CusError::App(String::from("Not a Cluster Server")));
        }
        if wrapper.nodes.len() == 0 {
            let params = wrapper.model.get_params();
            let values = self
                .execute_with(redis::cmd("CLUSTER").arg("NODES"), wrapper)
                .await?;
            let csv = String::from_redis_value(&values)?;
            let items: Vec<&str> = csv.split("\n").collect();
            let mut nodes: Vec<Node> = vec![];
            for ss in items {
                if ss.trim() != "" {
                    let node = Node::build(ss.to_string(), params.clone());
                    nodes.push(node)
                }
            }
            wrapper.nodes = nodes;
        }
        Ok(wrapper.nodes.to_vec())
    }

    // execute redis cmd with connection
    pub async fn execute_with<T>(
        &self,
        cmd: &mut Cmd,
        conn: &mut ConnectionWrapper,
    ) -> Result<T, CusError>
    where
        T: FromRedisValue,
    {
        let result: Result<(T, Command), (CusError, Command)> = conn.execute(cmd).await;
        match result {
            Ok((value, cmd)) => {
                if let Some(tx) = self.debug_tx.lock().await.get_mut(0) {
                    let _ = tx.send(cmd).await;
                }
                return Ok(value);
            }
            Err((err, cmd)) => {
                if let Some(tx) = self.debug_tx.lock().await.get_mut(0) {
                    let _ = tx.send(cmd).await;
                }
                return Err(err);
            }
        }
    }
    // execute redis cmd with cid
    pub async fn execute<T>(
        &self,
        cid: u32,
        cmd: &mut redis::Cmd,
        db: Option<u8>,
    ) -> Result<T, CusError>
    where
        T: FromRedisValue,
    {
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            if !conn.model.get_is_cluster() {
                if let Some(database) = db {
                    if database != conn.db {
                        let _ = self
                            .execute_with(redis::cmd("select").arg(db), conn)
                            .await?;
                        conn.db = database
                    }
                }
            }
            let v = self.execute_with(cmd, conn).await?;
            return Ok(v);
        }
        return Err(CusError::reopen());
    }

    pub async fn get_is_cluster(&self, cid: u32) -> bool {
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            return conn.is_cluster();
        }
        return false;
    }

    pub async fn get_sync_conn(&self, cid: u32) -> Result<RedisSyncConnection, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            return Ok(conn.model.get_sync_one().await?);
        }
        return Err(CusError::build("not found"));
    }

    pub async fn get_sync_cluster_conn(
        &self,
        cid: u32,
    ) -> Result<RedisSyncClusterConnection, CusError> {
        if let Some(conn) = self.map.lock().await.get_mut(&cid) {
            return Ok(conn.model.get_sync_cluster_one().await?);
        }
        return Err(CusError::build("not found"));
    }

    // get connected connections info
    pub async fn get_conns(&self) -> Vec<response::Conn> {
        let mut vec = vec![];
        for (_, v) in self.map.lock().await.iter() {
            vec.push(response::Conn {
                id: v.id.clone(),
                host: v.model.get_host(),
                created_at: v.created_at.format("%Y-%m-%d %H:%M:%S").to_string(),
                types: "normal".to_string(),
                proxy: v.model.get_proxy(),
            })
        }
        vec
    }

    // remove  connected connection
    pub async fn remove(&self, id: u32) {
        self.map.lock().await.remove(&id);
    }

    // set debug tx
    pub async fn set_tx(&self, tx: Sender<Command>) {
        self.debug_tx.lock().await.insert(0, tx);
    }

    // remove debug tx
    pub async fn remove_tx(&self) {
        self.debug_tx.lock().await.remove(0);
    }
}
