// 🐨 you'll need useQuery from '@tanstack/react-query'
// 🐨 and client from 'utils/api-client'
import { BookListUL } from './lib'
import { BookRow } from './BookRow'
import { List } from '@/types/list'
import { User } from '@/types/user'
import { useListItems } from '@/utils/list-items'

interface ListItemListProps {
  user: User
  filterListItems: (listItem: List) => boolean
  noListItems: React.ReactNode
  noFilteredListItems: React.ReactNode
}

const ListItemList: React.FC<ListItemListProps> = ({
  user,
  filterListItems,
  noListItems,
  noFilteredListItems,
}) => {
  const listItems = useListItems(user)

  const filteredListItems = listItems ? listItems?.filter(filterListItems) : []

  if (!listItems?.length) {
    return (
      <div css={{ marginTop: '1em', fontSize: '1.2em' }}>{noListItems}</div>
    )
  }
  if (!filteredListItems.length) {
    return (
      <div css={{ marginTop: '1em', fontSize: '1.2em' }}>
        {noFilteredListItems}
      </div>
    )
  }

  return (
    <BookListUL>
      {filteredListItems.map((listItem) => (
        <li key={listItem.id}>
          <BookRow user={user} book={listItem.book} />
        </li>
      ))}
    </BookListUL>
  )
}

export { ListItemList }
