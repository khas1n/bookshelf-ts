import { User, LoginFormField } from '@/types/user'
import { client } from '@/utils/api-client'
import React from 'react'
import * as auth from '@/auth-provider'
import { FullPageSpinner, FullPageErrorFallback } from '@/components/lib'
import { queryCache } from '@/queryClient'
import { useAsync } from '@/utils/hooks'

interface AuthContextValue {
  user: User | null
  login: (formData: LoginFormField) => Promise<void>
  register: (formData: LoginFormField) => Promise<void>
  logout: () => void
}

interface AuthContextValueIsAuthenticated extends AuthContextValue {
  user: NonNullable<User>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)
AuthContext.displayName = 'AuthContext'

const getUser = async () => {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client<{ user: User }>('me', { token })
    user = data.user
  }

  return user
}

const AuthProvider: React.FC<React.HTMLAttributes<HTMLDivElement>> = (
  props,
) => {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    setData,
    status,
  } = useAsync<User | null>()

  React.useEffect(() => {
    getUser().then((user) => setData(user))
  }, [])

  const login = React.useCallback(
    (formData: LoginFormField): Promise<void> =>
      auth.login(formData).then((user) => {
        setData(user)
      }),
    [setData],
  )
  const register = React.useCallback(
    (formData: LoginFormField): Promise<void> =>
      auth.register(formData).then((user) => {
        setData(user)
      }),
    [setData],
  )
  const logout = React.useCallback(() => {
    auth.logout()
    queryCache.clear()
    setData(null)
  }, [setData])
  const contextValue = React.useMemo(
    () => ({
      user,
      login,
      register,
      logout,
    }),
    [user, login, register, logout],
  )

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }
  if (isError) {
    return <FullPageErrorFallback error={error ?? new Error()} />
  }
  if (isSuccess) {
    return <AuthContext.Provider value={contextValue} {...props} />
  }
  throw new Error(`Unhandled status: ${status}`)
}

const useAuth = (props = { isAuthenticated: true }) => {
  const context = React.useContext(AuthContext)
  if (context === undefined || context === null) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context as AuthContextValueIsAuthenticated
}

const useClient = <T,>() => {
  const {
    user: { token },
  } = useAuth()
  return React.useCallback<typeof client<T>>(
    (endpoint, config) => client<T>(endpoint, { ...config, token }),
    [token],
  )
}

export { AuthContext, useAuth, AuthProvider, useClient }
