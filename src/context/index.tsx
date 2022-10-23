import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/queryClient'
import { BrowserRouter as Router } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from './auth-context'

const AppProviders: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>{children}</Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export { AppProviders }
