use crate::err::CusError;
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
