use serde::{Deserialize, Serialize};

use crate::{
    connection::{self, Manager},
    err::CusError,
    sqlite,
};

#[derive(Deserialize, Debug)]
struct MigrateArgs {
    target_id: u32,
    target_db: Option<u8>,
    source_db: Option<u8>,
    keys: Vec<String>,
    delete: bool,
    replace: bool,
}

#[derive(Serialize)]
pub struct ItemResult {
    pub name: String,
    pub success: bool,
    pub message: String,
}

pub async fn migrate<'r>(
    payload: String,
    cid: u32,
    manager: tauri::State<'r, Manager>,
) -> Result<Vec<ItemResult>, CusError> {
    let args: MigrateArgs = serde_json::from_str(&payload)?;
    let mut result = vec![];
    let source_model = sqlite::Connection::first(cid)?;
    let mut source_connection = connection::ConnectionWrapper::build(source_model).await?;
    if !source_connection.is_cluster() {
        if let Some(db) = args.source_db {
            manager
                .execute_with::<String>(redis::cmd("select").arg(db), &mut source_connection)
                .await?;
        } else {
            return Err(CusError::build("target db not select"));
        }
    }
    let target_model = sqlite::Connection::first(args.target_id)?;
    let mut target_connection = connection::ConnectionWrapper::build(target_model).await?;
    if !target_connection.is_cluster() {
        if let Some(db) = args.target_db {
            manager
                .execute_with::<String>(redis::cmd("select").arg(db), &mut target_connection)
                .await?;
        } else {
            return Err(CusError::build("target db not select"));
        }
    }

    for k in args.keys {
        let mut r = ItemResult {
            name: k.clone(),
            success: false,
            message: String::default(),
        };
        let ttl: i64 = manager
            .execute_with(redis::cmd("pttl").arg(&k), &mut source_connection)
            .await?;
        let mut restore_cmd = redis::cmd("restore");
        restore_cmd.arg(&k);
        match ttl {
            -2 => {
                r.message = String::from("Key Not Exists");
                result.push(r);
                // key not exist in source
                continue;
            }
            -1 => {
                // no expire
                restore_cmd.arg(0);
            }
            i => {
                restore_cmd.arg(i);
            }
        }
        let dump_value: Vec<u8> = manager
            .execute_with(redis::cmd("dump").arg(&k), &mut source_connection)
            .await?;
        restore_cmd.arg(&dump_value);
        if args.replace {
            restore_cmd.arg("replace");
        }
        let restore_result: Result<String, CusError> = manager
            .execute_with(&mut restore_cmd, &mut target_connection)
            .await;
        match restore_result {
            Ok(s) => {
                r.message = s;
                r.success = true;
                if args.delete {
                    let _: Result<i64, CusError> = manager
                        .execute_with(redis::cmd("del").arg(&k), &mut source_connection)
                        .await;
                }
            }
            Err(e) => {
                r.message = e.to_string();
            }
        }
        result.push(r);
    }
    Ok(result)
}
