import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "../api/comment.api";
import type { CreateComment } from "./type";

export function useComment(cardId: string) {
    return useQuery({
        queryKey: ["comments", cardId],
        queryFn: () => commentApi.getCommentsOnCard(cardId).then((res) => res.data),
    });
}

export const useCommentById = (commentId: string) => {
    return useQuery({
        queryKey: ["comment", commentId],
        queryFn: () => commentApi.getCommentById(commentId).then((res) => res.data),
    });
}

export const useCreateComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateComment) => commentApi.createComment(payload).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
    });
};

export const useUpdateComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ commentId, content }: { commentId: string; content: string }) => commentApi.updateComment(commentId, content).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
    });
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (commentId: string) => commentApi.deleteComment(commentId).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
    });
};

