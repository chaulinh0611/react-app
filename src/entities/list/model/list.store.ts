import { create } from 'zustand';
import { ListApi } from '../api/list.api';
import { BoardApi } from '@/entities/board/api/board.api';
const initState = {
    lists: {},
    boardsLists: {},
    isLoading: false,
    error: null,
    isEditDialogOpen: false,
};

import type { ListState, ListAction, List, ReorderListsPayload, CreateList, UpdateList } from './list.type';

export const useListStore = create<ListState & ListAction>((set) => ({
    ...initState,
    setIsEditDialogOpen: (open: boolean) => set({ isEditDialogOpen: open }),

    createList: async ({ title, boardId }: CreateList) => {
        set({ isLoading: true, error: null });
        try {
            const response = await ListApi.createList({ boardId, title });
            const newList = response.data;

            set((state) => ({
                ...state,
                lists: {
                    ...state.lists,
                    [newList.id]: newList,
                },
                boardsLists: {
                    ...state.boardsLists,
                    [boardId]: [...(state.boardsLists[boardId] || []), newList.id],
                },
                isLoading: false,
            }));
            return newList;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return null;
        }
    },

    updateList: async (listId: string, data: UpdateList) => {
        set({ isLoading: true, error: null });
        try {
            const response = await ListApi.updateList(listId, data);
            const updatedList = response.data;

            set((state) => ({
                ...state,
                lists: {
                    ...state.lists,
                    [updatedList.id]: updatedList,
                },
                isLoading: false,
            }));
            return updatedList;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return null;
        }
    },

    getListsByBoardId: async (boardId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await BoardApi.getListsOfBoard(boardId);
            const lists = response.data;

            set((state) => {
                const listsMap: Record<string, (typeof lists)[0]> = { ...state.lists };
                const boardLists: string[] = [];
                lists.forEach((list: List) => {
                    listsMap[list.id] = list;
                    boardLists.push(list.id);
                });
                return {
                    ...state,
                    lists: listsMap,
                    boardsLists: {
                        ...state.boardsLists,
                        [boardId]: boardLists,
                    },
                    isLoading: false,
                };
            });
            return lists;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return [];
        }
    },

    reorderLists: async (data: ReorderListsPayload) => {
        const { boardId, beforeId, afterId, listId } = data;
        const prevBoardLists = [...(useListStore.getState().boardsLists[boardId] || [])];
        set({ isLoading: true, error: null });
        set((state) => {
            const boardLists = [...(state.boardsLists[boardId] || [])];
            const filter = boardLists.filter((id) => id !== listId);
            let insertIndex = filter.length;

            if (beforeId) {
                insertIndex = filter.indexOf(beforeId) + 1;
            } else if (afterId) {
                insertIndex = filter.indexOf(afterId);
            }

            filter.splice(insertIndex, 0, listId);

            return {
                ...state,
                boardsLists: {
                    ...state.boardsLists,
                    [boardId]: filter,
                },
            };
        });

        try {
            await ListApi.reorderLists(listId, { boardId, beforeId, afterId });
            set({ isLoading: false });
            return true;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            set((state) => ({
                ...state,
                boardsLists: {
                    ...state.boardsLists,
                    [boardId]: prevBoardLists,
                },
            }));
            return false;
        }
    },

    deleteList: async (listId: string) => {
        set({ isLoading: true, error: null });
        try {
            await ListApi.deleteList(listId);
            set((state) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [listId]: _, ...remainingLists } = state.lists;

                // Remove the list ID from all boardsLists arrays
                const updatedBoardsLists: Record<string, string[]> = {};
                Object.keys(state.boardsLists).forEach((boardId) => {
                    updatedBoardsLists[boardId] = state.boardsLists[boardId].filter(
                        (id) => id !== listId
                    );
                });

                return {
                    ...state,
                    lists: remainingLists,
                    boardsLists: updatedBoardsLists,
                    isLoading: false,
                };
            });
            return true;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return false;
        }
    }
}));
