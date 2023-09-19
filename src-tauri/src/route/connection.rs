use crate::{
    conn::{ConnectionManager, ConnectionWrapper},
    err::CusError,
    request::IdArgs,
    sqlite::Connection,
};
use tauri::State;

pub fn add(payload: String) -> Result<Connection, CusError> {
    let mut connection: Connection = serde_json::from_str(&payload)?;
    connection.save()?;
    Ok(connection)
}

pub async fn get() -> Result<Vec<Connection>, CusError> {
    Connection::all()
}

pub fn del(payload: String) -> Result<(), CusError> {
    let args: IdArgs<u32> = serde_json::from_str(&payload)?;
    let conn = Connection::first(args.id)?;
    conn.del()
}

pub fn update(payload: String) -> Result<Connection, CusError> {
    let mut conn: Connection = serde_json::from_str(&payload)?;
    conn.save()?;
    Ok(conn)
}

pub async fn open<'r>(cid: u32, manager: State<'r, ConnectionManager>) -> Result<(), CusError> {
    let connection = Connection::first(cid)?;
    let conn = ConnectionWrapper::build(connection).await?;
    manager.add(cid, conn).await;
    Ok(())
}

pub async fn close<'r>(cid: u32, manager: State<'r, ConnectionManager>) -> Result<(), CusError> {
    manager.remove(cid).await;
    Ok(())
}
