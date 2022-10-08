import React from 'react'
import Tooltip from '@reach/tooltip'
import { FaSearch } from 'react-icons/fa'
import { Input, BookListUL, Spinner } from '@/components/lib'
import { BookRow } from '@/components/BookRow'
// 🐨 import the client from './utils/api-client'

const DiscoverBooks: React.FC = () => {
  // 🐨 add state for status ('idle', 'loading', or 'success'), data, and query
  const [query, setQuery] = React.useState('')
  const [queried, setQueried] = React.useState(false)
  const data = null // 💣 remove this, it's just here so the example doesn't explode
  // 🐨 you'll also notice that we don't want to run the search until the
  // user has submitted the form, so you'll need a boolean for that as well
  // 💰 I called it "queried"

  // 🐨 Add a useEffect callback here for making the request with the
  // client and updating the status and data.
  React.useEffect(() => {
    if (!queried) return
    window
      .fetch(
        `${import.meta.env.VITE_API_URL}/books?query=${encodeURIComponent(
          query,
        )}`,
      )
      .then((response) => {
        console.log(response)
      })
  }, [query, queried])
  // 💰 Here's the endpoint you'll call: `books?query=${encodeURIComponent(query)}`
  // 🐨 remember, effect callbacks are called on the initial render too
  // so you'll want to check if the user has submitted the form yet and if
  // they haven't then return early (💰 this is what the queried state is for).

  // 🐨 replace these with derived state values based on the status.
  const isLoading = false
  const isSuccess = false

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
              {isLoading ? <Spinner /> : <FaSearch aria-label="search" />}
            </button>
          </label>
        </Tooltip>
      </form>

      {/* {isSuccess ? (
        data?.books?.length ? (
          <BookListUL css={{ marginTop: 20 }}>
            {data.books.map((book) => (
              <li key={book.id} aria-label={book.title}>
                <BookRow key={book.id} book={book} />
              </li>
            ))}
          </BookListUL>
        ) : (
          <p>No books found. Try another search.</p>
        )
      ) : null} */}
    </div>
  )
}

export { DiscoverBooks }
