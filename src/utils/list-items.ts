import { List } from '@/types/list'
import { setQueryDataForBook } from './books'
import { useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '@/queryClient'
import { useAuth, useClient } from '@/context/auth-context'

const useListItems = () => {
  const client = useClient<{ listItems: List[] }>()
  const { data: listItems } = useQuery<List[]>(
    ['lists-items'],
    () => client('list-items').then((data) => data.listItems),
    {
      onSuccess(listItems) {
        listItems.forEach((listItem) => {
          setQueryDataForBook(listItem.book)
        })
      },
    },
  )
  return listItems ?? []
}

const useListItem = (bookId: string | undefined) => {
  const listItems = useListItems()
  return (
    (listItems && listItems?.find((li) => li.bookId === bookId)) ?? {
      id: undefined,
    }
  )
}

type UseMutationParameters = Parameters<typeof useMutation>
type OptionsUseMutationParameter = UseMutationParameters[2]
const defaultMutationOptions: OptionsUseMutationParameter = {
  onError: (_error, _newItem, recover) => {
    if (typeof recover === 'function') {
      recover()
    }
  },
  onSettled: () => {
    queryClient.invalidateQueries(['lists-items'])
  },
}

const useUpdateListItem = (option?: OptionsUseMutationParameter) => {
  const client = useClient<List>()
  return useMutation<List, Error, Partial<List>>(
    (updatedData) =>
      client(`list-items/${updatedData.id}`, {
        method: 'PUT',
        data: updatedData,
      }),
    {
      onMutate: async (newItem) => {
        await queryClient.cancelQueries(['lists-items'])
        const previousItem = queryClient.getQueryData<List[]>(['lists-items'])

        queryClient.setQueryData<List[]>(['lists-items'], (old) => {
          return (
            old?.map((item) => {
              if (item.id === newItem.id) {
                return { ...item, ...newItem }
              }
              return item
            }) || []
          )
        })
        return () => queryClient.setQueryData(['lists-items'], previousItem)
      },
      ...defaultMutationOptions,
      ...option,
    },
  )
}

const useRemoveListItem = (option?: OptionsUseMutationParameter) => {
  const client = useClient<List>()
  return useMutation<List, Error, { listId: string }>(
    ({ listId }) => client(`list-items/${listId}`, { method: 'DELETE' }),
    {
      onMutate: async ({ listId }) => {
        await queryClient.cancelQueries(['lists-items'])
        const previousItem = queryClient.getQueryData<List[]>(['lists-items'])

        queryClient.setQueryData<List[]>(['lists-items'], (old) => {
          return old?.filter((item) => item.id !== listId) || []
        })
        return () => queryClient.setQueryData(['lists-items'], previousItem)
      },
      ...defaultMutationOptions,
      ...option,
    },
  )
}

const useCreateListItem = (option?: OptionsUseMutationParameter) => {
  const client = useClient<List>()
  return useMutation<List, Error, { bookId: string }>(
    ({ bookId }) => client(`list-items`, { data: { bookId } }),
    { ...defaultMutationOptions, ...option },
  )
}

export {
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
