use crate::err::CusError;
use dirs_next;
use rusqlite::{self, params, Connection as conn, Row};
use serde::Serialize;
use std::fs;

const DATA_NAME: &str = "data1.db";
const DATA_DIR: &str = "redis";

pub fn get_sqlite_client() -> Result<conn, CusError> {
    let path = get_data_path();
    let conn = conn::open(path)?;
    Ok(conn)
}

pub fn init_sqlite() {
    let client = get_sqlite_client().unwrap();
    client
        .execute(
            "CREATE TABLE IF NOT EXISTS connections (
            id    INTEGER PRIMARY KEY,
            host  TEXT NOT NULL,
            port  INTEGER NOT NULL,
            username TEXT,
            password  TEXT,
            is_cluster INTEGER NOT NULL DEFAULT 0,
            readonly INTEGER NOT NULL DEFAULT 0
        )",
            (), // empty list of parameters.
        )
        .unwrap();
}

fn get_data_path() -> String {
    if let Some(data_dir) = dirs_next::data_dir() {
        let mut full_dir: String = String::from(data_dir.to_str().unwrap());
        full_dir.push_str("/");
        full_dir.push_str(DATA_DIR);
        let full_dir_meta = fs::metadata(&full_dir);
        match full_dir_meta {
            Err(_) => {
                fs::create_dir(&full_dir).unwrap();
            }
            _ => {}
        }
        full_dir.push_str("/");
        full_dir.push_str(DATA_NAME);
        return full_dir;
    } else {
        panic!("sqlite error: data dir not exists")
    }
}

#[derive(Debug, Serialize, Clone)]
pub struct Connection {
    pub id: i64,
    pub host: String,
    pub port: u16,
    pub password: Option<String>,
    pub username: Option<String>,
    pub is_cluster: bool,
    pub readonly: bool,
}

impl redis::IntoConnectionInfo for Connection {
    fn into_connection_info(self) -> redis::RedisResult<::redis::ConnectionInfo> {
        Ok(redis::ConnectionInfo {
            addr: redis::ConnectionAddr::Tcp(self.host.clone(), self.port),
            redis: redis::RedisConnectionInfo {
                db: 0,
                username: self.username,
                password: self.password,
            },
        })
    }
}

impl Connection {
    pub fn get_host(&self) -> String {
        return format!("redis://{}:{}", &self.host, &self.port);
    }

    pub fn build(r: &Row) -> Connection {
        let mut is_cluster = false;
        let i: i64 = r.get(5).unwrap_or_default();
        if i > 0 {
            is_cluster = true
        }
        let mut readonly = false;
        let i: i64 = r.get(6).unwrap_or_default();
        if i > 0 {
            readonly = true
        }
        Connection {
            id: r.get(0).unwrap(),
            host: r.get(1).unwrap(),
            port: r.get(2).unwrap(),
            password: r.get(3).unwrap_or_default(),
            username: r.get(4).unwrap_or_default(),
            is_cluster,
            readonly: readonly,
        }
    }

    pub fn first(id: u32) -> Result<Connection, CusError> {
        let conn = get_sqlite_client()?;
        let mut stmt = conn.prepare(
            "select id, host, port, password, username, is_cluster, readonly from connections where id= ?1",
        )?;
        let c = stmt.query_row([id], |r| Ok(Self::build(r)))?;
        Ok(c)
    }

    pub fn save(&mut self) -> Result<(), CusError> {
        let conn = get_sqlite_client()?;
        let mut is_cluster = 0;
        if self.is_cluster {
            is_cluster = 1;
        }
        let mut readonly = 0;
        if self.readonly {
            readonly = 1;
        }
        if self.id > 0 {
            conn.execute(
                "UPDATE connections set host= ?1,port= ?2, password= ?3,username= ?4, is_cluster= ?5, readonly =?6 where id = ?7",
                params!(self.host, self.port, self.password, self.username, is_cluster, readonly, self.id),
            )?;
        } else {
            conn.execute(
                "insert into connections (host, port, password, username, is_cluster, readonly) values(?1, ?2, ?3, ?4, ?5, ?6)",
                params!(&self.host, &self.port, &self.password, &self.username, is_cluster, readonly),
            )?;
            self.id = conn.last_insert_rowid();
        }
        Ok(())
    }

    pub fn del(self) -> Result<(), CusError> {
        let conn = get_sqlite_client()?;
        conn.execute("delete from connections where id = ?1", [self.id])?;
        Ok(())
    }

    pub fn all() -> Result<Vec<Connection>, CusError> {
        let conn = crate::sqlite::get_sqlite_client()?;
        let mut stmt_result = conn.prepare(
            "select id, host, port, password, username, is_cluster, readonly from connections",
        )?;
        let connections_result = stmt_result.query_map([], |row| Ok(Self::build(row)))?;
        let mut result: Vec<Connection> = vec![];
        for x in connections_result.into_iter() {
            result.push(x.unwrap());
        }
        Ok(result)
    }
}
