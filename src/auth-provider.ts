// pretend this is firebase, netlify, or auth0's code.
// you shouldn't have to implement something like this in your own app

import { LoginFormField, User } from './types/user'

const localStorageKey = '__auth_provider_token__'

const getToken = async () => {
  // if we were a real auth provider, this is where we would make a request
  // to retrieve the user's token. (It's a bit more complicated than that...
  // but you're probably not an auth provider so you don't need to worry about it).
  return window.localStorage.getItem(localStorageKey)
}

type HandleUserResponse = (args: { user: User }) => User

const handleUserResponse: HandleUserResponse = ({ user }) => {
  window.localStorage.setItem(localStorageKey, user.token)
  return user
}

const login: (formData: LoginFormField) => Promise<User> = async ({
  username,
  password,
}) => {
  const data = await client('login', { username, password })
  return handleUserResponse(data)
}

const register: (formData: LoginFormField) => Promise<User> = async ({
  username,
  password,
}) => {
  const data = await client('register', { username, password })
  return handleUserResponse(data)
}

const logout = async () => {
  window.localStorage.removeItem(localStorageKey)
}

// an auth provider wouldn't use your client, they'd have their own
// so that's why we're not just re-using the client
const authURL = import.meta.env.VITE_AUTH_URL
type AuthProviderClient = (
  endpoint: string,
  data: LoginFormField,
) => Promise<{ user: User }>

const client: AuthProviderClient = (endpoint, data) => {
  const config = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  }

  return window
    .fetch(`${authURL}/${endpoint}`, config)
    .then(async (response) => {
      const data = await response.json()
      if (response.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
}

export { getToken, login, register, logout, localStorageKey }
