import { create } from "zustand"
import { BoardApi } from "../api/board.api"

interface BoardMember {
    userId: string
    email: string
    avatarUrl: string
    fullName: string
    role: string
    username: string
}

interface BoardMembersState {
    BoardMembers: Record<string, BoardMember[]>
    loading: boolean
    error: any
}

interface BoardMembersActions {
    fetchMembersByBoardId: (boardId: string) => Promise<void>
    inviteMemberViaEmail: (boardId: string, emaill: string) => void
    removeMember: (boardId: string, memberId: string) => void
}

export const useBoardMembersStore = create<BoardMembersState & BoardMembersActions>((set, get) => ({
    BoardMembers: {},
    loading: false,
    error: null,

    fetchMembersByBoardId: async (boardId: string) => {
        set({ loading: true, error: null })
        try {
            // const { BoardMembers } = get()
            // if (BoardMembers[boardId]) {
            //     set({ loading: false })
            //     return
            // }

            const res = await BoardApi.getMembers(boardId)
            set(state => ({
                BoardMembers: {
                    ...state.BoardMembers,
                    [boardId]: res.data,
                },
                loading: false,
            }))
        } catch (error) {
            set({
                error,
                loading: false,
            })
        }
    },


    inviteMemberViaEmail: async (boardId: string, email: string) => {
        try {
            await BoardApi.inviteMemberViaEmail(boardId, email)
        } catch (error) {
            set({
                error,
                loading: false,
            })
        }
    },

    removeMember: (boardId: string, memberId: string) => {
        set((state) => ({
            BoardMembers: {
                ...state.BoardMembers,
                [boardId]: state.BoardMembers[boardId].filter((m) => m.id !== memberId),
            },
        }))
    },
}));