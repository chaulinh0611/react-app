import { create } from 'zustand';
import type { Board } from './board.type';
import { BoardApi } from '../api/board.api'


interface BoardState {
  boards: Board[];
  isEditDialogOpen: boolean;
  currentWorkspace: string | null; 
}

interface BoardActions {
  setBoards: (boards: Board[]) => void
  addBoard: (board: Board) => void
  deleteBoard: (id: string) => void
  getBoardById: (id: string) => Board | undefined

  setIsEditDialogOpen: (open: boolean) => void
  setCurrentWorkspace: (id: string | null) => void

  createBoard: (payload: {
    workspaceId: string
    title: string
    description?: string
  }) => Promise<Board>

  fetchBoards: () => Promise<void>
}

export const useBoardStore = create<BoardState & BoardActions>((set, get) => ({
  boards: [],
  isEditDialogOpen: false,
  currentWorkspace: null,
  
  setBoards: (boards) => set({ boards }),

  addBoard: (board) =>
    set((state) => ({
      boards: [...state.boards, board],
    })),

  deleteBoard: (id) =>
    set((state) => ({
      boards: state.boards.filter((b) => b.id !== id),
    })),

  getBoardById: (id) =>
    get().boards.find((b) => b.id === id),

  setIsEditDialogOpen: (open) =>
    set({ isEditDialogOpen: open }),

  setCurrentWorkspace: (id) =>
    set({ currentWorkspace: id }),


  createBoard: async ({ workspaceId, title, description }) => {
    const res = await BoardApi.createBoard({
      workspaceId,
      title,
      description,
    })

    const board = res.data

    set((state) => ({
      boards: [...state.boards, board],
    }))

    return board
  },

  fetchBoards: async () => {
    const res = await BoardApi.getBoards();
    console.log('API boards:', res.data);
    set({ boards: res.data })
  }
}));
