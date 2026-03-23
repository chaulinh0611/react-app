import { create } from "zustand";
import { BoardApi } from "../api/board.api";

interface BoardMember {
    userId: string;
    email: string;
    avatarUrl: string;
    fullName: string;
    role: string;
    username: string;
}

interface BoardMembersState {
    boardMembers: Record<string, BoardMember[]>;
    loading: boolean;
    error: string | null;
}

interface BoardMembersActions {
    _unwrap: (val: any) => any;
    fetchMembersByBoardId: (boardId: string) => Promise<BoardMember[]>;
    inviteMemberViaEmail: (boardId: string, email: string, role: string) => Promise<void>;
    removeMember: (boardId: string, userId: string) => Promise<void>;
}

export const useBoardMembersStore = create<BoardMembersState & BoardMembersActions>((set, get) => ({

    boardMembers: {},
    loading: false,
    error: null,

    _unwrap: (val: any): any => {
        if (val?.data) return val.data;
        return val;
    },

    fetchMembersByBoardId: async (boardId) => {
        set({ loading: true, error: null });

        try {
            const res = await BoardApi.getMembers(boardId);
            const data = get()._unwrap(res);

            set((state) => ({
                boardMembers: {
                    ...state.boardMembers,
                    [boardId]: data,
                },
                loading: false,
            }));

            return data;
        } catch (err) {
            set({
                loading: false,
                error: (err as Error).message,
            });
            throw err;
        }
    },

    inviteMemberViaEmail: async (boardId, email, role) => {
        set({ loading: true, error: null });

        try {
            await BoardApi.inviteMemberViaEmail(boardId, email, role);

            await get().fetchMembersByBoardId(boardId);

            set({ loading: false });
        } catch (err) {
            set({
                loading: false,
                error: (err as Error).message,
            });
            throw err;
        }
    },

    removeMember: async (boardId, userId) => {
        set({ loading: true, error: null });

        try {
            await BoardApi.removeMember(boardId, userId);

            set((state) => ({
                boardMembers: {
                    ...state.boardMembers,
                    [boardId]: state.boardMembers[boardId]?.filter(
                        (m) => m.userId !== userId
                    ) || [],
                },
                loading: false,
            }));
        } catch (err) {
            set({
                loading: false,
                error: (err as Error).message,
            });
            throw err;
        }
    },
}));