use crate::{err::CusError, sqlite};

use ::redis as rds;
use rusqlite::{self, params};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ConnectionForm {
    pub id: Option<u32>,
    pub host: String,
    pub port: u16,
    pub password: Option<String>,
    pub is_cluster: bool,
    pub readonly: bool,
}

impl rds::IntoConnectionInfo for ConnectionForm {
    fn into_connection_info(self) -> rds::RedisResult<::redis::ConnectionInfo> {
        Ok(::redis::ConnectionInfo {
            addr: rds::ConnectionAddr::Tcp(self.host.clone(), self.port),
            redis: rds::RedisConnectionInfo {
                db: 0,
                username: None,
                password: self.password,
            },
        })
    }
}
