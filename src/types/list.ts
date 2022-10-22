import { Book } from './book'

export interface List {
  id: string
  bookId: string
  ownerId: string
  rating: number
  notes: string
  startDate: number
  finishDate: number | null
  book: Book
}
