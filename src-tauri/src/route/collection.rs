use crate::{err::CusError, request::IdArgs, sqlite::Collection};

pub async fn all() -> Result<Vec<Collection>, crate::err::CusError> {
    Collection::all()
}

pub async fn add(payload: String) -> Result<Collection, CusError> {
    let mut collection: Collection = serde_json::from_str(&payload)?;
    collection.save()?;
    Ok(collection)
}

pub async fn del(payload: String) -> Result<(), CusError> {
    let args: IdArgs<u32> = serde_json::from_str(&payload)?;

    let collection = Collection::first(args.id)?;
    collection.del()?;
    Ok(())
}
