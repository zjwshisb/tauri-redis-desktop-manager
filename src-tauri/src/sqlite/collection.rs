use rusqlite::{self, params, Row};
use serde::{Deserialize, Serialize};

use crate::{err::CusError, sqlite};
use chrono::prelude::*;
#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct Collection {
    pub id: Option<i64>,
    pub connection_id: u32,
    pub db: Option<u8>,
    pub name: String,
    pub types: String,
    pub key: String,
    pub created_at: Option<String>,
}

impl Collection {
    pub fn build(r: &Row) -> Collection {
        Collection {
            id: r.get(0).unwrap(),
            connection_id: r.get(1).unwrap(),
            db: r.get(2).unwrap(),
            name: r.get(3).unwrap(),
            types: r.get(4).unwrap(),
            key: r.get(5).unwrap(),
            created_at: r.get(6).unwrap(),
        }
    }

    pub fn first(id: u32) -> Result<Collection, CusError> {
        let conn = sqlite::get_client()?;
        let mut stmt = conn.prepare(
            "select 
            id, 
            connection_id,
            db, 
            name, 
            types,
            key,
            created_at 
            from collections where id= ?1",
        )?;
        let c = stmt.query_row([id], |r| Ok(Self::build(r)))?;
        Ok(c)
    }

    pub fn save(&mut self) -> Result<(), CusError> {
        let conn = sqlite::get_client()?;
        let time = Local::now().format("%Y-%m-%d %H:%M:%S").to_string();
        conn.execute(
            "insert into collections(
                connection_id,
                db, 
                name, 
                types,
                key,
                created_at
                ) values(?1, ?2, ?3, ?4, ?5, ?6)",
            params!(
                self.connection_id,
                self.db,
                &self.name,
                &self.types,
                &self.key,
                &time
            ),
        )?;
        self.id = Some(conn.last_insert_rowid());
        self.created_at = Some(time);
        Ok(())
    }

    pub fn del(self) -> Result<(), CusError> {
        let conn = sqlite::get_client()?;
        conn.execute("delete from collections where id = ?1", [self.id])?;
        Ok(())
    }

    pub fn all() -> Result<Vec<Collection>, CusError> {
        let conn = sqlite::get_client()?;
        let mut stmt_result = conn.prepare(
            "select
            id, 
            connection_id,
            db, 
            name, 
            types,
            key,
            created_at 
                from collections order by created_at desc",
        )?;
        let connections_result = stmt_result.query_map([], |row| Ok(Self::build(row)))?;
        let mut result: Vec<Collection> = vec![];
        for x in connections_result.into_iter() {
            result.push(x?);
        }
        Ok(result)
    }
}
