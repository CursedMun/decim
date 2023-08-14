// Prevents additional console window on Windows in release
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use tauri::Manager;
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    // Show main window
    window.get_window("main").unwrap().show().unwrap();
}

fn main() {
    let tray_menu = SystemTrayMenu::new()
        .add_item(CustomMenuItem::new("hide", "Hide"))
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit", "Quit"));

    tauri::Builder::default()
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::Resized(result) => {
                if event.window().is_visible().unwrap() {
                    if result.width <= 160 && result.height <= 28 {
                        event.window().hide().unwrap();
                    }
                }
            }
            _ => {}
        })
        .system_tray(SystemTray::new().with_menu(tray_menu))
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();

                if !window.is_visible().unwrap() {
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
            }
            SystemTrayEvent::RightClick {
                position: _,
                size: _,
                ..
            } => {
                println!("system tray received a right click");
            }
            SystemTrayEvent::DoubleClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();

                if !window.is_visible().unwrap() {
                    window.show().unwrap();
                }
            }

            SystemTrayEvent::MenuItemClick { id, .. } => {
                let item_handle = app.tray_handle().get_item(&id);

                println!("{}", id.as_str());
                match id.as_str() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "hide" => {
                        let window = app.get_window("main").unwrap();
                        if window.is_visible().unwrap() {
                            window.hide().unwrap();
                            item_handle.set_title("Show").unwrap();
                        } else {
                            window.show().unwrap();
                            item_handle.set_title("Hide").unwrap();
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![greet])
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_window::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![close_splashscreen])
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }
            Ok(())
        }) // .on_window_event(|event| match event.event() {
        // tauri::WindowEvent::Min { api, .. } => {
        //     println!("Received close request, preventing.");
        //     event.window().hide().unwrap();
        //     api.prevent_close();
        // }
        // _ => {}
        // })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
