use crate::{
    conn::ConnectionManager,
    err::{self, CusError},
};

pub async fn get_database<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<String, CusError> {
    let value = manager.get_config(cid, "databases").await?;
    if let Some(v) = value.get("databases") {
        return Ok(v.clone());
    }
    return Err(err::new_normal());
}
