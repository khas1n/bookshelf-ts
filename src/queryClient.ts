import { QueryClient } from '@tanstack/react-query'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const errorCast = error as { status: number }
        console.log('errorCast: ', errorCast)
        if (errorCast.status === 404) return false
        else if (failureCount < 2) return true
        else return false
      },
    },
  },
})
const queryCache = queryClient.getQueryCache()

export { queryClient, queryCache }
