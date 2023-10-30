use tauri::Window;

use crate::{conn::ConnectionWrapper, err::CusError, sqlite::Connection, ConnectionManager};

pub async fn open<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
    window: Window,
) -> Result<(), CusError> {
    let connection = Connection::first(cid)?;
    let conn = ConnectionWrapper::build(connection).await?;

    Ok(())
}
