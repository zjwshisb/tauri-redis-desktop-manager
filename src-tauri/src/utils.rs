use crate::err::CusError;
use rand::distributions::Alphanumeric;
use rand::prelude::*;

use std::net::Ipv6Addr;
use std::net::{IpAddr, Ipv4Addr};

pub fn compare_version(version1: &str, version2: &str) -> i8 {
    let arr1: Vec<_> = version1.split(".").collect();
    let arr2: Vec<_> = version2.split(".").collect();
    let mut len = arr1.len();
    if arr2.len() > len {
        len = arr2.len()
    }
    let mut i = 0;
    while i < len {
        let v1 = arr1.get(i);
        let v2 = arr2.get(i);
        let mut v1_num = 0;
        let mut v2_num = 0;
        if let Some(v1_str) = v1 {
            v1_num = v1_str.parse().unwrap_or_default();
        }
        if let Some(v2_str) = v2 {
            v2_num = v2_str.parse().unwrap_or_default();
        }
        if v1_num > v2_num {
            return 1;
        }
        if v1_num < v2_num {
            return -1;
        }
        i += 1
    }
    0
}

pub fn random_str(length: usize) -> String {
    let mut rng = thread_rng();
    Alphanumeric
        .sample_iter(&mut rng)
        .take(length)
        .map(char::from)
        .collect::<String>()
}

pub fn binary_to_redis_str(v: &Vec<u8>) -> String {
    let mut s = String::new();
    v.iter().for_each(|u| {
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
                start += 4;
            } else {
                r.push(v.as_bytes()[0]);
                start += 1;
            }
        }
    }
    r
}

pub fn string_to_ip(s: &str) -> Result<IpAddr, CusError> {
    let err = Err(CusError::App(String::from("not ip")));
    let vec: Vec<_> = s.split(".").collect();
    if vec.len() == 4 {
        let mut ip: [u8; 4] = [0; 4];
        for i in 0..vec.len() {
            if let Ok(u) = vec[i].parse::<u8>() {
                ip[i] = u;
            } else {
                return err;
            }
        }
        return Ok(IpAddr::V4(Ipv4Addr::new(ip[0], ip[1], ip[2], ip[3])));
    }
    if vec.len() == 8 {
        let mut ip: [u16; 8] = [0; 8];
        for i in 0..vec.len() {
            if let Ok(u) = vec[i].parse::<u16>() {
                ip[i] = u;
            } else {
                return err;
            }
        }
        return Ok(IpAddr::V6(Ipv6Addr::new(
            ip[0], ip[1], ip[2], ip[3], ip[4], ip[5], ip[6], ip[7],
        )));
    }
    err
}
