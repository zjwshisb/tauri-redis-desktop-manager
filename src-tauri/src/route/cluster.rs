use crate::{err::CusError, state::ConnectionManager};

pub async fn get_nodes<'r>(
    cid: u32,
    manager: tauri::State<'r, ConnectionManager>,
) -> Result<Vec<String>, CusError> {
    return manager.get_server_node(cid).await;
}
