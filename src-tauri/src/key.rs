use crate::connection::Manager;
use crate::err::CusError;
use crate::response::FieldValue;
use redis::{cmd, Value};
use serde::Serialize;

#[derive(Serialize, Debug)]
pub struct Key {
    name: String,
    types: String,
    sub_types: String,
    ttl: i64,
    data: FieldValue,
    connection_id: u32,
    db: Option<u8>,
    memory: i64,
    length: i64,
}
impl Key {
    pub async fn build<'r>(
        name: String,
        db: Option<u8>,
        cid: u32,
        manager: &tauri::State<'r, Manager>,
    ) -> Result<Key, CusError> {
        let mut key: Key = Key {
            name,
            types: "".into(),
            sub_types: "".into(),
            ttl: -2,
            data: FieldValue::Nil,
            connection_id: cid,
            db,
            memory: 0,
            length: 0,
        };
        key.types = manager.execute(cid, cmd("type").arg(&key.name), db).await?;
        key.get_sub_types(manager).await;
        if !key.is_none() {
            key.get_memory(&manager).await?;
            key.get_length(&manager).await?;
        }
        Ok(key)
    }

    pub async fn get_sub_types<'r>(&mut self, manager: &tauri::State<'r, Manager>) {
        if self.types == "string" {
            if let Ok(_) = manager
                .execute::<Value>(self.connection_id, cmd("PFCOUNT").arg(&self.name), self.db)
                .await
            {
                self.sub_types = String::from("HyperLogLog");
                return;
            }
        }

        self.sub_types = self.types.clone()
    }

    pub async fn get_memory<'r>(
        &mut self,
        manager: &tauri::State<'r, Manager>,
    ) -> Result<(), CusError> {
        if self.types == "ReJSON-RL" {
            self.memory = manager
                .execute(
                    self.connection_id,
                    cmd("JSON.DEBUG").arg("MEMORY").arg(&self.name),
                    self.db,
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
                    self.db,
                )
                .await?
        }
        Ok(())
    }

    pub async fn get_ttl<'r>(
        &mut self,
        manager: &tauri::State<'r, Manager>,
    ) -> Result<(), CusError> {
        self.ttl = manager
            .execute(self.connection_id, cmd("ttl").arg(&self.name), self.db)
            .await?;
        Ok(())
    }

    pub async fn get_json_value<'r>(
        &mut self,
        manager: &tauri::State<'r, Manager>,
    ) -> Result<(), CusError> {
        self.data = FieldValue::Str(
            manager
                .execute(
                    self.connection_id,
                    cmd("JSON.GET").arg(&self.name).arg("$"),
                    self.db,
                )
                .await?,
        );
        Ok(())
    }

    pub async fn get_string_value<'r>(
        &mut self,
        manager: &tauri::State<'r, Manager>,
    ) -> Result<(), CusError> {
        let value: Vec<u8> = manager
            .execute(
                self.connection_id,
                redis::cmd("get").arg(&self.name),
                self.db,
            )
            .await?;
        self.data = FieldValue::Str(String::from_utf8_lossy(&value).to_string());
        Ok(())
    }
    pub async fn get_length<'r>(
        &mut self,
        manager: &tauri::State<'r, Manager>,
    ) -> Result<(), CusError> {
        let cmd = match self.sub_types.as_str() {
            "string" => "STRLEN",
            "HyperLogLog" => "PFCOUNT",
            "hash" => "HLEN",
            "list" => "LLEN",
            "set" => "SCARD",
            "zset" => "ZCARD",
            "MBbloom--" => "BF.CARD",
            _ => "",
        };
        if cmd != "" {
            self.length = manager
                .execute(self.connection_id, redis::cmd(cmd).arg(&self.name), self.db)
                .await?;
        }
        Ok(())
    }
    pub fn is_none(&self) -> bool {
        self.types == "none"
    }
    pub fn get_type(&self) -> String {
        self.types.clone()
    }
    pub fn get_name(&self) -> String {
        self.name.clone()
    }
}
