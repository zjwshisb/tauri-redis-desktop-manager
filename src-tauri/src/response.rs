use crate::err::CusError;
use chrono::prelude::*;
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Response<T> {
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
    T: serde::Serialize,
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

#[derive(Serialize, Debug)]
pub struct Field {
    pub name: String,
    pub value: String,
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
}
