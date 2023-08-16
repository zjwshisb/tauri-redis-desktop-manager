use crate::{
    conn::{ConnectionManager, CusCmd},
    err::CusError,
    pubsub::PubsubManager,
    response,
};

pub async fn log<'r>(
    manager: tauri::State<'r, ConnectionManager>,
    window: tauri::Window,
) -> Result<(), CusError> {
    let (tx, mut rx) = tokio::sync::mpsc::channel::<CusCmd>(32);
    manager.set_tx(tx).await;
    tokio::spawn(async move {
        while let Some(cmd) = rx.recv().await {
            let _ = window.emit("debug", serde_json::to_string(&cmd).unwrap());
        }
    });
    Ok(())
}

pub async fn cancel<'r>(manager: tauri::State<'r, ConnectionManager>) -> Result<(), CusError> {
    manager.remove_tx().await;
    Ok(())
}

pub async fn clients<'r>(
    manager: tauri::State<'r, ConnectionManager>,
    pubsub: tauri::State<'r, PubsubManager>,
) -> Result<Vec<response::Conn>, CusError> {
    let mut r = vec![];
    let mut m = manager.get_conns().await;
    let mut p = pubsub.get_conns();
    r.append(&mut m);
    r.append(&mut p);
    Ok(r)
}
