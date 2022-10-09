import React from 'react'
// we need to get the "bookId" param from the router
// 🐨 import the useParams hook from 'react-router-dom'
import { client } from '@/utils/api-client'
import * as mq from '@/styles/media-queries'
import { useAsync } from '@/utils/hooks'
import bookPlaceholderSvg from '@/assets/book-placeholder.svg'
import { Book } from '@/types/book'
import { User } from '@/types/user'
import { useParams } from 'react-router-dom'

const loadingBook: Omit<Book, 'id' | 'pageCount'> & { loadingBook: boolean } = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

interface BookProps {
  user: User
}

const BookScreen: React.FC<BookProps> = ({ user }) => {
  const { bookId } = useParams()
  const { data, run } = useAsync<{ book: Book }>()

  React.useEffect(() => {
    run(client(`books/${bookId}`, { token: user.token }))
  }, [run, bookId, user.token])

  const { title, author, coverImageUrl, publisher, synopsis } =
    data?.book ?? loadingBook

  return (
    <div>
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gridGap: '2em',
          marginBottom: '1em',
          [mq.small]: {
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <img
          src={coverImageUrl}
          alt={`${title} book cover`}
          css={{ width: '100%', maxWidth: '14rem' }}
        />
        <div>
          <div css={{ display: 'flex', position: 'relative' }}>
            <div css={{ flex: 1, justifyContent: 'space-between' }}>
              <h1>{title}</h1>
              <div>
                <i>{author}</i>
                <span css={{ marginRight: 6, marginLeft: 6 }}>|</span>
                <i>{publisher}</i>
              </div>
            </div>
          </div>
          <br />
          <p>{synopsis}</p>
        </div>
      </div>
    </div>
  )
}

export { BookScreen }
