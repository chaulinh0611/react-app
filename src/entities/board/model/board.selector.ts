import { useBoardStore } from './board.store'


export const useBoards = () =>
  useBoardStore((state) => state.boards)


export const useBoardById = (id: string) =>
  useBoardStore(
    (state) => state.boards.find((b) => b.id === id)
  )

export const useBoardsByWorkspace = (workspaceId: string | null) =>
  useBoardStore(
    (state) =>
      state.boards.filter(
        (b) => b.workspace.id === workspaceId && !b.isArchived
      ),
  )

export const useBoardCountByWorkspace = (workspaceId: string | null) =>
  useBoardStore(
    (state) =>
      state.boards.filter(
        (b) => b.workspace.id === workspaceId && !b.isArchived
      ).length
  )

export const useBoardUI = () =>
  useBoardStore(
    (state) => ({
      isEditDialogOpen: state.isEditDialogOpen,
      currentWorkspace: state.currentWorkspace,
    }),
  )
