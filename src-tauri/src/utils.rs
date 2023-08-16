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
