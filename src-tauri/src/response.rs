use serde::{Serialize, Serializer};
use crate::err::CusError;

#[derive(Debug,Serialize)]
pub struct Response<T> {
    data: T
}
impl<T> Response<T> where T: serde::Serialize {
    pub fn new(data: T) -> Result<String, CusError> {
        let r = Response{
            data
        };
        Ok(serde_json::to_string::<Response<T>>(&r)?)
    }
}