import '@unocss/reset/normalize.css'
import '@shared/styles/global.less'
import 'virtual:uno.css'


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { setupDevInvoke } from '@utils/tauri-invoke-api';
import { router } from './router'

// 调试时，注册 Tauri API 并连接中转 HTTP 服务器
setupDevInvoke()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={ router } />
  </StrictMode>
)
