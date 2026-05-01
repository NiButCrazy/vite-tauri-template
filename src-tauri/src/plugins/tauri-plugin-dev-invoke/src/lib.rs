// 防止打包时一堆警告
#![allow(unused)]

mod server;

use tauri::{plugin::Builder, AppHandle, Runtime};

pub fn init<R: Runtime>() -> tauri::plugin::TauriPlugin<R> {
    Builder::new("dev-invoke")
        .setup(|app, _| {
            #[cfg(debug_assertions)]
            if std::env::var("TAURI_ENV_WEB_INVOKE").is_ok(){
                let invoke_key = app.invoke_key().to_string();
                let app_handle: AppHandle<R> = app.clone();

                // Start the HTTP server in a separate thread
                // It will wait for a webview to become available
                std::thread::spawn(move || {
                    server::start(app_handle, invoke_key, 3030);
                });
            }

            Ok(())
        })
        .build()
}