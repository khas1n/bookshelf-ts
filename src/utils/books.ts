import { queryClient } from '@/queryClient'
import { Book } from '@/types/book'
import { User } from '@/types/user'
import { useQuery } from '@tanstack/react-query'
import { client } from './api-client'
import bookPlaceholderSvg from '@/assets/book-placeholder.svg'

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
  user: User,
): UseQueryBookParameters => [
  ['bookSearch', query],
  () =>
    client<{ books: Book[] }>(`books?query=${encodeURIComponent(query)}`, {
      token: user.token,
    }).then((data) => data.books),
  {
    onSuccess(data) {
      data.forEach(setQueryDataForBook)
    },
  },
]
const loadingBooks: Book[] = Array.from({ length: 10 }, (v, index) => ({
  ...loadingBook,
  id: `loading-book-${index}`,
}))

const useBooksSearch = (query: string, user: User) => {
  const result = useQuery<Book[], Error>(...getBookSearchConfig(query, user))

  return { ...result, books: result.data ?? loadingBooks }
}

const useBook = (bookId: string | undefined, user: User) => {
  const { data } = useQuery<Book, Error>(['bookId', bookId], () =>
    client<{ book: Book }>(`books/${bookId}`, {
      token: user.token,
    }).then((data) => data.book),
  )

  return data ?? loadingBook
}

const refetchBookSearchQuery = (user: User) => {
  queryClient.removeQueries(['bookSearch'])
  queryClient.prefetchQuery(...getBookSearchConfig('', user))
}

const setQueryDataForBook = (book: Book) => {
  queryClient.setQueryData<Book>(['bookId', book.id], book)
}

export { useBooksSearch, useBook, refetchBookSearchQuery, setQueryDataForBook }
