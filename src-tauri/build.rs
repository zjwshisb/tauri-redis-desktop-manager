fn main() {
  tauri_build::build()
  #[cfg(target_os = "macos")]
  {
    let _ = std::process::Command::new("xattr")
      .args(&["-d", "com.apple.quarantine", "target/debug/tauriredis.app"])
      .status();
  }
}
