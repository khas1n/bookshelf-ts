import React from 'react'

enum Status {
  Idle,
  Pending,
  Rejected,
  Resolved,
}

const useSafeDispatch = <S>(dispatch: React.Dispatch<Partial<S>>) => {
  const mounted = React.useRef(false)
  React.useLayoutEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])
  return React.useCallback<(x: Partial<S>) => void>(
    (...args) => {
      return mounted.current ? dispatch(...args) : void 0
    },
    [dispatch],
  )
}

// Example usage:
// const {data, error, status, run} = useAsync()
// React.useEffect(() => {
//   run(fetchPokemon(pokemonName))
// }, [pokemonName, run])
interface AsyncState<T> {
  status: Status
  data: T | null
  error: Error | null
}
const defaultInitialState: AsyncState<never> = {
  status: Status.Idle,
  data: null,
  error: null,
}
const useAsync = <T>(initialState: AsyncState<T> = defaultInitialState) => {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  })
  const [{ status, data, error }, setState] = React.useReducer(
    (s: AsyncState<T>, a: Partial<AsyncState<T>>): AsyncState<T> => ({
      ...s,
      ...a,
    }),
    initialStateRef.current,
  )

  const safeSetState = useSafeDispatch<AsyncState<T>>(setState)

  const setData = React.useCallback(
    (data: T) => safeSetState({ data: data, status: Status.Resolved }),
    [safeSetState],
  )
  const setError = React.useCallback(
    (error: Error) => safeSetState({ error, status: Status.Rejected }),
    [safeSetState],
  )
  const reset = React.useCallback(
    () => safeSetState(initialStateRef.current),
    [safeSetState],
  )

  const run = React.useCallback(
    (promise: Promise<T>) => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`,
        )
      }
      safeSetState({ status: Status.Pending })
      return promise.then(
        (data: T) => {
          setData(data)
          return data
        },
        (error: Error) => {
          setError(error)
          return Promise.reject(error)
        },
      )
    },
    [safeSetState, setData, setError],
  )

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === Status.Idle,
    isLoading: status === Status.Pending,
    isError: status === Status.Rejected,
    isSuccess: status === Status.Resolved,

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  }
}

export { useAsync }
