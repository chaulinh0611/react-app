import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ListApi } from '../api/list.api';
import { BoardApi } from '@/entities/board/api/board.api';
import type { CreateList, ReorderListsPayload, UpdateList } from './list.type';

export const useListsByBoardId = (boardId: string) => {
    return useQuery({
        queryKey: ['lists', boardId],
        queryFn: () => BoardApi.getListsOfBoard(boardId),
        select: (res) => res.data,
        enabled: !!boardId,
    });
};

export const useCreateList = (boardId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateList) => ListApi.createList(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists', boardId] });
        },
    });
};

export const useUpdateList = (boardId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ listId, data }: { listId: string; data: UpdateList }) =>
            ListApi.updateList(listId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists', boardId] });
        },
    });
};

export const useDeleteList = (boardId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (listId: string) => ListApi.deleteList(listId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists', boardId] });
        },
    });
};

export const useReorderLists = (boardId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ReorderListsPayload) =>
            ListApi.reorderLists(payload.listId, {
                boardId: payload.boardId,
                beforeId: payload.beforeId,
                afterId: payload.afterId,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists', boardId] });
        },
    });
};

export const useMoveListToAnotherBoard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ listId, boardId }: { listId: string; boardId: string }) => ListApi.moveListToAnotherBoard(listId, boardId).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists'] });
        },
    });
};

export const useArchiveList = (boardId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (listId: string) => ListApi.archiveList(listId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists', boardId] });
        },
    });
};

export const useDuplicateList = (boardId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ listId, title }: { listId: string; title?: string }) =>
            ListApi.duplicateList(listId, { boardId, title }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lists', boardId] });
        },
    });
}