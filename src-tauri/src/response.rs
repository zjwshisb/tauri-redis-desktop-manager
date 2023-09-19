use crate::err::CusError;
use chrono::prelude::*;
use redis::FromRedisValue;
use redis::Value;
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Response<T>
where
    T: serde::Serialize,
{
    data: T,
}
impl<T> Response<T>
where
    T: serde::Serialize,
{
    pub fn new(data: T) -> Result<String, CusError> {
        let r = Response { data };
        Ok(serde_json::to_string::<Response<T>>(&r)?)
    }
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
    T: Serialize,
{
    pub fn new(data: T, event: String) -> EventResp<T> {
        let id = rand::random::<u32>();
        let now: DateTime<Local> = Local::now();
        return EventResp {
            data,
            success: true,
            event,
            time: now.format("%H:%M:%S").to_string(),
            id,
        };
    }
}

#[derive(Debug, Clone)]
pub enum FieldValue {
    Str(String),
    Vec(Vec<Field>),
    Int(i64),
    Nil,
}

impl Default for FieldValue {
    fn default() -> Self {
        Self::Nil
    }
}

impl Serialize for FieldValue {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match &self {
            FieldValue::Str(s) => {
                return serializer.serialize_str(s);
            }
            FieldValue::Vec(v) => v.serialize(serializer),
            FieldValue::Int(i) => i.serialize(serializer),
            FieldValue::Nil => serializer.serialize_str(""),
        }
    }
}

#[derive(Serialize, Debug, Default, Clone)]
pub struct Field {
    pub name: String,
    pub value: FieldValue,
}

impl Field {
    pub fn first(name: &str, vec: &Vec<Field>) -> Option<Field> {
        for x in vec {
            if x.name == name {
                return Some(x.clone());
            }
        }
        return None;
    }
    pub fn build_vec(v: &Vec<Value>) -> Result<Vec<Self>, CusError> {
        let length = v.len();
        let mut i = 0;
        let mut r = vec![];
        while i < length {
            if let Some(n) = v.get(i) {
                let mut f = Field::default();
                let name = String::from_redis_value(n)?;
                f.name = name;
                if let Some(vv) = v.get(i + 1) {
                    match vv {
                        Value::Data(vvv) => {
                            f.value = FieldValue::Str(String::from_utf8_lossy(&vvv).to_string());
                        }
                        Value::Int(vvv) => {
                            f.value = FieldValue::Int(*vvv);
                        }
                        Value::Bulk(vvv) => {
                            f.value = FieldValue::Vec(Self::build_vec(vvv)?);
                        }
                        _ => {}
                    }
                    r.push(f);
                }
            }
            i = i + 2;
        }
        Ok(r)
    }
}

#[derive(Serialize)]
pub struct ScoreField {
    pub value: String,
    pub score: String,
}

#[derive(Serialize)]
pub struct Conn {
    pub id: String,
    pub host: String,
    pub created_at: String,
    pub types: String,
    pub proxy: Option<String>,
}

#[derive(Serialize, Default)]
pub struct KeyWithMemory {
    pub name: String,
    pub memory: i64,
    pub types: String,
}

#[derive(Debug, Serialize, Default)]
pub struct ScanLikeResult<T, K> {
    pub cursor: K,
    pub values: Vec<T>,
}

impl ScanLikeResult<String, String> {
    pub fn build(value: Vec<Value>) -> Result<Self, CusError> {
        let mut result = ScanLikeResult::default();
        if let Some(first) = value.get(0) {
            result.cursor = String::from_redis_value(first)?;
        }
        if let Some(second) = value.get(1) {
            result.values = Vec::from_redis_value(&second)?;
        }
        Ok(result)
    }
}

impl ScanLikeResult<Field, String> {
    pub fn build(value: Vec<Value>) -> Result<Self, CusError> {
        let mut result = ScanLikeResult::default();
        if let Some(first) = value.get(0) {
            result.cursor = String::from_redis_value(first)?;
        }
        if let Some(second) = value.get(1) {
            let vec: Vec<Value> = Vec::from_redis_value(second)?;
            result.values = Field::build_vec(&vec)?;
        }
        Ok(result)
    }
}
