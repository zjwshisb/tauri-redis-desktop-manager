use crate::connection::CValue;
use crate::request::{CommonValueArgs, FieldValueArgs, FieldValueItem, ItemScanArgs, RangeArgs};
use crate::response::{Field, ScanLikeResult};
use crate::{connection::Manager, err::CusError};
use redis::Value;
use serde::Deserialize;

pub async fn zscan(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<ScanLikeResult<Field, String>, CusError> {
    let args: ItemScanArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZSCAN");
    cmd.arg(args.name)
        .arg(args.cursor)
        .arg(&["COUNT", args.count.to_string().as_str()]);
    if let Some(search) = args.search {
        cmd.arg(&["MATCH", &format!("*{}*", search)]);
    }
    let values: Vec<Value> = manager.execute(cid, &mut cmd, args.db).await?;
    ScanLikeResult::<Field, String>::build(values)
}

pub async fn zrem(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<i64, CusError> {
    let args: CommonValueArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("ZREM").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

#[derive(Deserialize)]
struct ZAddArgs {
    name: String,
    db: Option<u8>,
    value: Vec<FieldValueItem<String>>,
    option_1: Option<String>,
    option_2: Option<String>,
    ch: Option<bool>,
    incr: Option<bool>,
}

pub async fn zadd(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: ZAddArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZADD");
    cmd.arg(args.name);
    cmd.arg(args.option_1).arg(args.option_2);
    if let Some(v) = args.ch {
        if v {
            cmd.arg("CH");
        }
    }
    if let Some(v) = args.incr {
        if v {
            cmd.arg("INCR");
        }
    }
    for x in args.value {
        cmd.arg(x.value).arg(x.field);
    }

    manager.execute(cid, &mut cmd, args.db).await
}

#[derive(Deserialize)]
struct MPopArgs {
    timeout: Option<String>,
    num_keys: i64,
    keys: Vec<String>,
    option: String,
    count: Option<i64>,
    db: Option<u8>,
}

pub async fn bzmpop(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: MPopArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("BZMPOP");
    cmd.arg(args.timeout)
        .arg(args.num_keys)
        .arg(args.keys)
        .arg(args.option);
    if let Some(v) = args.count {
        cmd.arg(("COUNT", v));
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn bzpop_max(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<String, Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("BZPOPMAX").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn bzpop_min(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<String, Vec<String>> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("BZPOPMIN").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn zcount(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: RangeArgs<String> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("ZCOUNT")
                .arg(args.name)
                .arg(args.start)
                .arg(args.end),
            args.db,
        )
        .await
}

#[derive(Deserialize)]
struct ZDiffArgs {
    num_keys: i64,
    keys: Vec<String>,
    with_scores: Option<bool>,
    db: Option<u8>,
}
pub async fn zdiff(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: ZDiffArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZDIFF");
    cmd.arg(args.num_keys).arg(args.keys);
    if let Some(v) = args.with_scores {
        if v {
            cmd.arg("WITHSCORES");
        }
    }
    manager.execute(cid, &mut cmd, args.db).await
}

#[derive(Deserialize)]
struct ZDiffStoreArgs {
    num_keys: i64,
    keys: Vec<String>,
    destination: String,
    db: Option<u8>,
}
pub async fn zdiff_store(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: ZDiffStoreArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("ZDIFFSTORE")
                .arg(args.destination)
                .arg(args.num_keys)
                .arg(args.keys),
            args.db,
        )
        .await
}

pub async fn zincr_by(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: FieldValueArgs = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("ZINCRBY")
                .arg(args.name)
                .arg(args.value)
                .arg(args.field),
            args.db,
        )
        .await
}

#[derive(Deserialize)]
struct ZInterArgs {
    num_keys: i64,
    keys: Vec<String>,
    weights: Option<Vec<String>>,
    withscores: Option<bool>,
    aggregate: Option<String>,
    db: Option<u8>,
}

pub async fn zinter(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: ZInterArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZINTER");
    cmd.arg(args.num_keys).arg(args.keys);
    if let Some(v) = args.weights {
        cmd.arg(("WEIGHTS", v));
    }
    if let Some(v) = args.aggregate {
        cmd.arg(("AGGREGATE", v));
    }
    if let Some(v) = args.withscores {
        if v {
            cmd.arg("WITHSCORES");
        }
    }
    manager.execute(cid, &mut cmd, args.db).await
}

#[derive(Deserialize)]
struct ZInterCardArgs {
    num_keys: i64,
    keys: Vec<String>,
    limit: Option<String>,
    db: Option<u8>,
}

pub async fn zinter_card(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: ZInterCardArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZINTERCARD");
    cmd.arg(args.num_keys).arg(args.keys);
    if let Some(v) = args.limit {
        cmd.arg(("LIMIT", v));
    }
    manager.execute(cid, &mut cmd, args.db).await
}

#[derive(Deserialize)]
struct ZInterStoreArgs {
    num_keys: i64,
    keys: Vec<String>,
    destination: String,
    weights: Option<Vec<String>>,
    aggregate: Option<String>,
    db: Option<u8>,
}

pub async fn zinter_store(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: ZInterStoreArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZINTERSTORE");
    cmd.arg(args.destination).arg(args.num_keys).arg(args.keys);
    if let Some(v) = args.weights {
        cmd.arg(("WEIGHTS", v));
    }
    if let Some(v) = args.aggregate {
        cmd.arg(("AGGREGATE", v));
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn zlex_count(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: RangeArgs<String> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("ZLEXCOUNT")
                .arg(args.name)
                .arg(args.start)
                .arg(args.end),
            args.db,
        )
        .await
}

pub async fn zmpop(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: MPopArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZMPOP");
    cmd.arg(args.num_keys).arg(args.keys).arg(args.option);
    if let Some(v) = args.count {
        cmd.arg(("COUNT", v));
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn zmscore(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<Vec<String>> = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZMSCORE");
    cmd.arg(args.name).arg(args.value);
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn zpop_max(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<Option<String>, String> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("ZPOPMAX").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

pub async fn zpop_min(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs<Option<String>, String> = serde_json::from_str(&payload)?;
    manager
        .execute(
            cid,
            redis::cmd("ZPOPMIN").arg(args.name).arg(args.value),
            args.db,
        )
        .await
}

#[derive(Deserialize)]
struct ZRandMemberArgs {
    name: String,
    count: Option<String>,
    withscores: Option<bool>,
    db: Option<u8>,
}

pub async fn zrand_member(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: ZRandMemberArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZRANDMEMBER");
    cmd.arg(args.name);
    if let Some(v) = args.count {
        cmd.arg(v);
        if let Some(v) = args.withscores {
            if v {
                cmd.arg("WITHSCORES");
            }
        }
    }
    manager.execute(cid, &mut cmd, args.db).await
}

#[derive(Deserialize)]
struct ZRangeArgs {
    name: String,
    min: String,
    max: String,
    order: Option<String>,
    offset: Option<String>,
    count: Option<String>,
    withscores: Option<bool>,
    db: Option<u8>,
}

pub async fn zrange(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: ZRangeArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZRANGE");
    cmd.arg(args.name)
        .arg(args.min)
        .arg(args.max)
        .arg(args.order);
    if let Some(v) = args.offset {
        if let Some(c) = args.count {
            cmd.arg(("LIMIT", v, c));
        }
    }
    if let Some(v) = args.withscores {
        if v {
            cmd.arg("WITHSCORES");
        }
    }
    manager.execute(cid, &mut cmd, args.db).await
}

#[derive(Deserialize)]
struct ZRangeStoreArgs {
    destination: String,
    source: String,
    min: String,
    max: String,
    order: Option<String>,
    offset: Option<String>,
    count: Option<String>,
    db: Option<u8>,
}

pub async fn zrange_store(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: ZRangeStoreArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZRANGESTORE");
    cmd.arg(args.destination)
        .arg(args.source)
        .arg(args.min)
        .arg(args.max)
        .arg(args.order);
    if let Some(v) = args.offset {
        if let Some(c) = args.count {
            cmd.arg(("LIMIT", v, c));
        }
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn zrank(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: FieldValueArgs<Option<bool>> = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZRANK");
    cmd.arg(args.name).arg(args.field);

    if let Some(v) = args.value {
        if v {
            cmd.arg("WITHSCORE");
        }
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn zrem_range_by_lex(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: RangeArgs<String> = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZREMRANGEBYLEX");
    cmd.arg(args.name).arg(args.start).arg(args.end);
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn zrem_range_by_rank(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: RangeArgs<String> = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZREMRANGEBYRANK");
    cmd.arg(args.name).arg(args.start).arg(args.end);
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn zrem_range_by_score(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: RangeArgs<String> = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZREMRANGEBYSCORE");
    cmd.arg(args.name).arg(args.start).arg(args.end);
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn zrev_rank(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: FieldValueArgs<Option<bool>> = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZREVRANK");
    cmd.arg(args.name).arg(args.field);

    if let Some(v) = args.value {
        if v {
            cmd.arg("WITHSCORE");
        }
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn zscore(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: CommonValueArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZSCORE");
    cmd.arg(args.name).arg(args.value);

    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn zunion(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: ZInterArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZUNION");
    cmd.arg(args.num_keys).arg(args.keys);
    if let Some(v) = args.weights {
        cmd.arg(("WEIGHTS", v));
    }
    if let Some(v) = args.aggregate {
        cmd.arg(("AGGREGATE", v));
    }
    if let Some(v) = args.withscores {
        if v {
            cmd.arg("WITHSCORES");
        }
    }
    manager.execute(cid, &mut cmd, args.db).await
}

pub async fn zunion_store(
    payload: String,
    cid: u32,
    manager: tauri::State<'_, Manager>,
) -> Result<CValue, CusError> {
    let args: ZInterStoreArgs = serde_json::from_str(&payload)?;
    let mut cmd = redis::cmd("ZUNIONSTORE");
    cmd.arg(args.destination).arg(args.num_keys).arg(args.keys);
    if let Some(v) = args.weights {
        cmd.arg(("WEIGHTS", v));
    }
    if let Some(v) = args.aggregate {
        cmd.arg(("AGGREGATE", v));
    }
    manager.execute(cid, &mut cmd, args.db).await
}
