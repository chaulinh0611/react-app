import { create } from 'zustand'
import { BoardMemberApi } from '../api/board-member.api'
import type { BoardMember } from './board-member.type'

interface BoardMemberState {
  membersByBoardId: Record<string, BoardMember[]>
  loading: boolean
}

interface BoardMemberActions {
  fetchMembersByBoardId: (boardId: string) => Promise<void>
}

export const useBoardMemberStore = create<
  BoardMemberState & BoardMemberActions
>((set) => ({
  membersByBoardId: {},
  loading: false,
  fetchMembersByBoardId: async (boardId) => {
    set({ loading: true })
    try {
      const res = await BoardMemberApi.getMembersByBoardId(boardId)

      console.log('Get board member:', res.data) 

      set((state) => ({
        membersByBoardId: {
          ...state.membersByBoardId,
          [boardId]: res.data ?? [],
        },
        loading: false,
      }))
    } catch (err) {
      console.error('fetchMembersByBoardId error', err)
      set({ loading: false })
    }
  },
}))
