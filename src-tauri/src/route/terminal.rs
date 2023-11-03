use std::io::Read;

use encoding::all::UTF_16BE;
use encoding::{EncoderTrap, Encoding};
use tauri::Window;

use crate::{
    connection::{ConnectionWrapper, Manager},
    err::CusError,
    sqlite::Connection,
};

pub async fn open<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
    window: Window,
) -> Result<(), CusError> {
    let connection = Connection::first(cid)?;
    let conn = ConnectionWrapper::build(connection).await?;

    Ok(())
}

pub async fn transfer(payload: String) -> Result<Vec<u8>, CusError> {
    if let Ok(r) = UTF_16BE.encode(&payload, EncoderTrap::Ignore) {
        return Ok(r);
    }
    Ok(vec![])
}
