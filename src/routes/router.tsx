import { createHashRouter } from 'react-router'
import { App, Home } from '@renderer/pages'


const router = createHashRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: Home }
    ]
  }
])

export default router
