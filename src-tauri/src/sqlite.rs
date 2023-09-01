use crate::err::CusError;
use dirs_next;
use rusqlite::{self, params, Connection as conn, Row};
use serde::{Deserialize, Serialize};
use std::fs;

const DATA_NAME: &str = "data2.db";
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
            readonly INTEGER NOT NULL DEFAULT 0,
            ssh_host  TEXT,
            ssh_port  INTEGER,
            ssh_password  TEXT,
            ssh_username  TEXT,
            ssh_private_key  TEXT,
            ssh_timeout  INTEGER,
            ssh_passphrase  TEXT
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

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct Connection {
    pub id: Option<i64>,
    pub host: String,
    pub port: u16,
    pub password: Option<String>,
    pub username: Option<String>,
    pub is_cluster: bool,
    pub readonly: bool,
    pub ssh_host: Option<String>,
    pub ssh_port: Option<u16>,
    pub ssh_password: Option<String>,
    pub ssh_username: Option<String>,
    pub ssh_private_key: Option<String>,
    pub ssh_timeout: Option<u32>,
    pub ssh_passphrase: Option<String>,
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
            ssh_host: r.get(7).unwrap_or_default(),
            ssh_port: r.get(8).unwrap_or_default(),
            ssh_password: r.get(9).unwrap_or_default(),
            ssh_username: r.get(10).unwrap_or_default(),
            ssh_private_key: r.get(11).unwrap_or_default(),
            ssh_timeout: r.get(12).unwrap_or_default(),
            ssh_passphrase: r.get(13).unwrap_or_default(),
        }
    }

    pub fn first(id: u32) -> Result<Connection, CusError> {
        let conn = get_sqlite_client()?;
        let mut stmt = conn.prepare(
            "select id, 
            host, 
            port, 
            password,
            username,
            is_cluster,
            readonly,
            ssh_host,
            ssh_port,
            ssh_password,
            ssh_username,
            ssh_private_key,
            ssh_timeout,
            ssh_passphrase
            from connections where id= ?1",
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
        if let Some(id) = self.id {
            conn.execute(
                "UPDATE connections set 
                host= ?1,
                port= ?2,
                password= ?3,
                username= ?4,
                is_cluster= ?5,
                readonly =?6,
                ssh_host =?7,
                ssh_port =?8,
                ssh_password =?9,
                ssh_username =?10,
                ssh_private_key =?11,
                ssh_timeout =?12,
                ssh_passphrase =?13 
                where id = ?14",
                params!(
                    self.host,
                    self.port,
                    self.password,
                    self.username,
                    is_cluster,
                    readonly,
                    self.ssh_host,
                    self.ssh_port,
                    self.ssh_password,
                    self.ssh_username,
                    self.ssh_private_key,
                    self.ssh_timeout,
                    self.ssh_passphrase,
                    id
                ),
            )?;
        } else {
            conn.execute(
                "insert into connections(
                    host,
                    port, 
                    password,
                    username,
                    is_cluster,
                    readonly,
                    ssh_host,
                    ssh_port,
                    ssh_password,
                    ssh_username,
                    ssh_private_key,
                    ssh_timeout,
                    ssh_passphrase
                    ) values(?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
                params!(
                    &self.host,
                    &self.port,
                    &self.password,
                    &self.username,
                    is_cluster,
                    readonly
                ),
            )?;
            self.id = Some(conn.last_insert_rowid());
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
            "select id,
             host, 
            port,
             password, 
            username,
                is_cluster,
                readonly , 
                 ssh_host,
                ssh_port,
                ssh_password,
                ssh_username,
                ssh_private_key,
                ssh_timeout,
                ssh_passphrase
                from connections",
        )?;
        let connections_result = stmt_result.query_map([], |row| Ok(Self::build(row)))?;
        let mut result: Vec<Connection> = vec![];
        for x in connections_result.into_iter() {
            result.push(x.unwrap());
        }
        Ok(result)
    }
}
