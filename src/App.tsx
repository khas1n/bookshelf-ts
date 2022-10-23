import React from 'react'

import { UnauthenticatedApp } from '@/UnauthenticatedApp'
import { AuthenticatedApp } from '@/AuthenticatedApp'

import { useAuth } from './context/auth-context'

const App = () => {
  const { user } = useAuth()
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />
}

export default App
