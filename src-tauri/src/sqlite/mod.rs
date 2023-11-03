use crate::err::CusError;
use dirs_next;
use rusqlite::{self, Connection as SqliteConnection};
use std::fs;
const DATA_DIR: &str = "redis";
const DATA_NAME: &str = "data3.db";

mod connection;

pub use connection::Connection;

pub fn get_client() -> Result<SqliteConnection, CusError> {
    let path = get_data_path();
    let conn = SqliteConnection::open(path)?;
    Ok(conn)
}

pub fn init() {
    let client = get_client().unwrap();
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
    client
        .execute(
            "CREATE TABLE IF NOT EXISTS Collections (
        id    INTEGER PRIMARY KEY,
        connection_id INTEGER NOT NULL,
        name  TEXT NOT NULL,
        db  INTEGER NOT NULL DEFAULT 0,
        type TEXT NOT NULL,
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
