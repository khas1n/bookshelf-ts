import * as auth from '@/auth-provider'
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

  const response = await window.fetch(
    `${import.meta.env.VITE_API_URL}/${endpoint}`,
    config,
  )
  if (response.status === 401) {
    await auth.logout()
    // refresh the page for them
    window.location.assign(window.location.toString())
    return Promise.reject({ message: 'Please re-authenticate.' })
  }
  const responseData = await response.json()
  if (response.ok) {
    return responseData
  } else {
    return Promise.reject(data)
  }
}

export { client }
