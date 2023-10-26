use crate::err::CusError;
use crate::response::FieldValue;
use crate::ConnectionManager;
use redis::FromRedisValue;
use redis::{cmd, Value};
use serde::Serialize;

#[derive(Serialize, Debug)]
pub struct Key {
    name: String,
    types: String,
    ttl: i64,
    data: FieldValue,
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
            data: FieldValue::Nil,
            connection_id: cid,
            db,
            memory: 0,
            length: 0,
        };
        key.types = manager
            .execute(cid, cmd("type").arg(&key.name), Some(db))
            .await?;
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
        if self.types == "ReJSON-RL" {
            self.memory = manager
                .execute(
                    self.connection_id,
                    cmd("JSON.DEBUG").arg("MEMORY").arg(&self.name),
                    Some(self.db),
                )
                .await?
        } else {
            self.memory = manager
                .execute(
                    self.connection_id,
                    cmd("memory")
                        .arg("usage")
                        .arg(&self.name)
                        .arg(&["SAMPLES", "0"]),
                    Some(self.db),
                )
                .await?
        }
        Ok(())
    }

    pub async fn get_ttl<'r>(
        &mut self,
        manager: &tauri::State<'r, ConnectionManager>,
    ) -> Result<(), CusError> {
        self.ttl = manager
            .execute(
                self.connection_id,
                cmd("ttl").arg(&self.name),
                Some(self.db),
            )
            .await?;
        Ok(())
    }

    pub async fn get_json_value<'r>(
        &mut self,
        manager: &tauri::State<'r, ConnectionManager>,
    ) -> Result<(), CusError> {
        self.data = FieldValue::Str(
            manager
                .execute(
                    self.connection_id,
                    cmd("JSON.GET").arg(&self.name).arg("$"),
                    Some(self.db),
                )
                .await?,
        );
        Ok(())
    }

    pub async fn get_string_value<'r>(
        &mut self,
        manager: &tauri::State<'r, ConnectionManager>,
    ) -> Result<(), CusError> {
        let value: Value = manager
            .execute(
                self.connection_id,
                redis::cmd("get").arg(&self.name),
                Some(self.db),
            )
            .await?;
        let v: Result<String, redis::RedisError> = String::from_redis_value(&value);
        match v {
            Ok(s) => self.data = FieldValue::Str(s),
            Err(_) => {
                let i: Vec<u8> = Vec::from_redis_value(&value).unwrap();
                self.data = FieldValue::Str(
                    i.iter()
                        .map(|u| format!("{:b}", u))
                        .collect::<Vec<String>>()
                        .join(""),
                );
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
            "MBbloom--" => "BF.CARD",
            _ => "",
        };
        if cmd != "" {
            self.length = manager
                .execute(
                    self.connection_id,
                    redis::cmd(cmd).arg(&self.name),
                    Some(self.db),
                )
                .await?;
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
