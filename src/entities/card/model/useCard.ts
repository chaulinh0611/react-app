import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CardApi } from '../api/card.api';
import type { CardAttachment } from './type';
import type { CreateCardPayload, ReorderCardPayload, UpdateCardPayload } from './type';

export const cardQueryKeys = {
    all: ['cards'] as const,
    byId: (cardId: string) => ['card', cardId] as const,
    lists: (listId: string) => ['cards', listId] as const,
    members: (cardId: string) => ['card-members', cardId] as const,
    unassignedMembers: (cardId: string) => ['unassigned-members', cardId] as const,
    attachments: (cardId: string) => ['card-attachments', cardId] as const,
};

export const useCard = (cardId: string) => {
    return useQuery({
        queryKey: cardQueryKeys.byId(cardId),
        queryFn: () => CardApi.getCardById(cardId).then((res) => res.data),
    });
};

export const useCardsOnList = (listId: string) => {
    return useQuery({
        queryKey: cardQueryKeys.lists(listId),
        queryFn: () => CardApi.getCardsOnList({ listId }).then((res) => res.data),
    });
};

export const useCreateCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateCardPayload) =>
            CardApi.createCard(payload).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cardQueryKeys.all });
        },
    });
};

export const useUpdateCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateCardPayload }) =>
            CardApi.updateCard(id, payload).then((res) => res.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: cardQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: cardQueryKeys.byId(variables.id) });
        },
    });
};

export const useDeleteCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => CardApi.deleteCard(id).then((res) => res.data),
        onSuccess: (_, cardId) => {
            queryClient.invalidateQueries({ queryKey: cardQueryKeys.all });
            queryClient.removeQueries({ queryKey: cardQueryKeys.byId(cardId) });
        },
    });
};

export const useArchiveCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => CardApi.archiveCard(id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cardQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: ['lists'] });
        },
    });
};

export const useUnarchiveCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => CardApi.unarchiveCard(id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cardQueryKeys.all });
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
            queryClient.invalidateQueries({ queryKey: cardQueryKeys.all });
        },
    });
};

export const useMoveCardToAnotherList = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) =>
            CardApi.moveCardToAnotherList(payload).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cardQueryKeys.all });
        },
    });
};

export const useGetMembersOnCard = (cardId: string) => {
    return useQuery({
        queryKey: cardQueryKeys.members(cardId),
        queryFn: () => CardApi.getMembersOnCard(cardId).then((res) => res.data),
    });
};

export const useAddMemberToCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cardId, memberId }: { cardId: string; memberId: string }) =>
            CardApi.addMemberToCard(cardId, memberId).then((res) => res.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: cardQueryKeys.members(variables.cardId) });
            queryClient.invalidateQueries({
                queryKey: cardQueryKeys.unassignedMembers(variables.cardId),
            });
        },
    });
};

export const useRemoveMemberFromCard = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cardId, memberId }: { cardId: string; memberId: string }) =>
            CardApi.removeMemberFromCard(cardId, memberId).then((res) => res.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: cardQueryKeys.unassignedMembers(variables.cardId),
            });
            queryClient.invalidateQueries({ queryKey: cardQueryKeys.members(variables.cardId) });
        },
    });
};

export const useGetUnassignedMembers = (cardId: string) => {
    return useQuery({
        queryKey: cardQueryKeys.unassignedMembers(cardId),
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
            queryClient.invalidateQueries({ queryKey: cardQueryKeys.all });
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
            title?: string;
        }) => CardApi.duplicateCard(cardId, listId, title).then((res) => res.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: cardQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: cardQueryKeys.lists(variables.listId) });
        },
    });
};

export const useUploadBackground = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ cardId, file }: { cardId: string; file: File }) =>
            CardApi.uploadBackground(cardId, file).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cardQueryKeys.all });
        },
    });
};

export const useGetAssignedCards = (query?: any) => {
    return useQuery({
        queryKey: ['assigned-cards', query],
        queryFn: () => CardApi.getAssignedCards(query).then((res) => res.data),
    });
};

export const useCardAttachments = (cardId: string) => {
    return useQuery({
        queryKey: cardQueryKeys.attachments(cardId),
        queryFn: () => CardApi.getAttachments(cardId).then((res) => res.data),
        enabled: !!cardId,
    });
};

export const useUploadCardAttachment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cardId, file }: { cardId: string; file: File }) =>
            CardApi.uploadAttachment(cardId, file),
        onSuccess: (attachment, variables) => {
            queryClient.setQueryData<CardAttachment[]>(
                cardQueryKeys.attachments(variables.cardId),
                (old = []) => [attachment, ...old],
            );
        },
    });
};

export const useDeleteCardAttachment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (attachmentId: string) =>
            CardApi.deleteAttachment(attachmentId).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['card-attachments'] });
            queryClient.invalidateQueries({ queryKey: ['cards'] });
            queryClient.removeQueries({ queryKey: ['card-attachments'], exact: false });
        },
    });
};

export const useGetCardsDueSoon = () => {
    return useQuery({
        queryKey: ['cards-due-soon'],
        queryFn: () => CardApi.getCardsDueSoon().then((res) => res.data),
    });
};
