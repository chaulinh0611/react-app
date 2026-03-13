import { create } from 'zustand';
import type { Board, CreateBoardPayload } from './board.type';
import { BoardApi } from '../api/board.api';

interface BoardState {
    boards: Board[];
    isEditDialogOpen: boolean;
    currentWorkspace: string | null;
}

interface BoardActions {
    // helper used internally to unwrap API responses
    _unwrap?: (val: any) => any;
    setBoards: (boards: Board[]) => void;
    addBoard: (board: Board) => void;
    deleteBoard: (id: string) => Promise<void>;
    getBoardById: (id: string) => Board | undefined;

    setIsEditDialogOpen: (open: boolean) => void;
    setCurrentWorkspace: (id: string | null) => void;

    createBoard: (payload: {
        workspaceId: string;
        title: string;
        description?: string;
    }) => Promise<Board>;

    fetchBoards: () => Promise<void>;
    fetchBoardById: (id: string) => Promise<void>;
}

export const useBoardStore = create<BoardState & BoardActions>((set, get) => ({
    boards: [],
    isEditDialogOpen: false,
    currentWorkspace: null,

    _unwrap: (val: any): any => {
        if (val && typeof val === 'object' && 'data' in val) {
            return get()._unwrap!(val.data);
        }
        return val;
    },

    setBoards: (boards) => set({ boards }),

    addBoard: (board) =>
        set((state) => ({
            boards: [...state.boards, board],
        })),

    deleteBoard: async (id) => {
        try {
            await BoardApi.deleteBoard(id);
            set((state) => ({
                boards: state.boards.filter((b) => b.id !== id),
            }));
        } catch (err) {
            console.error('Failed to delete board', err);
            throw err;
        }
    },

    getBoardById: (id) => get().boards.find((b) => b.id === id),

    updateBoard: async (id: string, payload: Partial<Omit<CreateBoardPayload, 'workspaceId'>>) => {
        try {
            let updatedData: Board = await BoardApi.updateBoard(id, payload);
            if ((updatedData as any).data) {
                updatedData = (updatedData as any).data;
            }
            set((state) => ({
                boards: state.boards.map((b) => {
                    if (b.id !== id) return b;
                    return {
                        ...b,
                        ...updatedData,
                    };
                }),
            }));
            return updatedData;
        } catch (err) {
            console.error('Failed to update board', err);
            throw err;
        }
    },

    setIsEditDialogOpen: (open) => set({ isEditDialogOpen: open }),

    setCurrentWorkspace: (id) => set({ currentWorkspace: id }),

    createBoard: async ({ workspaceId, title, description }): Promise<Board> => {
        const board = await BoardApi.createBoard({
            workspaceId,
            title,
            description,
        });
        set((state) => ({
            boards: Array.isArray(state.boards) ? [...state.boards, board] : [board],
        }));
        return board;
    },

    fetchBoards: async () => {
        const raw = await BoardApi.getBoards();
        console.log('API boards raw:', raw);
        const response = get()._unwrap!(raw) || [];
        let list: Board[] = [];
        if (Array.isArray(response)) {
            list = response;
        } else {
            console.warn('Unexpected boards response shape after unwrap', response);
        }
        set({ boards: list });
    },

    fetchBoardById: async (id: string) => {
        try {
            const raw = await BoardApi.getDetailBoard(id);
            const board: Board = get()._unwrap!(raw);
            set((state) => ({
                boards: [...state.boards.filter((b) => b.id !== id), board],
            }));
        } catch (error) {
            console.error('Failed to fetch board:', error);
        }
    },
}));
