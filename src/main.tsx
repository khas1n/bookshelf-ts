import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'
import './bootstrap'
import { AppProviders } from './context'
import { Profiler } from './components/Profiler'

// @ts-expect-error : this is for mock server
await import('./test/server/index.js')
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Profiler id="App Root" phases={['mount']}>
      <AppProviders>
        <App />
      </AppProviders>
    </Profiler>
  </React.StrictMode>,
)
