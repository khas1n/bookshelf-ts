import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import './bootstrap'
import { AppProviders } from './context'

// @ts-expect-error : this is for mock server
await import('./test/server/index.js')
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
)
