import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { CardApi } from '../api/card.api';
import type {
    CreateCardPayload,
    ReorderCardPayload,
    UpdateCardPayload,
    MoveCardToAnotherListPayload,
} from './type';

export const useCard = (cardId: string) => {
    return useQuery({
        queryKey: ['card', cardId],
        queryFn: () => CardApi.getCardById(cardId).then((res) => res.data),
    });
};

export const useCardsOnList = (listId: string) => {
    return useQuery({
        queryKey: ['cards', listId],
        queryFn: () => CardApi.getCardsOnList({ listId }).then((res) => res.data),
    });
};

export const useCreateCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateCardPayload) =>
            CardApi.createCard(payload).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cards'] });
        },
    });
};

export const useUpdateCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateCardPayload }) =>
            CardApi.updateCard(id, payload).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cards'] });
        },
    });
};

export const useDeleteCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => CardApi.deleteCard(id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cards'] });
        },
    });
};

export const useArchiveCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => CardApi.archiveCard(id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cards'] });
            queryClient.invalidateQueries({ queryKey: ['lists'] });
        },
    });
};

export const useUnarchiveCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => CardApi.unarchiveCard(id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cards'] });
            queryClient.invalidateQueries({ queryKey: ['lists'] });
        },
    });
};

export const useReorderCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: ReorderCardPayload) =>
            CardApi.reorderCards(payload).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cards'] });
        },
    });
};

export const useMoveCardToAnotherList = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) =>
            CardApi.moveCardToAnotherList(payload).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cards'] });
        },
    });
};

export const useGetMembersOnCard = (cardId: string) => {
    return useQuery({
        queryKey: ['card-members', cardId],
        queryFn: () => CardApi.getMembersOnCard(cardId).then((res) => res.data),
    });
};

export const useAddMemberToCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cardId, memberId }: { cardId: string; memberId: string }) =>
            CardApi.addMemberToCard(cardId, memberId).then((res) => res.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['card-members'] });
            queryClient.invalidateQueries({ queryKey: ['unassigned-members', variables.cardId] });
        },
    });
};

export const useRemoveMemberFromCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cardId, memberId }: { cardId: string; memberId: string }) =>
            CardApi.removeMemberFromCard(cardId, memberId).then((res) => res.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['unassigned-members', variables.cardId] });
            queryClient.invalidateQueries({ queryKey: ['card-members'] });
        },
    });
};

export const useGetUnassignedMembers = (cardId: string) => {
    return useQuery({
        queryKey: ['unassigned-members', cardId],
        queryFn: () => CardApi.getUnassignedMembers(cardId).then((res) => res.data),
    });
};

export const useMoveCardToBoard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            cardId,
            targetBoardId,
            targetListId,
            beforeId,
            afterId,
        }: {
            cardId: string;
            targetBoardId: string;
            targetListId: string;
            beforeId?: string | null;
            afterId?: string | null;
        }) =>
            CardApi.moveCardToBoard(cardId, targetBoardId, targetListId, beforeId, afterId).then(
                (res) => res.data,
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cards'] });
            queryClient.invalidateQueries({ queryKey: ['lists'] });
            queryClient.invalidateQueries({ queryKey: ['board'] });
        },
    });
};

export const useDuplicateCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
            cardId,
            listId,
            title,
        }: {
            cardId: string;
            listId: string;
            title: string;
        }) => CardApi.duplicateCard(cardId, listId, title).then((res) => res.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['cards', variables.listId] });
        },
    });
};

export const useUploadBackground = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cardId, file }: { cardId: string; file: File }) =>
            CardApi.uploadBackground(cardId, file).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cards'] });
        },
    });
};

export const useGetAssignedCards = (query?: any) => {
    return useQuery({
        queryKey: ['assigned-cards', query],
        queryFn: () => CardApi.getAssignedCards(query).then((res) => res.data),
    });
};

export const useGetCardsDueSoon = () => {
    return useQuery({
        queryKey: ['cards-due-soon'],
        queryFn: () => CardApi.getCardsDueSoon().then((res) => res.data),
    });
};
