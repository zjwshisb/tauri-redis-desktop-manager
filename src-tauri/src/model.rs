use crate::utils::random_str;

use crate::connection::CValue;
use redis::{FromRedisValue, Value as RedisValue};
use serde::Serialize;
use std::fmt::Debug;

#[derive(Serialize)]
pub struct Command {
    pub id: String,
    pub cmd: String,
    pub response: CValue,
    pub host: String,
    pub created_at: String,
    pub duration: i64,
}

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
    pub fn build(s: &Vec<RedisValue>) -> Self {
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
