use crate::{connection::Manager, err::CusError, model::Command, pubsub::PubsubManager, response};

pub async fn log<'r>(
    manager: tauri::State<'r, Manager>,
    window: tauri::Window,
) -> Result<(), CusError> {
    let (tx, mut rx) = tokio::sync::mpsc::channel::<Command>(32);
    manager.set_tx(tx).await;
    tokio::spawn(async move {
        while let Some(cmd) = rx.recv().await {
            let _ = window.emit("debug", serde_json::to_string(&cmd).unwrap());
        }
    });
    Ok(())
}

pub async fn cancel<'r>(manager: tauri::State<'r, Manager>) -> Result<(), CusError> {
    manager.remove_tx().await;
    Ok(())
}

pub async fn clients<'r>(
    manager: tauri::State<'r, Manager>,
    pubsub: tauri::State<'r, PubsubManager>,
) -> Result<Vec<response::Conn>, CusError> {
    let mut r = vec![];
    let mut m = manager.get_conns().await;
    let mut p = pubsub.get_conns();
    r.append(&mut m);
    r.append(&mut p);
    Ok(r)
}
