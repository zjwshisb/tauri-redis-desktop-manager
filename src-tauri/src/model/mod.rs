use crate::{err::CusError, sqlite};
use chrono::prelude::*;
use rusqlite::{self, params};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Connection {
    pub id: u16,
    pub host: String,
    pub port: i32,
    pub password: String,
}

impl Connection {
    pub fn first(id: u32) -> Result<Connection, CusError> {
        let conn = sqlite::get_sqlite_client()?;
        let stmt_result =
            conn.prepare("select id, host, port, password from connections where id= ?1");
        match stmt_result {
            Ok(mut stmt) => {
                return match stmt.query_row([id], |r| {
                    Ok(Connection {
                        id: r.get(0).unwrap(),
                        host: r.get(1).unwrap(),
                        port: r.get(2).unwrap(),
                        password: r.get(3).unwrap(),
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
            let r = conn.execute(
                "UPDATE connections set host= ?1,port= ?2, password= ?3 where id = ?4",
                params!(self.host, self.port, self.password, self.id),
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
        let stmt_result = conn.prepare("select id, host, port, password from connections");
        match stmt_result {
            Ok(mut stmt) => {
                let connections_result = stmt.query_map([], |row| {
                    Ok(Connection {
                        id: row.get(0).unwrap(),
                        host: row.get(1).unwrap(),
                        port: row.get(2).unwrap(),
                        password: row.get(3).unwrap(),
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

#[derive(Serialize, Debug)]
pub struct Field {
    pub name: String,
    pub value: String,
}

#[derive(Serialize, Debug)]
pub struct EventResp<T> {
    pub data: T,
    pub success: bool,
    pub event: String,
    pub time: String,
    pub id: u32,
}

impl<T> EventResp<T>
where
    T: serde::Serialize,
{
    pub fn new(data: T, event: String) -> EventResp<T> {
        let id = rand::random::<u32>();
        let utc: DateTime<Utc> = Utc::now();
        return EventResp {
            data,
            success: true,
            event,
            time: utc.format("%H:%M:%S").to_string(),
            id,
        };
    }
}
