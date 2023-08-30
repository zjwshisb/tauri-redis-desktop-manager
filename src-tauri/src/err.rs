use thiserror;

pub fn new_normal() -> CusError {
    CusError::App("something go wrong".into())
}

#[derive(Debug, thiserror::Error)]
pub enum CusError {
    #[error(transparent)]
    Sqlite(#[from] rusqlite::Error),
    #[error(transparent)]
    Reqwest(#[from] reqwest::Error),
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Redis(#[from] redis::RedisError),
    #[error(transparent)]
    Serde(#[from] serde_json::Error),
    #[error("{0}")]
    App(String),
}

// we must manually implement serde::Serialize
impl serde::Serialize for CusError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        return match &self {
            CusError::App(s) => serializer.serialize_str(s),
            _ => serializer.serialize_str(self.to_string().as_ref()),
        };
    }
}
