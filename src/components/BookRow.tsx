import * as mq from '@/styles/media-queries'
import * as colors from '@/styles/colors'
import { Book } from '@/types/book'
import { Link } from 'react-router-dom'
import { StatusButtons } from './StatusButton'
import { User } from '@/types/user'
import { List } from '@/types/list'
import { client } from '@/utils/api-client'
import { useQuery } from 'react-query'
import { Rating } from './Rating'

interface BookRowProps {
  book: Book
  user: User
}
const BookRow: React.FC<BookRowProps> = ({ book, user }) => {
  const { title, author, coverImageUrl } = book
  const { data: listItems } = useQuery<List[]>({
    queryKey: 'lists-items',
    queryFn: () =>
      client<{ listItems: List[] }>('list-items', { token: user.token }).then(
        (data) => data.listItems,
      ),
  })
  const listItem: List | null =
    listItems?.find((li) => li.bookId === book.id) ?? null
  const id = `book-row-book-${book.id}`

  return (
    <div
      css={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
      }}
    >
      <Link
        to={`/book/${book.id}`}
        aria-labelledby={id}
        css={{
          minHeight: 270,
          flexGrow: 2,
          display: 'grid',
          gridTemplateColumns: '140px 1fr',
          gridGap: 20,
          border: `1px solid ${colors.gray20}`,
          color: colors.text,
          padding: '1.25em',
          borderRadius: '3px',
          ':hover,:focus': {
            textDecoration: 'none',
            boxShadow: '0 5px 15px -5px rgba(0,0,0,.08)',
            color: 'inherit',
          },
        }}
      >
        <div
          css={{
            width: 140,
            [mq.small]: {
              width: 100,
            },
          }}
        >
          <img
            src={coverImageUrl}
            alt={`${title} book cover`}
            css={{ maxHeight: '100%', width: '100%' }}
          />
        </div>
        <div css={{ flex: 1 }}>
          <div css={{ display: 'flex', justifyContent: 'space-between' }}>
            <div css={{ flex: 1 }}>
              <h2
                id={id}
                css={{
                  fontSize: '1.25em',
                  margin: '0',
                  color: colors.indigo,
                }}
              >
                {title}
              </h2>
              {listItem?.finishDate ? (
                <Rating user={user} listItem={listItem} />
              ) : null}
            </div>
            <div css={{ marginLeft: 10 }}>
              <div
                css={{
                  marginTop: '0.4em',
                  fontStyle: 'italic',
                  fontSize: '0.85em',
                }}
              >
                {author}
              </div>
              <small>{book.publisher}</small>
            </div>
          </div>
          <small css={{ whiteSpace: 'break-spaces', display: 'block' }}>
            {book.synopsis.substring(0, 500)}...
          </small>
        </div>
      </Link>
      <div
        css={{
          marginLeft: '20px',
          position: 'absolute',
          right: -20,
          color: colors.gray80,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          height: '100%',
        }}
      >
        <StatusButtons user={user} book={book} />
      </div>
    </div>
  )
}

export { BookRow }
