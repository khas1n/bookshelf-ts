import { queryClient } from '@/queryClient'
import { Book } from '@/types/book'
import { useQuery } from '@tanstack/react-query'
import bookPlaceholderSvg from '@/assets/book-placeholder.svg'
import { useAuth, useClient } from '@/context/auth-context'
import { client as apiClient } from '@/utils/api-client'
import { useCallback } from 'react'

const loadingBook: Omit<Book, 'id'> & {
  loadingBook: boolean
  id: undefined
} = {
  id: undefined,
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
  pageCount: 0,
}
type UseQueryBookParameters = Parameters<typeof useQuery<Book[], Error>>

const getBookSearchConfig = (
  query: string,
  client: typeof apiClient<{ books: Book[] }>,
): UseQueryBookParameters => [
  ['bookSearch', query],
  () =>
    client(`books?query=${encodeURIComponent(query)}`).then(
      (data) => data.books,
    ),
  {
    onSuccess(data) {
      data.forEach(setQueryDataForBook)
    },
  },
]
const loadingBooks: Book[] = Array.from({ length: 10 }, (_v, index) => ({
  ...loadingBook,
  id: `loading-book-${index}`,
}))

const useBooksSearch = (query: string) => {
  const client = useClient<{ books: Book[] }>()
  const result = useQuery<Book[], Error>(...getBookSearchConfig(query, client))

  return { ...result, books: result.data ?? loadingBooks }
}

const useBook = (bookId: string | undefined) => {
  const client = useClient<{ book: Book }>()
  const { data } = useQuery<Book, Error>(['bookId', bookId], () =>
    client(`books/${bookId}`).then((data) => data.book),
  )

  return data ?? loadingBook
}

const useRefetchBookSearchQuery = () => {
  const client = useClient<{ books: Book[] }>()
  return useCallback(async () => {
    queryClient.removeQueries(['bookSearch'])
    await queryClient.prefetchQuery(...getBookSearchConfig('', client))
  }, [client])
}
const setQueryDataForBook = (book: Book) => {
  queryClient.setQueryData<Book>(['bookId', book.id], book)
}

export {
  useBooksSearch,
  useBook,
  useRefetchBookSearchQuery,
  setQueryDataForBook,
}
