import React from 'react'
import { FullPageSpinner } from './components/lib'

import { useAuth } from './context/auth-context'

// Vite doesn't support prefetch script yet, so we have to use native dynamic import
// to load the code split chunk (AuthenticatedApp).
await import('@/AuthenticatedApp')
const UnauthenticatedApp = React.lazy(() => import('@/UnauthenticatedApp'))
const AuthenticatedApp = React.lazy(() => import('@/AuthenticatedApp'))

const App = () => {
  const { user } = useAuth()
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  )
}

export default App
