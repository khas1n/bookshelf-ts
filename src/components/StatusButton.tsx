import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
  FaTimesCircle,
} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import React from 'react'
// 🐨 you'll need useQuery, useMutation, and queryCache from 'react-query'
// 🐨 you'll also need client from 'utils/api-client'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { client } from '@/utils/api-client'
import { useAsync } from '@/utils/hooks'
import * as colors from '@/styles/colors'
import { CircleButton, Spinner } from './lib'
import { Book } from '@/types/book'
import { User } from '@/types/user'
import { List } from '@/types/list'

interface TooltipButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: string
  highlight: string
  icon: React.ReactElement<React.SVGProps<SVGAElement>>
  onClick?: () => Promise<List>
}

interface StatusButtonsProps {
  user: User
  book: Book
}

const TooltipButton: React.FC<TooltipButtonProps> = ({
  label,
  highlight,
  onClick,
  icon,
  ...rest
}) => {
  const { isLoading, isError, error, run } = useAsync<List>()

  const handleClick = () => {
    onClick && run(onClick())
  }

  return (
    <Tooltip label={isError && error ? error.message : label}>
      <CircleButton
        css={{
          backgroundColor: 'white',
          ':hover,:focus': {
            color: isLoading
              ? colors.gray80
              : isError
              ? colors.danger
              : highlight,
          },
        }}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={isError && error ? error.message : label}
        {...rest}
      >
        {isLoading ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  )
}

const StatusButtons: React.FC<StatusButtonsProps> = ({ user, book }) => {
  const queryClient = useQueryClient()
  const { data: listItems } = useQuery<List[]>({
    queryKey: 'lists-items',
    queryFn: () =>
      client<{ listItems: List[] }>('list-items', { token: user.token }).then(
        (data) => data.listItems,
      ),
  })
  const listItem: List | null =
    listItems?.find((li) => li.bookId === book.id) ?? null

  const { mutateAsync: update } = useMutation<List, Error, Partial<List>>(
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

  const { mutateAsync: remove } = useMutation<List, Error, { listId: string }>(
    ({ listId }) =>
      client(`list-items/${listId}`, { method: 'DELETE', token: user.token }),
    {
      onSettled: () => {
        queryClient.invalidateQueries('lists-items')
      },
    },
  )
  const { mutateAsync: create } = useMutation<List, Error, { bookId: string }>(
    ({ bookId }) =>
      client(`list-items`, { data: { bookId }, token: user.token }),
    {
      onSettled: () => {
        queryClient.invalidateQueries('lists-items')
      },
    },
  )
  return (
    <React.Fragment>
      {listItem ? (
        listItem['finishDate'] ? (
          <TooltipButton
            label="Unmark as read"
            highlight={colors.yellow}
            onClick={() => update({ id: listItem.id, finishDate: null })}
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            label="Mark as read"
            highlight={colors.green}
            onClick={() => update({ id: listItem.id, finishDate: Date.now() })}
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          highlight={colors.danger}
          onClick={() => remove({ listId: listItem.id })}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={colors.indigo}
          onClick={() => create({ bookId: book.id })}
          // 🐨 add an onClick here that calls create
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  )
}

export { StatusButtons }
