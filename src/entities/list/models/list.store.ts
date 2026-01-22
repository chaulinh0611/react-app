import { create } from 'zustand';
import { ListApi } from '../api/list.api';
import { BoardApi } from '@/entities/board/api/board.api';
const initState = {
    lists: {},
    boardsLists: {},
    isLoading: false,
    error: null,
};

import type { ListState, ListAction, List, ReorderListsPayload } from './list.type';

export const useListStore = create<ListState & ListAction>((set) => ({
    ...initState,

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

    reorderLists: async ( data : ReorderListsPayload ) => {
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
            await ListApi.reorderLists(listId,{boardId, beforeId, afterId});
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

}));
