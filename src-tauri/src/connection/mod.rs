use redis::{FromRedisValue, RedisResult, Value as RedisValue};
mod conn;
mod event;
mod manager;
mod node;

pub use conn::{Connectable, ConnectedParam, Connection, ConnectionParams, ConnectionWrapper};
pub use event::EventManager;
pub use manager::Manager;
pub use node::Node;
#[derive(Clone, Debug)]
pub enum CValue {
    Str(String),
    Vec(Vec<CValue>),
    Int(i64),
    Float(f64),
    Nil,
    Bool(bool),
    Map(Vec<(CValue, CValue)>),
}
impl FromRedisValue for CValue {
    fn from_redis_value(v: &RedisValue) -> RedisResult<Self> {
        Ok(CValue::build(v.clone()))
    }
}

impl serde::Serialize for CValue {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match &self {
            CValue::Str(s) => {
                serializer.serialize_str(s)
            }
            CValue::Vec(v) => v.serialize(serializer),
            CValue::Int(v) => v.serialize(serializer),
            CValue::Nil => serializer.serialize_none(),
            CValue::Float(v) => v.serialize(serializer),
            CValue::Bool(v) => v.serialize(serializer),
            CValue::Map(v) => v.serialize(serializer),
        }
    }
}

impl CValue {
    pub fn build(v: RedisValue) -> CValue {
        println!("{:?}", v);
        match v {
            RedisValue::Okay => Self::Str("Ok".to_string()),
            RedisValue::BulkString(s) => {
                let result = String::from_utf8(s.clone());
                match result {
                    Ok(ss) => {
                        Self::Str(ss)
                    }
                    Err(_) => {
                        let ss = String::from_utf8_lossy(&s).to_string();
                        Self::Str(ss)
                    }
                }
            }
            RedisValue::Array(v) => {
                let mut vec = vec![];
                for x in v {
                    vec.push(Self::build(x));
                }
                Self::Vec(vec)
            }
            RedisValue::Nil => Self::Nil,
            RedisValue::SimpleString(s) => Self::Str(s),
            RedisValue::Int(s) => return Self::Int(s),
            RedisValue::Map(v) => {
                let mut vec = vec![];
                for (x, y) in v {
                    vec.push((Self::build(x), Self::build(y)));
                }
                Self::Map(vec)
            }
            RedisValue::Attribute { data, attributes } => todo!(),
            RedisValue::Set(v) => {
                let mut vec = vec![];
                for x in v {
                    vec.push(Self::build(x));
                }
                Self::Vec(vec)
            }
            RedisValue::Double(v) => Self::Float(v),
            RedisValue::Boolean(v) => Self::Bool(v),
            RedisValue::VerbatimString { format, text } => Self::Str(text),
            RedisValue::BigNumber(big_int) => Self::Str(big_int.to_string()),
            RedisValue::Push { kind, data } => todo!(),
            RedisValue::ServerError(server_error) => Self::Str(server_error.code().to_string()),
        }
    }
}
