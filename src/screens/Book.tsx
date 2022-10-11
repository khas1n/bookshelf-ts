import React from 'react'
// we need to get the "bookId" param from the router
// 🐨 import the useParams hook from 'react-router-dom'
import { client } from '@/utils/api-client'
import Tooltip from '@reach/tooltip'
import * as mq from '@/styles/media-queries'
import * as colors from '@/styles/colors'
import { useAsync } from '@/utils/hooks'
import bookPlaceholderSvg from '@/assets/book-placeholder.svg'
import { Book } from '@/types/book'
import { User } from '@/types/user'
import { useParams } from 'react-router-dom'
import { StatusButtons } from '@/components/StatusButton'
import { List } from '@/types/list'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { formatDate } from '@/utils/misc'
import debounceFn from 'debounce-fn'
import { Textarea } from '@/components/lib'
import { Rating } from '@/components/Rating'
import { useMutation, useQuery, useQueryClient } from 'react-query'

const loadingBook: Omit<Book, 'id' | 'pageCount'> & {
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
}

interface BookProps {
  user: User
}

const BookScreen: React.FC<BookProps> = ({ user }) => {
  const { bookId } = useParams()

  const { data: book = loadingBook } = useQuery<Book>({
    queryKey: ['book', bookId],
    queryFn: () =>
      client<{ book: Book }>(`books/${bookId}`, { token: user.token }).then(
        (data) => data.book,
      ),
  })
  const { data: listItems } = useQuery<List[]>({
    queryKey: 'lists-items',
    queryFn: () =>
      client<{ listItems: List[] }>('list-items', { token: user.token }).then(
        (data) => data.listItems,
      ),
  })
  const listItem: List | { id: undefined } = (listItems &&
    listItems?.find((li) => li.bookId === book.id)) ?? { id: undefined }

  const { title, author, coverImageUrl, publisher, synopsis } = book

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
            <div
              css={{
                right: 0,
                color: colors.gray80,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                minHeight: 100,
              }}
            >
              {book.id !== undefined && (
                <StatusButtons user={user} book={book} />
              )}
            </div>
          </div>
          <div css={{ marginTop: 10, height: 46 }}>
            {listItem.id !== undefined && (
              <Rating user={user} listItem={listItem} />
            )}
            {listItem.id !== undefined ? (
              <ListItemTimeframe listItem={listItem} />
            ) : null}
          </div>
          <br />
          <p>{synopsis}</p>
        </div>
      </div>
      {book.id !== undefined && listItem.id !== undefined ? (
        <NotesTextarea user={user} listItem={listItem} />
      ) : null}
    </div>
  )
}
const ListItemTimeframe: React.FC<{ listItem: List }> = ({ listItem }) => {
  const timeframeLabel = listItem.finishDate
    ? 'Start and finish date'
    : 'Start date'

  return (
    <Tooltip label={timeframeLabel}>
      <div aria-label={timeframeLabel} css={{ marginTop: 6 }}>
        <FaRegCalendarAlt css={{ marginTop: -2, marginRight: 5 }} />
        <span>
          {formatDate(listItem.startDate)}{' '}
          {listItem.finishDate ? `— ${formatDate(listItem.finishDate)}` : null}
        </span>
      </div>
    </Tooltip>
  )
}

const NotesTextarea: React.FC<{ listItem: List; user: User }> = ({
  listItem,
  user,
}) => {
  const queryClient = useQueryClient()
  const { mutateAsync: mutate } = useMutation<List, Error, Partial<List>>(
    (updatedData) =>
      client(`list-items/${updatedData.id}`, {
        method: 'PUT',
        data: updatedData,
        token: user.token,
      }),
    {
      onSettled: () => {
        queryClient.invalidateQueries('lists-items')
      },
    },
  )
  const debouncedMutate = React.useMemo(
    () => debounceFn(mutate, { wait: 300 }),
    [mutate],
  )

  const handleNotesChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e,
  ) => {
    debouncedMutate({ id: listItem.id, notes: e.target.value })
  }

  return (
    <React.Fragment>
      <div>
        <label
          htmlFor="notes"
          css={{
            display: 'inline-block',
            marginRight: 10,
            marginTop: '0',
            marginBottom: '0.5rem',
            fontWeight: 'bold',
          }}
        >
          Notes
        </label>
      </div>
      <Textarea
        id="notes"
        defaultValue={listItem.notes}
        onChange={handleNotesChange}
        css={{ width: '100%', minHeight: 300 }}
      />
    </React.Fragment>
  )
}

export { BookScreen }
