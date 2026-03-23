import { create } from 'zustand';
import type { Board, CreateBoardPayload } from './board.type';
import { BoardApi } from '../api/board.api';

interface BoardState {
    boards: Board[];
    isEditDialogOpen: boolean;
    currentWorkspace: string | null;
}

interface BoardActions {
    _unwrap?: (val: any) => any;
    setBoards: (boards: Board[]) => void;
    addBoard: (board: Board) => void;
    deleteBoard: (id: string) => Promise<void>;
    getBoardById: (id: string) => Board | undefined;
    updateBoard: (id: string, payload: Partial<Omit<CreateBoardPayload, 'workspaceId'>>) => Promise<Board>;
    archiveBoard: (id: string) => Promise<void>;
    setIsEditDialogOpen: (open: boolean) => void;
    setCurrentWorkspace: (id: string | null) => void;

    createBoard: (payload: {
        workspaceId: string;
        title: string;
        description?: string;
    }) => Promise<Board>;
    currentEditingBoard: Board | null;
    setCurrentEditingBoard: (board: Board | null) => void;

    fetchBoards: () => Promise<void>;
    fetchBoardById: (id: string) => Promise<void>;
}

export const useBoardStore = create<BoardState & BoardActions>((set, get) => ({
    boards: [],
    isEditDialogOpen: false,
    currentWorkspace: null,
    currentEditingBoard: null,

    setCurrentEditingBoard: (board) => set({ currentEditingBoard: board }),

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

    updateBoard: async (id, payload) => {
        try {
            console.log('UPDATE BOARD', {
                id: id,
                data: { ...payload },
            });
            const res = await BoardApi.updateBoard(id, payload);

            const updatedData: Board = get()._unwrap!(res);

            set((state) => ({
                boards: state.boards.map((b) =>
                    b.id === id ? { ...b, ...updatedData } : b
                ),
            }));

            return updatedData;
        } catch (err) {
            console.error('Failed to update board', err);
            throw err;
        }
    },

    archiveBoard: async (id: string) => {
        try {
            await BoardApi.archiveBoard(id);

            set((state) => ({
                boards: state.boards.map((b) =>
                    b.id === id ? { ...b, isArchived: true } : b
                ),
            }));
        } catch (err) {
            console.error('Failed to archive board', err);
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
        const raw = await BoardApi.getAccessiableBoards();
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
