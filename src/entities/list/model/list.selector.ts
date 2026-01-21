import { useListStore } from './list.store'
import { useShallow } from 'zustand/react/shallow'
import type { List } from './list.type'

export const useListsByBoardId = (boardId: string): List[] =>
  useListStore(
    useShallow((state) =>
      (state.lists ?? []).filter(
        (list) => list.boardId === boardId && !list.isArchived
      )
    )
  )

export const useListCountByBoardId = (boardId: string): number =>
  useListStore(
    (state) =>
      (state.lists ?? []).filter(
        (list) => list.boardId === boardId && !list.isArchived
      ).length
  )
