import React, { useEffect } from 'react'
import Tooltip from '@reach/tooltip'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { Input, BookListUL, Spinner } from '@/components/lib'
import { BookRow } from '@/components/BookRow'
import * as colors from '@/styles/colors'
import { useRefetchBookSearchQuery, useBooksSearch } from '@/utils/books'
import { Profiler } from '@/components/Profiler'

const DiscoverBooksScreen: React.FC = () => {
  const [query, setQuery] = React.useState('')
  const [, setQueried] = React.useState(false)
  const { books, error, isLoading, isError } = useBooksSearch(query)
  const refetchBookSearchQuery = useRefetchBookSearchQuery()

  useEffect(() => {
    return () => {
      refetchBookSearchQuery()
    }
  }, [refetchBookSearchQuery])

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault()

    const target = event.target as typeof event.target & {
      search: { value: string }
    }
    setQuery(target.search.value)
    setQueried(true)
  }

  return (
    <div
      css={{ maxWidth: 800, margin: 'auto', width: '90vw', padding: '40px 0' }}
    >
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Search books..."
          id="search"
          css={{ width: '100%' }}
        />
        <Tooltip label="Search Books">
          <label htmlFor="search">
            <button
              type="submit"
              css={{
                border: '0',
                position: 'relative',
                marginLeft: '-35px',
                background: 'transparent',
              }}
            >
              {isLoading ? (
                <Spinner />
              ) : isError ? (
                <FaTimes aria-label="error" css={{ color: colors.danger }} />
              ) : (
                <FaSearch aria-label="search" />
              )}
            </button>
          </label>
        </Tooltip>
      </form>
      {isError && error ? (
        <div css={{ color: colors.danger }}>
          <p>There was an error:</p>
          <pre>{error.message}</pre>
        </div>
      ) : null}
      {books?.length ? (
        <Profiler
          id="Discover Books Screen Book List"
          metadata={{ query, bookCount: books.length }}
        >
          <BookListUL css={{ marginTop: 20 }}>
            {books.map((book) => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        </Profiler>
      ) : (
        <p>No books found. Try another search.</p>
      )}
    </div>
  )
}

export { DiscoverBooksScreen }
