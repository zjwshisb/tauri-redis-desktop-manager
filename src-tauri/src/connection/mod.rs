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
    Nil,
}
impl FromRedisValue for CValue {
    fn from_redis_value(v: &RedisValue) -> RedisResult<Self> {
        return Ok(CValue::build(v.clone()));
    }
}

impl serde::Serialize for CValue {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match &self {
            CValue::Str(s) => {
                return serializer.serialize_str(s);
            }
            CValue::Vec(v) => v.serialize(serializer),
            CValue::Int(v) => v.serialize(serializer),
            CValue::Nil => serializer.serialize_none(),
        }
    }
}

impl CValue {
    pub fn build(v: RedisValue) -> CValue {
        match v {
            RedisValue::Okay => return Self::Str("Ok".to_string()),
            RedisValue::BulkString(s) => {
                let result = String::from_utf8(s.clone());
                match result {
                    Ok(ss) => {
                        return Self::Str(ss);
                    }
                    Err(_) => {
                        let ss = String::from_utf8_lossy(&s).to_string();
                        return Self::Str(ss);
                    }
                }
            }
            RedisValue::Array(v) => {
                let mut vec = vec![];
                for x in v {
                    vec.push(Self::build(x));
                }
                return Self::Vec(vec);
            }
            RedisValue::Nil => return Self::Nil,
            RedisValue::SimpleString(s) => return Self::Str(s),
            RedisValue::Int(s) => return Self::Int(s),
            RedisValue::Map(_) => todo!(),
            RedisValue::Attribute { data, attributes } => todo!(),
            RedisValue::Set(_) => todo!(),
            RedisValue::Double(_) => todo!(),
            RedisValue::Boolean(_) => todo!(),
            RedisValue::VerbatimString { format, text } => todo!(),
            RedisValue::BigNumber(big_int) => todo!(),
            RedisValue::Push { kind, data } => todo!(),
            RedisValue::ServerError(server_error) => todo!(),
        }
    }
}
