import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
  FaTimesCircle,
} from 'react-icons/fa'
import Tooltip from '@reach/tooltip'
import React from 'react'

import { useAsync } from '@/utils/hooks'
import * as colors from '@/styles/colors'
import { CircleButton, Spinner } from './lib'
import { Book } from '@/types/book'
import { User } from '@/types/user'
import { List } from '@/types/list'
import {
  useCreateListItem,
  useListItem,
  useRemoveListItem,
  useUpdateListItem,
} from '@/utils/list-items'

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
  book: Book
}

const TooltipButton: React.FC<TooltipButtonProps> = ({
  label,
  highlight,
  onClick,
  icon,
  ...rest
}) => {
  const { isLoading, isError, error, run, reset } = useAsync<List>()

  const handleClick = () => {
    if (error) {
      reset()
    } else {
      onClick && run(onClick())
    }
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

const StatusButtons: React.FC<StatusButtonsProps> = ({ book }) => {
  const listItem = useListItem(book.id)

  const { mutateAsync: update } = useUpdateListItem()
  const { mutateAsync: remove } = useRemoveListItem()
  const { mutateAsync: create } = useCreateListItem()

  return (
    <React.Fragment>
      {listItem.id !== undefined ? (
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
      {listItem.id !== undefined ? (
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
