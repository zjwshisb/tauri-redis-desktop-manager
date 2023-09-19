use serde::Deserialize;

#[derive(Deserialize)]
pub struct ScanLikeArgs<T> {
    pub cursor: T,
    pub search: Option<String>,
    pub db: Option<u8>,
    pub count: i64,
    pub types: Option<String>,
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
