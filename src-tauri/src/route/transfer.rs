use crate::err::CusError;
use redis::FromRedisValue;
use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct RequestResp {
    ec: u16,
    em: String,
    data: Option<String>,
}

#[derive(Deserialize)]
struct PhpArgs {
    data: String,
}

pub async fn php_unserialize(payload: String) -> Result<String, CusError> {
    let args: PhpArgs = serde_json::from_str(&payload)?;
    let client = reqwest::Client::new();
    let params = [("data", args.data.as_str())];
    let res = client
        .post("http://www.ecjson.com/phpunserial")
        .form(&params)
        .send()
        .await?;
    let resp_bytes = res.bytes().await?;
    let resp = String::from_byte_vec(&resp_bytes).unwrap();
    if let Some(s) = resp.get(0) {
        let r: RequestResp = serde_json::from_str(s)?;
        if r.ec == 200 {
            if let Some(data) = r.data {
                return Ok(data);
            }
        } else {
            return Err(CusError::App(r.em));
        }
    }
    Err(CusError::App(String::from("php unserialize request error")))
}
