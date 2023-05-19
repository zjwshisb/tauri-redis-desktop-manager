use redis::{Client, Connection};

pub fn get_connection(id: usize) -> Connection {
    let client = Client::open("redis://47.115.162.231:6379").unwrap();
    let mut connection = client.get_connection().unwrap();
    redis::cmd("auth").arg("weisong123456").query::<redis::Value>(& mut connection).unwrap();
    return connection
}