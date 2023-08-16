use crate::{err::CusError, sqlite};

use rusqlite::{self, params};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Connection {
    pub id: u16,
    pub host: String,
    pub port: i32,
    pub password: String,
    pub is_cluster: bool,
    pub nodes: Vec<String>,
    pub dbs: Vec<u8>,
}

impl Connection {
    pub fn get_host(&self) -> String {
        return format!("redis://{}:{}", &self.host, &self.port);
    }

    pub fn first(id: u32) -> Result<Connection, CusError> {
        let conn = sqlite::get_sqlite_client()?;
        let stmt_result = conn
            .prepare("select id, host, port, password, is_cluster from connections where id= ?1");
        match stmt_result {
            Ok(mut stmt) => {
                return match stmt.query_row([id], |r| {
                    let mut is_cluster = false;
                    let i: i64 = r.get(4).unwrap();
                    if i > 0 {
                        is_cluster = true
                    }
                    Ok(Connection {
                        id: r.get(0).unwrap(),
                        host: r.get(1).unwrap(),
                        port: r.get(2).unwrap(),
                        password: r.get(3).unwrap(),
                        is_cluster: is_cluster,
                        nodes: vec![],
                        dbs: vec![],
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
        let conn = sqlite::get_sqlite_client()?;
        if self.id > 0 {
            let mut is_cluster = 0;
            if self.is_cluster {
                is_cluster = 1;
            }
            let r = conn.execute(
                "UPDATE connections set host= ?1,port= ?2, password= ?3, is_cluster= ?4 where id = ?5",
                params!(self.host, self.port, self.password,  is_cluster, self.id),
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
        let conn = sqlite::get_sqlite_client()?;
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
            conn.prepare("select id, host, port, password, is_cluster from connections");
        match stmt_result {
            Ok(mut stmt) => {
                let connections_result = stmt.query_map([], |row| {
                    let mut is_cluster = false;
                    let i: i64 = row.get(4).unwrap();
                    if i > 0 {
                        is_cluster = true
                    }
                    Ok(Connection {
                        id: row.get(0).unwrap(),
                        host: row.get(1).unwrap(),
                        port: row.get(2).unwrap(),
                        password: row.get(3).unwrap(),
                        is_cluster: is_cluster,
                        nodes: vec![],
                        dbs: vec![],
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
