use crate::utils::random_str;
use redis::{FromRedisValue, Value};
use serde::Serialize;

/**
 * see https://redis.io/commands/cluster-nodes/
 */
#[derive(Serialize, Clone)]
pub struct Node {
    pub id: String,
    pub host: String,
    pub flags: String,
    pub master: String,
    pub ping_sent: i64,
    pub pong_recv: i64,
    pub config_epoch: String,
    pub link_state: String,
    pub slot: String,
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
        let node = Self {
            id: get_fn(&mut v, 0),
            host: get_fn(&mut v, 0),
            flags: get_fn(&mut v, 0),
            master: get_fn(&mut v, 0),
            ping_sent: get_fn(&mut v, 0).parse::<i64>().unwrap_or_default(),
            pong_recv: get_fn(&mut v, 0).parse::<i64>().unwrap_or_default(),
            config_epoch: get_fn(&mut v, 0),
            link_state: get_fn(&mut v, 0),
            slot: get_fn(&mut v, 0),
        };
        node
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
