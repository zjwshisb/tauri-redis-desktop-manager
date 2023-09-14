use rand::distributions::Alphanumeric;
use rand::prelude::*;

pub fn random_str(length: usize) -> String {
    let mut rng = rand::thread_rng();
    Alphanumeric
        .sample_iter(&mut rng)
        .take(length)
        .map(char::from)
        .collect::<String>()
}

pub fn binary_to_redis_str(v: &Vec<u8>) -> String {
    let mut s = String::new();
    v.into_iter().for_each(|u| {
        if *u >= 32 && *u <= 126 {
            s.push(*u as char)
        } else {
            let fs = format!("\\x{:02x?}", u);
            s.push_str(fs.as_str());
        }
    });
    s
}

pub fn redis_str_to_binary(s: String) -> Vec<u8> {
    let len = s.len();
    let mut r = vec![];
    let mut start = 0;
    while start < len {
        if let Some(v) = s.get(start..start + 1) {
            if v == "\\" {
                if let Some(ss) = s.get(start + 2..start + 4) {
                    if let Ok(s) = hex::decode(ss) {
                        r.push(s[0]);
                    }
                }
                start = start + 4;
            } else {
                r.push(v.as_bytes()[0]);
                start = start + 1;
            }
        }
    }
    r
}
