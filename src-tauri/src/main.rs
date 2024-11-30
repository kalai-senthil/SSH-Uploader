// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use serde::Deserialize;
use std::fs;
use std::path::Path;
use std::process::Command;
use tauri_plugin_sql::{Migration, MigrationKind};

#[derive(Deserialize, Debug)]
struct Machine {
    ip: String,
    password: String,
}

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
    remote_hosts: Vec<Machine>,
    remote_user: String,
    remote_path: String,
    remote_file_name: String,
    port: u16,
) -> Vec<String> {
    let mut results = Vec::new();
    for remote_host in remote_hosts {
        let destination = format!(
            "{}@{}:{}/{}",
            remote_user, remote_host.ip, remote_path, remote_file_name
        );

        let command = format!(
            "sshpass -p {} scp -o StrictHostKeyChecking=no -P {} {} {} {}",
            remote_host.password,
            port,
            get_args(is_directory(&local_file_path)),
            local_file_path,
            destination
        );

        let output = Command::new("sh").args(&["-c", &command]).output();
        match output {
            Ok(output) => {
                if output.status.success() {
                    let stdout = String::from_utf8_lossy(&output.stdout);
                    results.push(stdout.to_string());
                } else {
                    let stderr = String::from_utf8_lossy(&output.stderr);
                    results.push(format!("Error: {}", stderr));
                }
            }
            Err(e) => results.push(format!("Failed to execute '{}': {}", command, e)),
        }
    }
    results
}

#[tauri::command]
async fn execute_command(
    remote_hosts: Vec<Machine>,
    remote_user: String,
    port: u16,
    args: String,
    command: String,
) -> Vec<String> {
    let mut results = Vec::new();
    for remote_host in remote_hosts {
        let command = format!(
            "sshpass -p '{}' ssh -o StrictHostKeyChecking=no {}@{} {} {}",
            remote_host.password, remote_user, remote_host.ip, command, args
        );
        let output = Command::new("sh").args(&["-c", &command]).output();
        match output {
            Ok(output) => {
                if output.status.success() {
                    let stdout = String::from_utf8_lossy(&output.stdout);
                    results.push(stdout.to_string());
                } else {
                    let stderr = String::from_utf8_lossy(&output.stderr);
                    results.push(format!("Error: {}", stderr));
                }
            }
            Err(e) => results.push(format!("Failed to execute '{}': {}", command, e)),
        }
    }
    results
}
fn main() {
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: "CREATE TABLE COMMANDS (ID varchar(500) PRIMARY KEY, NAME TEXT,COMMAND TEXT);
            CREATE TABLE PATHS (ID varchar(500) PRIMARY KEY, NAME TEXT,PATH TEXT);
            CREATE TABLE PASSWORDS (ID varchar(500) PRIMARY KEY, NAME TEXT,PASSWORD TEXT);
            CREATE TABLE IPS (ID varchar(500) PRIMARY KEY, NAME TEXT,IP TEXT, PASSWORD varchar(500), FOREIGN KEY (PASSWORD) REFERENCES PASSWORDS(ID));
            CREATE TABLE FLOWS (ID varchar(500) PRIMARY KEY,NAME TEXT);
            CREATE TABLE NODES (id varchar(500) PRIMARY KEY,FLOWID varchar(500),type TEXT,data JSON,targetPosition TEXT,sourcePosition TEXT,position JSON,FOREIGN KEY (FLOWID) REFERENCES FLOWS(ID) ON DELETE CASCADE);
            CREATE TABLE EDGES (id varchar(500) PRIMARY KEY,FLOWID varchar(500),target varchar(500),source varchar(500), FOREIGN KEY (FLOWID) REFERENCES FLOWS(ID) ON DELETE CASCADE);
            ",
            kind: MigrationKind::Up,
        },
    ];
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![upload_file])
        .invoke_handler(tauri::generate_handler![execute_command])
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
