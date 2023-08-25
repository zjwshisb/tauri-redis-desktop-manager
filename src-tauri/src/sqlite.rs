use crate::err::CusError;
use dirs_next;
use rusqlite::{self, params, Connection as conn};
use serde::Serialize;
use std::fs;

const DATA_NAME: &str = "data1.db";
const DATA_DIR: &str = "redis";

pub fn get_sqlite_client() -> Result<conn, CusError> {
    let path = get_data_path();
    let conn_result = conn::open(path);
    match conn_result {
        Ok(conn) => {
            return Ok(conn);
        }
        Err(e) => {
            return Err(CusError::App(e.to_string()));
        }
    }
}

pub fn init_sqlite() {
    let client = get_sqlite_client().unwrap();
    client
        .execute(
            "CREATE TABLE IF NOT EXISTS connections (
            id    INTEGER PRIMARY KEY,
            host  TEXT NOT NULL,
            port  INTEGER NOT NULL,
            password  TEXT,
            is_cluster INTEGER NOT NULL DEFAULT 0,
            readonly INTEGER NOT NULL DEFAULT 0
        )",
            (), // empty list of parameters.
        )
        .unwrap();
    client
        .execute(
            "CREATE TABLE IF NOT EXISTS logs (
        id    INTEGER PRIMARY KEY,
        cmd  TEXT NOT NULL,
        response  TEXT NOT NULL,
        host  TEXT NOT NULL,
        created_at TEXT NOT NULL
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
    pub id: u16,
    pub host: String,
    pub port: u16,
    pub password: Option<String>,
    pub is_cluster: bool,
    pub readonly: bool,
}

impl redis::IntoConnectionInfo for Connection {
    fn into_connection_info(self) -> redis::RedisResult<::redis::ConnectionInfo> {
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

impl Connection {
    pub fn get_host(&self) -> String {
        return format!("redis://{}:{}", &self.host, &self.port);
    }

    pub fn first(id: u32) -> Result<Connection, CusError> {
        let conn = get_sqlite_client()?;
        let stmt_result = conn.prepare(
            "select id, host, port, password, is_cluster, readonly from connections where id= ?1",
        );
        match stmt_result {
            Ok(mut stmt) => {
                return match stmt.query_row([id], |r| {
                    let mut is_cluster = false;
                    let i: i64 = r.get(4).unwrap_or_default();
                    if i > 0 {
                        is_cluster = true
                    }
                    let mut readonly = false;
                    let i: i64 = r.get(5).unwrap_or_default();
                    if i > 0 {
                        readonly = true
                    }
                    let password_str: String = r.get(3).unwrap_or(String::from(""));
                    let mut password: Option<String> = None;
                    if password_str != "".to_string() {
                        password = Some(password_str.to_string());
                    }
                    Ok(Connection {
                        id: r.get(0).unwrap(),
                        host: r.get(1).unwrap(),
                        port: r.get(2).unwrap(),
                        password: password,
                        is_cluster,
                        readonly: readonly,
                    })
                }) {
                    Ok(c) => {
                        return Ok(c);
                    }
                    Err(_) => Err(CusError::App("Connection Not Found".to_string())),
                }
            }
            Err(e) => {
                return Err(CusError::App(e.to_string()));
            }
        }
    }
    pub fn save(self) -> Result<Connection, CusError> {
        let conn = get_sqlite_client()?;
        if self.id > 0 {
            let mut is_cluster = 0;
            if self.is_cluster {
                is_cluster = 1;
            }
            let mut readonly = 0;
            if self.readonly {
                readonly = 1;
            }
            let r = conn.execute(
                "UPDATE connections set host= ?1,port= ?2, password= ?3, is_cluster= ?4, readonly =?5 where id = ?6",
                params!(self.host, self.port, self.password,  is_cluster, readonly, self.id),
            );
            match r {
                Err(e) => {
                    return Err(CusError::App(e.to_string()));
                }
                _ => {
                    return Ok(self);
                }
            }
        } else {
            let r = conn.execute(
                "insert into connections (host, port, password) values(?1, ?2, ?3)",
                (&self.host, &self.port, &self.password),
            );
            match r {
                Err(e) => {
                    return Err(CusError::App(e.to_string()));
                }
                _ => {
                    return Ok(self);
                }
            }
        }
    }
    pub fn del(self) -> Result<(), CusError> {
        let conn = get_sqlite_client()?;
        let r = conn.execute("delete from connections where id = ?1", [self.id]);
        match r {
            Err(e) => {
                return Err(CusError::App(e.to_string()));
            }
            _ => {
                return Ok(());
            }
        }
    }

    pub fn all() -> Result<Vec<Connection>, CusError> {
        let conn = crate::sqlite::get_sqlite_client()?;
        let stmt_result =
            conn.prepare("select id, host, port, password, is_cluster, readonly from connections");
        match stmt_result {
            Ok(mut stmt) => {
                let connections_result = stmt.query_map([], |row| {
                    let mut is_cluster = false;
                    let i: i64 = row.get(4).unwrap();
                    if i > 0 {
                        is_cluster = true
                    }
                    let mut readonly = false;
                    let i: i64 = row.get(5).unwrap();
                    if i > 0 {
                        readonly = true
                    }
                    Ok(Connection {
                        id: row.get(0).unwrap(),
                        host: row.get(1).unwrap(),
                        port: row.get(2).unwrap(),
                        password: row.get(3).unwrap(),
                        is_cluster,
                        readonly,
                    })
                });
                match connections_result {
                    Ok(connections_iter) => {
                        let mut result: Vec<Connection> = vec![];
                        for x in connections_iter {
                            result.push(x.unwrap());
                        }
                        Ok(result)
                    }
                    Err(e) => {
                        return Err(CusError::App(e.to_string()));
                    }
                }
            }
            Err(e) => {
                return Err(CusError::App(e.to_string()));
            }
        }
    }
}
