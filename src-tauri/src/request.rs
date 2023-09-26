use serde::Deserialize;

#[derive(Deserialize)]
pub struct ScanLikeArgs<T> {
    pub cursor: T,
    pub search: Option<String>,
    pub db: Option<u8>,
    pub count: i64,
    pub types: Option<String>,
    pub exact: Option<bool>,
}

#[derive(Deserialize)]
pub struct IdArgs<T> {
    pub id: T,
}

#[derive(Deserialize)]
pub struct ItemScanArgs {
    pub name: String,
    pub cursor: String,
    pub db: u8,
    pub count: i64,
    pub search: Option<String>,
}

#[derive(Deserialize)]
pub struct CommonValueArgs {
    pub name: String,
    pub db: u8,
    pub value: String,
}

#[derive(Deserialize)]
pub struct NameArgs {
    pub name: String,
    pub db: u8,
}
