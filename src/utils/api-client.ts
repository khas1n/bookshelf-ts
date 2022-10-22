import * as auth from '@/auth-provider'
import { queryCache } from '@/queryClient'
interface CustomConfig extends RequestInit {
  token?: string
  data?: object
}
type ClientType = <T>(
  endpoint: string,
  customConfig?: CustomConfig,
) => Promise<T>

const client: ClientType = async (
  endpoint: string,
  { data, token, headers: customHeaders, ...customConfig } = {},
) => {
  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    ...(data && { body: JSON.stringify(data) }),
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(data && { 'Content-Type': 'application/json' }),
      ...customHeaders,
    },
    ...customConfig,
  }

  return window
    .fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        queryCache.clear()
        await auth.logout()
        // refresh the page for them
        window.location.assign(window.location.toString())
        return Promise.reject({ message: 'Please re-authenticate.' })
      }
      const data = await response.json()
      if (response.ok) {
        return data
      } else {
        return Promise.reject(data)
      }
    })
}

export { client }
