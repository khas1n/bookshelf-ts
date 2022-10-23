import React from 'react'
import Tooltip from '@reach/tooltip'
import * as mq from '@/styles/media-queries'
import * as colors from '@/styles/colors'
import { User } from '@/types/user'
import { Navigate, useParams } from 'react-router-dom'
import { StatusButtons } from '@/components/StatusButton'
import { List } from '@/types/list'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { formatDate } from '@/utils/misc'
import debounceFn from 'debounce-fn'
import { ErrorMessage, Spinner, Textarea } from '@/components/lib'
import { Rating } from '@/components/Rating'
import { useBook } from '@/utils/books'
import { useListItem, useUpdateListItem } from '@/utils/list-items'

const BookScreen: React.FC = () => {
  const { bookId } = useParams()
  const book = useBook(bookId)

  const listItem = useListItem(bookId)

  const { title, author, coverImageUrl, publisher, synopsis } = book

  if (!bookId) {
    return <Navigate to="/discover" />
  }
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
              {book.id !== undefined && <StatusButtons book={book} />}
            </div>
          </div>
          <div css={{ marginTop: 10, height: 46 }}>
            {listItem.id !== undefined && listItem.finishDate && (
              <Rating listItem={listItem} />
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
        <NotesTextarea listItem={listItem} />
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

const NotesTextarea: React.FC<{ listItem: List }> = ({ listItem }) => {
  const { mutateAsync: mutate, isError, error, isLoading } = useUpdateListItem()
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
        {isError ? (
          <ErrorMessage
            error={error}
            variant="inline"
            css={{ marginLeft: 6, fontSize: '0.7em' }}
          />
        ) : null}
        {isLoading && <Spinner />}
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
