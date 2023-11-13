use crate::utils;
use redis::Value as RedisValue;
mod conn;
mod event;
mod manager;
mod node;

pub use conn::{Connectable, ConnectedParam, Connection, ConnectionParams, ConnectionWrapper};
pub use event::EventManager;
pub use manager::Manager;
pub use node::Node;

pub enum Value {
    Str(String),
    Vec(Vec<Value>),
    Int(i64),
    Nil,
}

impl serde::Serialize for Value {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match &self {
            Value::Str(s) => {
                return serializer.serialize_str(s);
            }
            Value::Vec(v) => v.serialize(serializer),
            Value::Int(v) => v.serialize(serializer),
            Value::Nil => serializer.serialize_none(),
        }
    }
}

impl Value {
    pub fn build(v: RedisValue) -> Value {
        match v {
            RedisValue::Okay => return Self::Str("Ok".to_string()),
            RedisValue::Data(s) => {
                let result = String::from_utf8(s.clone());
                match result {
                    Ok(ss) => {
                        return Self::Str(ss);
                    }
                    Err(_) => {
                        let ss = utils::binary_to_redis_str(&s);
                        return Self::Str(ss);
                    }
                }
            }
            RedisValue::Bulk(v) => {
                let mut vec = vec![];
                for x in v {
                    vec.push(Self::build(x));
                }
                return Self::Vec(vec);
            }
            RedisValue::Nil => return Self::Nil,
            RedisValue::Status(s) => return Self::Str(s),
            RedisValue::Int(s) => return Self::Int(s),
        }
    }
}
