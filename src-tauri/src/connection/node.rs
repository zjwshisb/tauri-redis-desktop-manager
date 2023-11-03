use crate::connection::{Connectable, ConnectionParams};

use serde::ser::{Serialize as CusSerialize, SerializeStruct, Serializer};

#[derive(Clone, Debug)]
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
    pub params: ConnectionParams,
}

impl Connectable for Node {
    fn get_params(&self) -> ConnectionParams {
        self.params.clone()
    }
}

impl CusSerialize for Node {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut node = serializer.serialize_struct("node", 10)?;
        node.serialize_field("id", &self.id)?;
        node.serialize_field("host", &self.host)?;
        node.serialize_field("port", &self.port)?;
        node.serialize_field("flags", &self.flags)?;
        node.serialize_field("master", &self.master)?;
        node.serialize_field("ping_sent", &self.ping_sent)?;
        node.serialize_field("pong_recv", &self.pong_recv)?;
        node.serialize_field("config_epoch", &self.config_epoch)?;
        node.serialize_field("link_state", &self.link_state)?;
        node.serialize_field("slot", &self.slot)?;
        node.end()
    }
}

impl Node {
    pub fn build(s: String, params: ConnectionParams) -> Self {
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
                port = port_str.parse().unwrap()
            }
        }
        let mut p: ConnectionParams = params.clone();
        p.is_cluster = false;
        p.redis_params.tcp_host = host.clone();
        p.redis_params.tcp_port = port;
        if let Some(mut ssh) = p.ssh_params {
            ssh.target_host = host.clone();
            ssh.target_port = port;
            p.ssh_params = Some(ssh)
        }
        let node = Self {
            id: get_fn(&mut v, 0),
            host: host.clone(),
            port,
            flags: get_fn(&mut v, 0),
            master: get_fn(&mut v, 0),
            ping_sent: get_fn(&mut v, 0).parse::<i64>().unwrap_or_default(),
            pong_recv: get_fn(&mut v, 0).parse::<i64>().unwrap_or_default(),
            config_epoch: get_fn(&mut v, 0),
            link_state: get_fn(&mut v, 0),
            slot: get_fn(&mut v, 0),
            params: p,
        };
        node
    }
}
