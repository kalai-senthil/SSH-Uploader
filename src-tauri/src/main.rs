// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs;
use std::path::Path;
use std::process::Command;
use tauri_plugin_sql::{Migration, MigrationKind};

fn is_directory(path: &str) -> bool {
    let path = Path::new(path);

    match fs::metadata(path) {
        Ok(metadata) => metadata.is_dir(),
        Err(e) => false,
    }
}

fn get_args(is_directory: bool) -> String {
    let args = String::from("-r");
    if is_directory {
        return args;
    }
    "".to_string()
}

#[tauri::command]
async fn upload_file(
    local_file_path: String,
    password: String,
    remote_host: String,
    remote_user: String,
    remote_path: String,
    remote_file_name: String,
    port: u16,
) -> Result<String, String> {
    let destination = format!(
        "{}@{}:{}/{}",
        remote_user, remote_host, remote_path, remote_file_name
    );

    let command = format!(
        "sshpass -p {} scp -o StrictHostKeyChecking=no -P {} {} {} {}",
        password,
        port,
        get_args(is_directory(&local_file_path)),
        local_file_path,
        destination
    );

    let output = Command::new("sh")
        .args(&["-c", &command])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok("File uploaded successfully!".into())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr);
        Err(format!("Failed to upload file: {}", stderr))
    }
}
fn main() {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE IPS (ID varchar(500) PRIMARY KEY, NAME TEXT,IP TEXT);
            CREATE TABLE COMMANDS (ID varchar(500) PRIMARY KEY, NAME TEXT,COMMAND TEXT);
            CREATE TABLE PATHS (ID varchar(500) PRIMARY KEY, NAME TEXT,PATH TEXT);",
            kind: MigrationKind::Up,
        },
    ];
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![upload_file])
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:test.db", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    sshupload_lib::run()
}
