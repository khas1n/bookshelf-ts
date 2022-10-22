import React from 'react'
import * as auth from '@/auth-provider'
import * as colors from '@/styles/colors'
import { LoginFormField, User } from '@/types/user'
import { client } from '@/utils/api-client'
import { BrowserRouter as Router } from 'react-router-dom'
import { UnauthenticatedApp } from '@/UnauthenticatedApp'
import { AuthenticatedApp } from '@/AuthenticatedApp'
import { useAsync } from './utils/hooks'
import { FullPageSpinner } from './components/lib'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryCache, queryClient } from './queryClient'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const getUser = async () => {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client<{ user: User }>('me', { token })
    user = data.user
  }

  return user
}

const App = () => {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    setData,
  } = useAsync<User | null>()

  React.useEffect(() => {
    getUser().then((user) => setData(user))
  }, [])

  const login = (formData: LoginFormField): Promise<void> =>
    auth.login(formData).then((user) => {
      setData(user)
    })
  const register = (formData: LoginFormField): Promise<void> =>
    auth.register(formData).then((user) => {
      setData(user)
    })
  const logout = () => {
    auth.logout()
    queryCache.clear()
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }
  if (isError) {
    return (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        {error && <pre>{error.message}</pre>}
      </div>
    )
  }
  if (isSuccess) {
    return user ? (
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthenticatedApp user={user} logout={logout} />
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    ) : (
      <UnauthenticatedApp login={login} register={register} />
    )
  }
  return null
}

export default App
