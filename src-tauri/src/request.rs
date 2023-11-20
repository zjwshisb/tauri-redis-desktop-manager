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
    pub db: Option<u8>,
    pub count: i64,
    pub search: Option<String>,
}

#[derive(Deserialize)]
pub struct CommonValueArgs<T = String, K = String> {
    pub name: K,
    pub db: Option<u8>,
    pub value: T,
}

#[derive(Deserialize)]
pub struct SingleValueArgs<T = String> {
    pub db: Option<u8>,
    pub value: T,
}

#[derive(Deserialize)]
pub struct FieldValueItem<T = String> {
    pub field: String,
    pub value: T,
}

#[derive(Deserialize)]
pub struct NameArgs<T = String> {
    pub name: T,
    pub db: Option<u8>,
}

#[derive(Deserialize)]
pub struct FieldValueArgs<T = String, F = String> {
    pub name: String,
    pub field: F,
    pub value: T,
    pub db: Option<u8>,
}

#[derive(Deserialize)]
pub struct RangeArgs<T = i64> {
    pub name: String,
    pub start: T,
    pub end: T,
    pub db: Option<u8>,
}
