import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckListApi } from '../api/checklist.api';

// Checklist
export const useChecklist = (cardId: string) => {
    return useQuery({
        queryKey: ['checklists', cardId],
        queryFn: () => CheckListApi.getChecklists({ cardId }).then((res) => res.data),
    });
};

export const useCreateChecklist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => CheckListApi.createChecklist(payload).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['checklists'] });
        },
    });
};

export const useDeleteChecklist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => CheckListApi.deleteChecklist(payload).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['checklists'] });
        },
    });
};

// Checklist item
export const useCheckListItem = (checklistId: string) => {
    return useQuery({
        queryKey: ['checklist-items', checklistId],
        queryFn: () => CheckListApi.getChecklistItems(checklistId).then((res) => res.data),
    });
};

export const useCreateChecklistItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) =>
            CheckListApi.addChecklistItem(payload).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['checklists'] });
        },
    });
};

export const useUpdateChecklistItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) =>
            CheckListApi.updateChecklistItems(payload).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['checklists'] });
        },
    });
};

export const useDeleteChecklistItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (itemId: string) =>
            CheckListApi.deleteChecklistItem(itemId).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['checklists'] });
        },
    });
};
