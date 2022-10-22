import { User } from '@/types/user'
import { List } from '@/types/list'
import { setQueryDataForBook } from './books'
import { useMutation, useQuery } from '@tanstack/react-query'
import { client } from './api-client'
import { queryClient } from '@/queryClient'

const useListItems = (user: User) => {
  const { data: listItems } = useQuery<List[]>(
    ['lists-items'],
    () =>
      client<{ listItems: List[] }>('list-items', { token: user.token }).then(
        (data) => data.listItems,
      ),
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

const useListItem = (bookId: string | undefined, user: User) => {
  const listItems = useListItems(user)
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

const useUpdateListItem = (
  user: User,
  option?: OptionsUseMutationParameter,
) => {
  return useMutation<List, Error, Partial<List>>(
    (updatedData) =>
      client(`list-items/${updatedData.id}`, {
        method: 'PUT',
        data: updatedData,
        token: user.token,
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

const useRemoveListItem = (
  user: User,
  option?: OptionsUseMutationParameter,
) => {
  return useMutation<List, Error, { listId: string }>(
    ({ listId }) =>
      client(`list-itemss/${listId}`, { method: 'DELETE', token: user.token }),
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

const useCreateListItem = (
  user: User,
  option?: OptionsUseMutationParameter,
) => {
  return useMutation<List, Error, { bookId: string }>(
    ({ bookId }) =>
      client(`list-items`, { data: { bookId }, token: user.token }),
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
