// 中文文档 https://tauri.org.cn/
// 详情请见 https://tauri.app/zh-cn/develop/calling-rust/
use tauri::webview::WebviewWindowBuilder;
use tauri_specta::{collect_commands, Builder};

#[tauri::command]
#[specta::specta] // <- 这个注释必须加
/// 用于向前端返回计数器数据
///
/// @param count 输入的数字
 fn greet(count: i32) -> String {
    format!("你好 Rust！后台计数器为 {}", count)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // invoke 绑定器
    let builder = Builder::<tauri::Wry>::new()
        // 收集所需的命令
        .commands(collect_commands![greet,]);

    #[cfg(debug_assertions)]
    {
        // Typescript 类型导出
        use specta_typescript::Typescript;
        builder
            .export(Typescript::default(), "../src/utils/command.ts")
            .expect("Failed to export typescript bindings");
    }
    

    tauri::Builder::default() 
        // 打开文件或者链接
        .plugin(tauri_plugin_opener::init())
        // 允许外部浏览器通过 HTTP 调用 Tauri 命令
        .plugin(tauri_plugin_dev_invoke::init())
        .setup(|app| {
            // 由于 create 设置为 false，则需要手动从配置中创建窗口
            let handle = app.handle();
            let config = app.config();
            let main_window_config = &config.app.windows[0]; // 获取配置里的第一个窗口定义

            // 加载扩展仅限 windows 平台！
            #[cfg(debug_assertions)]
            {
                use ::tauri::Manager;
                // 检测是否为 pnpm tauri:dev 模式，这将启动默认窗口来连接 react devtools 独立版
                let is_react_devtools = std::env::var("VITE_REACT_DEVTOOLS").is_ok();
                // 检测是否为 pnpm tauri:web 模式，这将在浏览器中注册 Tauri API
                let is_web_invoke = std::env::var("TAURI_ENV_WEB_INVOKE").is_ok();
                // 检测是否为 pnpm tauri:ext 模式，这将使 webview2 加载 react devtools 扩展
                let is_extension = std::env::var("TAURI_ENV_EXTENSION").is_ok();

                if is_extension {
                    // 开发模式下 webview 使用自定义数据目录，否则无法加载扩展
                    let data_path = app.path().app_data_dir().unwrap().join(".dev");
                    // 指定加载扩展的根路径
                    let ext_path = std::env::current_dir().unwrap().join("extensions");
                    // 创建具备加载扩展能力的窗口
                    // 注意：创建完窗口后需要手动刷新一次页面才能正常显示扩展，和 electron 一样吃大份
                    WebviewWindowBuilder::from_config(handle, main_window_config)?
                        .data_directory(data_path)
                        .browser_extensions_enabled(true)
                        .extensions_path(ext_path)
                        .build()?
                        .open_devtools();
                } else {
                    // 无加载扩展的默认窗口
                    let webview = WebviewWindowBuilder::from_config(handle, main_window_config)?.build()?;
                    if is_react_devtools {webview.open_devtools();}
                    if is_web_invoke {webview.minimize()?;}
                }
            }

            // 生产模式下正常的窗口
            #[cfg(not(debug_assertions))]
            WebviewWindowBuilder::from_config(handle, main_window_config)?.build()?;

            Ok(())
        })
        .invoke_handler(builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("在运行 Tauri 应用进程时出现了错误");
}
