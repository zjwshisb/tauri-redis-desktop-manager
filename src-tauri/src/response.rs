use crate::connection::CValue;
use crate::err::CusError;
use chrono::prelude::*;
use redis::FromRedisValue;
use redis::Value;
use serde::Deserialize;
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
    pub fn string(data: T) -> Result<String, CusError> {
        let r = Response { data };
        Ok(serde_json::to_string::<Response<T>>(&r)?)
    }
}

#[derive(Serialize, Debug, Deserialize, Clone)]
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
        EventResp {
            data,
            success: true,
            event,
            time: now.format("%H:%M:%S").to_string(),
            id,
        }
    }
}

#[derive(Clone, Debug)]
pub enum FieldValue {
    Str(String),
    Vec(Vec<Field>),
    DimVec(Vec<Vec<Field>>),
    Int(i64),
    Value(CValue),
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
            FieldValue::Str(s) =>  serializer.serialize_str(s),
            FieldValue::Vec(v) => v.serialize(serializer),
            FieldValue::Int(v) => v.serialize(serializer),
            FieldValue::DimVec(v) => v.serialize(serializer),
            FieldValue::Value(v) => v.serialize(serializer),
            FieldValue::Nil => serializer.serialize_none(),
        }
    }
}
pub fn build_fields(value_vec: &[Value]) -> Result<Vec<Field>, CusError> {
    let length = value_vec.len();
    let mut i = 0;
    let mut r = vec![];
    while i < length {
        if let Some(field) = value_vec.get(i) {
            let mut f = Field {
                field: String::from_redis_value(field)?,
                value: FieldValue::default(),
            };
            if let Some(value) = value_vec.get(i + 1) {
                match value {
                    Value::BulkString(v) => {
                        f.value = FieldValue::Str(String::from_utf8_lossy(v).to_string());
                    }
                    Value::Int(v) => {
                        f.value = FieldValue::Int(*v);
                    }
                    Value::Array(v) => {
                        // judge by first element type
                        if let Some(first) = v.first() {
                            match first {
                                Value::Array(_) => {
                                    let mut dim_vec = vec![];
                                    for vv in v {
                                        match vv {
                                            Value::Array(vvv) => {
                                                dim_vec.push(build_fields(vvv)?)
                                            }
                                            _ => {
                                                return Err(CusError::build(
                                                    "un match redis value type",
                                                ));
                                            }
                                        }
                                    }
                                    f.value = FieldValue::DimVec(dim_vec);
                                }
                                _ => {
                                    f.value = FieldValue::Vec(build_fields(v)?);
                                }
                            }
                        }
                    }
                    Value::Okay => {
                        f.value = FieldValue::Str("OK".to_string());
                    }
                    Value::Nil => {
                        f.value = FieldValue::Nil;
                    }
                    Value::SimpleString(s) => {
                        f.value = FieldValue::Str(s.to_string());
                    }
                    Value::BigNumber(big_int) => f.value = FieldValue::Str(big_int.to_string()),
                    _ => {}
                }
                r.push(f);
            }
        }
        i += 2;
    }
    Ok(r)
}
pub fn build_simple_fields(value_vec: &[Value]) -> Result<Vec<Field>, CusError> {
    let mut r = vec![];
    for x in value_vec {
        match x {
            Value::Array(v) => {
                if let Some(value) = v.first() {
                    if let Some(field) = v.get(1) {
                        r.push(Field {
                            field: String::from_redis_value(field)?,
                            value: FieldValue::Int(i64::from_redis_value(value)?),
                        })
                    }
                }
            }
            _ => {
                return Err(CusError::build("un match redis value type"));
            }
        }
    }
    Ok(r)
}

#[derive(Serialize, Debug, Default, Clone)]
pub struct Field {
    pub field: String,
    pub value: FieldValue,
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
        if let Some(first) = value.first() {
            result.cursor = String::from_redis_value(first)?;
        }
        if let Some(second) = value.get(1) {
            result.values = Vec::from_redis_value(second)?;
        }
        Ok(result)
    }
}

impl ScanLikeResult<Field, String> {
    pub fn build(value: Vec<Value>) -> Result<Self, CusError> {
        let mut result = ScanLikeResult::default();
        if let Some(first) = value.first() {
            result.cursor = String::from_redis_value(first)?;
        }
        if let Some(second) = value.get(1) {
            let vec: Vec<Value> = Vec::from_redis_value(second)?;
            result.values = build_fields(&vec)?;
        }
        Ok(result)
    }
}
