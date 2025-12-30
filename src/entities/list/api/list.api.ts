import type { ApiResponse } from "@/shared/models/response";
import axios from "axios";

export const ListApi = {
    createList: (payload: { boardId: string; name: string }): Promise<ApiResponse<any>> => {
        return axios.post('/lists', payload);
    },
    updateList: (id: string, payload: { name?: string; position?: number }): Promise<ApiResponse<any>> => {
        return axios.put(`/lists/${id}`, payload);
    },
    deleteList: (id: string): Promise<ApiResponse<void>> => {
        return axios.delete(`/lists/${id}`);
    },
    getListDetails: (id: string): Promise<ApiResponse<any>> => {
        return axios.get(`/lists/${id}`);
    },
    archiveList: (id: string): Promise<ApiResponse<void>> => {
        return axios.post(`/lists/${id}/archive`);
    },

    unarchiveList: (id: string): Promise<ApiResponse<void>> => {
        return axios.post(`/lists/${id}/unarchive`);
    },
    reorderLists: (boardId: string, beforeId: string | null, afterId: string | null, listId: string): Promise<ApiResponse<void>> => {
        return axios.post(`/lists/${listId}/reorder`, { boardId, beforeId, afterId });
    },
    moveList: (listId: string, boardId: string): Promise<ApiResponse<void>> => {
        return axios.post(`/lists/${listId}/move`, { boardId });
    },
    duplicateList: (listId: string, boardId: string): Promise<ApiResponse<any>> => {
        return axios.post(`/lists/${listId}/duplicate`, { boardId });
}