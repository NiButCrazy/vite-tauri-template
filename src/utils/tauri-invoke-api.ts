declare global {
  interface Window {
    __TAURI_INTERNALS__?: {
      invoke: <T>(cmd: string, args?: Record<string, unknown>) => Promise<T>;
    };
  }
}

/**
* 在应用程序启动时调用一次，以便在外部浏览器中启用 invoke()。
* 在 Tauri 网络视图中，此操作无效。
*/
export function setupDevInvoke(httpEndpoint = "http://localhost:3030") {

  if (!import.meta.env.TAURI_ENV_WEB_INVOKE) {
    return;
  }
  // 如果处于 Tauri 的 Webview 中，那就什么都别做
  if (window.__TAURI_INTERNALS__) {
    console.log("[dev-invoke] 运行于 Tauri 网络视图，无需注入 API");
    return;
  }

  console.log("[dev-invoke] 运行于外部浏览器，已注入 __TAURI_INTERNALS__");

  // 创建一个路由到 HTTP 服务器的模拟 __TAURI_INTERNALS__
  window.__TAURI_INTERNALS__ = {
    invoke: async <T>(cmd: string, args: Record<string, unknown> = {}): Promise<T> => {
      console.log(`[dev-invoke] HTTP 调用: ${cmd}`);

      const response = await fetch(httpEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cmd, args }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return response.json();
    },
  };
}