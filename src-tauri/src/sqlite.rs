use crate::{conn, err::CusError, ssh};
use dirs_next;
use rusqlite::{self, params, Connection as SqliteConnection, Row};
use serde::{Deserialize, Serialize};
use std::fs;
const DATA_DIR: &str = "redis";
const DATA_NAME: &str = "data3.db";

pub fn get_sqlite_client() -> Result<SqliteConnection, CusError> {
    let path = get_data_path();
    let conn = SqliteConnection::open(path)?;
    Ok(conn)
}

pub fn init_sqlite() {
    let client = get_sqlite_client().unwrap();
    client
        .execute(
            "CREATE TABLE IF NOT EXISTS connections (
            id    INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
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
    pub name: Option<String>,
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

impl conn::Connectable for Connection {
    fn get_params(&self) -> conn::RedisConnectionParams {
        let redis_params = conn::RedisParam {
            tcp_host: self.host.clone(),
            tcp_port: self.port,
            username: self.username.clone(),
            password: self.password.clone(),
            is_cluster: self.is_cluster,
        };
        let mut ssh_params = None;
        if let Some(ssh_host) = &self.ssh_host {
            let mut port = 22;
            if let Some(p) = self.ssh_port {
                port = p
            }
            let mut username = String::from("root");
            if let Some(u) = &self.username {
                username = u.clone();
            }
            let ssh_p = ssh::SshParams {
                host: ssh_host.clone(),
                port: port,
                username: username,
                password: self.ssh_password.clone(),
                private_key: self.ssh_private_key.clone(),
                passphrase: self.ssh_passphrase.clone(),
                target_host: self.host.clone(),
                target_port: self.port,
            };
            ssh_params = Some(ssh_p);
        }
        conn::RedisConnectionParams {
            redis_params,
            ssh_params,
            model_name: String::from("connection"),
            is_cluster: self.is_cluster,
        }
    }
}

impl Connection {
    pub fn build(r: &Row) -> Connection {
        let mut is_cluster = false;
        let i: i64 = r.get(6).unwrap_or_default();
        if i > 0 {
            is_cluster = true
        }
        let mut readonly = false;
        let i: i64 = r.get(7).unwrap_or_default();
        if i > 0 {
            readonly = true
        }
        let host: String = r.get(2).unwrap();
        let port = r.get(3).unwrap();
        Connection {
            id: r.get(0).unwrap(),
            name: r.get(1).unwrap(),
            host: host.clone(),
            port,
            password: r.get(4).unwrap_or_default(),
            username: r.get(5).unwrap_or_default(),
            is_cluster,
            readonly,
            ssh_host: r.get(8).unwrap_or_default(),
            ssh_port: r.get(9).unwrap_or_default(),
            ssh_password: r.get(10).unwrap_or_default(),
            ssh_username: r.get(11).unwrap_or_default(),
            ssh_private_key: r.get(12).unwrap_or_default(),
            ssh_timeout: r.get(13).unwrap_or_default(),
            ssh_passphrase: r.get(14).unwrap_or_default(),
        }
    }

    pub fn first(id: u32) -> Result<Connection, CusError> {
        let conn = get_sqlite_client()?;
        let mut stmt = conn.prepare(
            "select id, 
            name,
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
        if let None = self.name {
            self.name = Some(format!("{}:{}", self.host, self.port))
        }
        if let Some(id) = self.id {
            conn.execute(
                "UPDATE connections set 
                name= ?1,
                host= ?2,
                port= ?3,
                password= ?4,
                username= ?5,
                is_cluster= ?6,
                readonly =?7,
                ssh_host =?8,
                ssh_port =?9,
                ssh_password =?10,
                ssh_username =?11,
                ssh_private_key =?12,
                ssh_timeout =?13,
                ssh_passphrase =?14 
                where id = ?15",
                params!(
                    self.name,
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
                    name,
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
                    ) values(?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)",
                params!(
                    &self.name,
                    &self.host,
                    &self.port,
                    &self.password,
                    &self.username,
                    is_cluster,
                    readonly,
                    self.ssh_host,
                    self.ssh_port,
                    self.ssh_password,
                    self.ssh_username,
                    self.ssh_private_key,
                    self.ssh_timeout,
                    self.ssh_passphrase,
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
                name,
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
