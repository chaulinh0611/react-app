import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LabelApi } from '../api/label.api';
import type { CreateLabelPayload, LabelItem, UpdateLabelPayload } from './label.type';

const labelKeys = {
    byCard: (cardId: string) => ['card-labels', cardId] as const,
    byBoard: (boardId: string) => ['board-labels', boardId] as const,
};

const normalizeLabels = (result: any): LabelItem[] => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    return [];
};

const normalizeLabel = (result: any): LabelItem | null => {
    if (!result) return null;
    if (result?.data !== undefined) return normalizeLabel(result.data);
    return result as LabelItem;
};

export const useCardLabels = (cardId: string) => {
    return useQuery({
        queryKey: labelKeys.byCard(cardId),
        queryFn: async () => normalizeLabels(await LabelApi.getLabelsOnCard(cardId)),
        enabled: !!cardId,
    });
};

export const useCreateLabel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cardId, payload }: { cardId: string; payload: CreateLabelPayload }) =>
            LabelApi.createLabelOnCard(cardId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: labelKeys.byCard(variables.cardId) });
            queryClient.invalidateQueries({ queryKey: ['cards'] });
            queryClient.invalidateQueries({ queryKey: ['card', variables.cardId] });
        },
    });
};

export const useBoardLabels = (boardId: string) => {
    return useQuery({
        queryKey: labelKeys.byBoard(boardId),
        queryFn: async () => normalizeLabels(await LabelApi.getLabelsOnBoard(boardId)),
        enabled: !!boardId,
    });
};

export const useAssignExistingLabel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ cardId, labelId }: { cardId: string; labelId: string }) =>
            LabelApi.assignExistingLabelToCard(cardId, labelId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: labelKeys.byCard(variables.cardId) });
            queryClient.invalidateQueries({ queryKey: ['cards'] });
            queryClient.invalidateQueries({ queryKey: ['card', variables.cardId] });
        },
    });
};

export const useUpdateLabel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            labelId,
            payload,
        }: {
            cardId: string;
            labelId: string;
            payload: UpdateLabelPayload;
        }) => LabelApi.updateLabel(labelId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: labelKeys.byCard(variables.cardId) });
            queryClient.invalidateQueries({ queryKey: ['cards'] });
            queryClient.invalidateQueries({ queryKey: ['card', variables.cardId] });
        },
    });
};

export const useDeleteLabel = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ labelId }: { cardId: string; labelId: string }) =>
            LabelApi.deleteLabel(labelId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: labelKeys.byCard(variables.cardId) });
            queryClient.invalidateQueries({ queryKey: ['cards'] });
            queryClient.invalidateQueries({ queryKey: ['card', variables.cardId] });
        },
    });
};

export { labelKeys, normalizeLabel, normalizeLabels };
