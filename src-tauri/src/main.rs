// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use rand::{distributions::Alphanumeric, Rng};
use serde::{Deserialize, Serialize};
use std::path::Path;
use std::process::Command;
use std::{fmt::format, fs};
use tauri_plugin_sql::{Migration, MigrationKind};
#[derive(Deserialize, Debug)]
struct Machine {
    ip: String,
    password: String,
}
#[derive(Serialize, Debug)]
struct Result {
    command: String,
    result: String,
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

fn get_random_string(string_length: usize) -> String {
    rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(string_length)
        .map(char::from)
        .collect()
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
        let output_file = get_random_string(10);
        let command = format!(
            "sshpass -p {} scp -o StrictHostKeyChecking=no -P {} {} {} {} > /tmp/{}.txt",
            remote_host.password,
            port,
            get_args(is_directory(&local_file_path)),
            local_file_path,
            destination,
            output_file
        );
        let mut result = Result {
            command: command.clone(),
            result: String::from(""),
        };
        let output = Command::new("sh").args(&["-c", &command]).output();
        match output {
            Ok(output) => {
                if output.status.success() {
                    match fs::read_to_string(format!("/tmp/{}.txt", output_file)) {
                        Ok(content) => result.result = content,
                        Err(error) => {
                            result.result = String::from_utf8_lossy(&output.stdout).to_string()
                        }
                    }
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
) -> Vec<Result> {
    let mut results = Vec::<Result>::new();
    let output_file = get_random_string(10);
    for remote_host in remote_hosts {
        let execute_command = format!(
            "sshpass -p '{}' ssh -o StrictHostKeyChecking=no {}@{} {} {} > /tmp/{}.txt",
            remote_host.password, remote_user, remote_host.ip, command, args, output_file
        );
        let mut result = Result {
            command: format!("{} {}", command, args),
            result: String::from(""),
        };
        let output = Command::new("sh").args(&["-c", &execute_command]).output();
        match output {
            Ok(output) => {
                if output.status.success() {
                    match fs::read_to_string(format!("/tmp/{}.txt", output_file)) {
                        Ok(content) => result.result = content,
                        Err(error) => {
                            result.result = String::from_utf8_lossy(&output.stderr).to_string()
                        }
                    }
                } else {
                    let stderr = String::from_utf8_lossy(&output.stderr);
                    result.result = format!("Error: {}", stderr);
                }
            }
            Err(e) => result.result = format!("Failed to execute '{}': {}", execute_command, e),
        }
        results.push(result);
    }
    results
}
#[tauri::command]
async fn download(
    remote_host: Machine,
    remote_user: String,
    port: u16,
    remote_path: String,
    local_dir: String,
    local_file_name: String,
) -> String {
    let mut result = String::new();
    let output_file = get_random_string(10);
    let command = format!(
        "sshpass -p '{}' scp -o StrictHostKeyChecking=no -P {} {} {}@{}:{} {}/{} > /tmp/{}.txt",
        remote_host.password,
        port,
        get_args(is_directory(&remote_path)),
        remote_user,
        remote_host.ip,
        remote_path,
        local_dir,
        local_file_name,
        output_file
    );
    let output = Command::new("sh").args(&["-c", &command]).output();
    match output {
        Ok(output) => {
            if output.status.success() {
                match fs::read_to_string(format!("/tmp/{}.txt", output_file)) {
                    Ok(content) => result = content,
                    Err(error) => result = String::from_utf8_lossy(&output.stdout).to_string(),
                }
            } else {
                let stderr = String::from_utf8_lossy(&output.stderr);
                result = format!("Error: {}", stderr);
            }
        }
        Err(e) => result = format!("Failed to execute '{}': {}", command, e),
    }
    result
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
            CREATE TABLE NODES (id varchar(500),FLOWID varchar(500),type TEXT,data JSON,targetPosition TEXT,sourcePosition TEXT,position JSON,FOREIGN KEY (FLOWID) REFERENCES FLOWS(ID) ON DELETE CASCADE);
            CREATE TABLE EDGES (id varchar(500),FLOWID varchar(500),target varchar(500),source varchar(500), FOREIGN KEY (FLOWID) REFERENCES FLOWS(ID) ON DELETE CASCADE);
            CREATE TABLE USERS (ID varchar(500) PRIMARY KEY, NAME TEXT);",
            kind: MigrationKind::Up,
        },
    ];
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            execute_command,
            download,
            upload_file
        ])
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
