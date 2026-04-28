// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::{ is_dev, Manager, webview::WebviewWindowBuilder};

#[tauri::command]
fn greet(count: i32) -> String {
    format!("你好 Rust！后台计数器为 {}", count)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // 由于 create 设置为 false，则需要手动从配置中创建窗口
            let handle = app.handle();
            let config = app.config();
            let main_window_config = &config.app.windows[0]; // 获取配置里的第一个窗口定义

            // 检测是否为 pnpm dev+ 模式，这将启动默认窗口来连接 react devtools 独立版
            let is_dev_plus = std::env::var("TAURI_DEVTOOLS").is_ok();

            // 加载扩展仅限 windows 平台！
            if is_dev() && !is_dev_plus {
                // 开发模式下 webview 使用自定义数据目录，否则无法加载扩展
                let data_path = app.path().app_data_dir().unwrap().join(".dev");
                // 指定加载扩展的根路径
                let ext_path = std::env::current_dir().unwrap().join("extensions");

                // 创建具备加载扩展能力的窗口
                WebviewWindowBuilder::from_config(handle, main_window_config)?
                    .data_directory(data_path)
                    .browser_extensions_enabled(true)
                    .extensions_path(ext_path)
                    .build()?;
            }else {
                // 生产环境下使用默认窗口
                WebviewWindowBuilder::from_config(handle, main_window_config)?.build()?;
            }

            Ok(())
            
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("在运行 Tauri 应用进程时出现了错误");
}
