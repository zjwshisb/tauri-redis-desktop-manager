use chrono::Local;

use crate::err::CusError;

pub fn log(window: tauri::Window) -> Result<(), CusError> {
    let now = Local::now();
    tokio::spawn(async move {
        let id: i64 = 0;
        loop {}
        dbg!(now);
    });
    Ok(())
}
