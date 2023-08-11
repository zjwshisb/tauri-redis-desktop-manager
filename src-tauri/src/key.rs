use crate::err::CusError;
use crate::ConnectionManager;
use redis::FromRedisValue;
use redis::{cmd, Value};
use serde::Serialize;

#[derive(Serialize, Debug)]
pub struct Key {
    name: String,
    types: String,
    ttl: i64,
    data: String,
    connection_id: u32,
    db: u8,
    memory: i64,
    length: i64,
}
impl Key {
    pub async fn build<'r>(
        name: String,
        db: u8,
        cid: u32,
        manager: &tauri::State<'r, ConnectionManager>,
    ) -> Result<Key, CusError> {
        let mut key: Key = Key {
            name: name,
            types: "".into(),
            ttl: -2,
            data: String::from(""),
            connection_id: cid,
            db,
            memory: 0,
            length: 0,
        };
        let types_value: Value = manager.execute(cid, db, cmd("type").arg(&key.name)).await?;
        key.types = String::from_redis_value(&types_value)?;
        if !key.is_none() {
            key.get_ttl(&manager).await?;
            key.get_memory(&manager).await?;
            key.get_length(&manager).await?;
        }
        Ok(key)
    }
    pub async fn get_memory<'r>(
        &mut self,
        manager: &tauri::State<'r, ConnectionManager>,
    ) -> Result<(), CusError> {
        let memory_value: Value = manager
            .execute(
                self.connection_id,
                self.db,
                cmd("memory")
                    .arg("usage")
                    .arg(&self.name)
                    .arg(&["SAMPLES", "0"]),
            )
            .await?;
        self.memory = i64::from_redis_value(&memory_value)?;
        Ok(())
    }
    pub async fn get_ttl<'r>(
        &mut self,
        manager: &tauri::State<'r, ConnectionManager>,
    ) -> Result<(), CusError> {
        let ttl_result: Value = manager
            .execute(self.connection_id, self.db, cmd("ttl").arg(&self.name))
            .await?;
        self.ttl = i64::from_redis_value(&ttl_result)?;
        Ok(())
    }
    pub async fn get_string_value<'r>(
        &mut self,
        manager: &tauri::State<'r, ConnectionManager>,
    ) -> Result<(), CusError> {
        let value: Value = manager
            .execute(
                self.connection_id,
                self.db,
                redis::cmd("get").arg(&self.name),
            )
            .await?;
        let v: Result<String, redis::RedisError> = String::from_redis_value(&value);
        match v {
            Ok(s) => self.data = s,
            Err(_) => {
                let i: Vec<u8> = Vec::from_redis_value(&value).unwrap();
                self.data = i
                    .iter()
                    .map(|u| format!("{:b}", u))
                    .collect::<Vec<String>>()
                    .join("");
            }
        }
        Ok(())
    }
    pub async fn get_length<'r>(
        &mut self,
        manager: &tauri::State<'r, ConnectionManager>,
    ) -> Result<(), CusError> {
        let cmd = match self.types.as_str() {
            "string" => "STRLEN",
            "hash" => "HLEN",
            "list" => "LLEN",
            "set" => "SCARD",
            "zset" => "ZCARD",
            _ => "",
        };
        if cmd != "" {
            let length_value: Value = manager
                .execute(self.connection_id, self.db, redis::cmd(cmd).arg(&self.name))
                .await?;
            self.length = i64::from_redis_value(&length_value)?;
        }
        Ok(())
    }
    pub fn is_none(&self) -> bool {
        self.types == "none"
    }
    pub fn get_type(&self) -> String {
        return self.types.clone();
    }
    pub fn get_name(&self) -> String {
        return self.name.clone();
    }
}
