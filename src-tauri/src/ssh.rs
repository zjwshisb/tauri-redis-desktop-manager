use crate::err::CusError;
use ssh_jumper::{
    model::{HostAddress, HostSocketParams, JumpHostAuthParams, SshForwarderEnd, SshTunnelParams},
    SshJumper,
};
use std::{borrow::Cow, net::Ipv6Addr};
use std::{
    net::{IpAddr, Ipv4Addr, SocketAddr},
    path::Path,
};
use tokio::sync::oneshot::Receiver;

#[derive(Debug, Clone)]
pub struct SshParams {
    pub host: String,
    pub port: u16,
    pub username: String,
    pub password: Option<String>,
    pub private_key: Option<String>,
    pub passphrase: Option<String>,
    pub target_host: String,
    pub target_port: u16,
}

pub trait SshTunnel {
    fn store_addr(&mut self, addr: SocketAddr, rx: Receiver<SshForwarderEnd>);
    fn get_ssh_config(&self) -> Option<SshParams>;
    fn close_tunnel(&mut self);
}

fn string_to_ip(s: &String) -> Result<IpAddr, CusError> {
    let err = Err(CusError::App(String::from("not ip")));
    let vec: Vec<_> = s.as_str().split(".").collect();
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

pub async fn create_tunnel<T: SshTunnel>(t: &mut T) -> Result<Option<()>, CusError> {
    if let Some(config) = t.get_ssh_config() {
        let mut jump_host = HostAddress::HostName(Cow::Borrowed(&config.host));
        if let Ok(ip_addr) = string_to_ip(&config.host) {
            jump_host = HostAddress::IpAddr(ip_addr);
        }

        let mut auth: JumpHostAuthParams;
        let mut password = String::new();
        if let Some(p) = config.password {
            password = p;
        }
        auth = JumpHostAuthParams::password(
            Cow::from(config.username.as_str()),
            Cow::from(password.as_str()),
        );

        let mut private_key = String::new();
        if let Some(k) = config.private_key {
            private_key = k
        }
        let mut passphrase_str = String::new();
        let mut passphrase = None;
        if let Some(p) = config.passphrase {
            passphrase_str = p
        }
        if passphrase_str != "" {
            passphrase = Some(Cow::from(passphrase_str.as_str()));
        }
        if private_key != "" {
            auth = JumpHostAuthParams::key_pair(
                Cow::from(config.username.as_str()),
                Cow::from(Path::new(private_key.as_str())),
                passphrase,
            );
        }

        let mut target_host = HostAddress::HostName(Cow::Borrowed(&config.target_host));
        if let Ok(ip_addr) = string_to_ip(&config.target_host) {
            target_host = HostAddress::IpAddr(ip_addr);
        }
        let target_socket: HostSocketParams<'_> = HostSocketParams {
            address: target_host,
            port: config.target_port,
        };
        let ssh_params =
            SshTunnelParams::new(jump_host, auth, target_socket).with_jump_host_port(config.port);
        match SshJumper::open_tunnel(&ssh_params).await {
            Ok((addr, rx)) => t.store_addr(addr, rx),
            Err(e) => return Err(CusError::App(e.to_string())),
        }
    }
    Ok(None)
}
