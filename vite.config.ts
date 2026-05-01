import { defineConfig } from 'vite'
import { resolve } from 'path'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import babel from '@rolldown/plugin-babel'

// 获取自定义的 host
const host = process.env.TAURI_DEV_HOST;

// https://cn.vite.dev/config/
export default defineConfig({
  plugins: [
    // 动态加载 「react devtools 独立版」所需的脚本
    {
      name: 'inject-react-devtools',
      transformIndexHtml(html) {
        if (process.env.VITE_REACT_DEVTOOLS) {
          return [
            {
              tag: 'script',
              attrs: { src: 'http://localhost:8097' },
              injectTo: 'head-prepend', // 确保在 React 加载前执行
            },
          ];
        }
        return html;
      },
    },
    UnoCSS(),
    react(),
    babel({
      presets: [ reactCompilerPreset() ]
    })
  ],
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'dashesOnly',
      generateScopedName: '[local]-[hash:5]'
    }
  },
  resolve: {
    alias: {
      '@renderer': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@utils': resolve(__dirname, './src/utils'),
      '@shared': resolve(__dirname, './src/shared'),
      '@hooks': resolve(__dirname, './src/hooks')
    }
  },

  // 为 Tauri 开发量身定制的 Vite 选项，仅在 `tauri dev` 或 `tauri build` 时应用
  //
  // 防止 Vite 清除 Rust 显示的错误
  clearScreen: false,
  server: {
    port: 1420,
    // Tauri 工作于固定端口，如果端口不可用则报错
    strictPort: true,
    // 如果设置了 host，Tauri 则会使用
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell Vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  // 添加有关当前构建目标的额外前缀，使这些 CLI 设置的 Tauri 环境变量可以在客户端代码中访问
  envPrefix: ['VITE_', 'TAURI_ENV_'],
  build: {
    // Tauri 在 Windows 上使用 Chromium，在 macOS 和 Linux 上使用 WebKit
    target:
      process.env.TAURI_ENV_PLATFORM == 'windows'
        ? 'chrome105'
        : 'safari13',
    // 在 debug 构建中不使用 minify
    minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
    // 在 debug 构建中生成 sourcemap
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
});
