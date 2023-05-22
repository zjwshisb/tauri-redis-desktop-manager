
use serde::{Serialize};


#[derive(Debug, Serialize)]
pub struct Connection {
    pub id: u16,
    pub host: String,
    pub port: i32,
    pub auth: String,
}



#[derive(Serialize, Debug)]
pub struct Field {
    pub name: String,
    pub value: String
}
