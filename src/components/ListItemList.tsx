// 🐨 you'll need useQuery from '@tanstack/react-query'
// 🐨 and client from 'utils/api-client'
import { BookListUL } from './lib'
import { BookRow } from './BookRow'
import { List } from '@/types/list'
import { useListItems } from '@/utils/list-items'
import { Profiler } from './Profiler'

interface ListItemListProps {
  filterListItems: (listItem: List) => boolean
  noListItems: React.ReactNode
  noFilteredListItems: React.ReactNode
}

const ListItemList: React.FC<ListItemListProps> = ({
  filterListItems,
  noListItems,
  noFilteredListItems,
}) => {
  const listItems = useListItems()

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
    <Profiler
      id="List Item List"
      metadata={{ listItemCount: filteredListItems.length }}
    >
      <BookListUL>
        {filteredListItems.map((listItem) => (
          <li key={listItem.id}>
            <BookRow book={listItem.book} />
          </li>
        ))}
      </BookListUL>
    </Profiler>
  )
}

export { ListItemList }
