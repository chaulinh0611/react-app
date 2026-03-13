import axios from "axios";
import type { CreateComment } from "../model/type";

export const commentApi = {
    getCommentsOnCard: (cardId: string) => {
        return axios.get(`/comments/card/${cardId}`);
    },

    createComment: (payload: CreateComment) => {
        return axios.post(`/comments`, payload);
    },

    updateComment: (commentId: string, content: string) => {
        return axios.put(`/comments/${commentId}`, { content });
    },

    deleteComment: (commentId: string) => {
        return axios.delete(`/comments/${commentId}`);
    },

    getCommentById: (commentId: string) => {
        return axios.get(`/comments/${commentId}`);
    },
}