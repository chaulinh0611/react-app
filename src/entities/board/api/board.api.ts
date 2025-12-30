import type { ApiResponse } from "@/shared/models/response";
import axios from "axios";
import type { Board, CreateBoardPayload } from "../model/board.type";

export const BoardApi = {
    getBoards: (): Promise<ApiResponse<any>> => {
        return axios.get(`/boards`);
    },

    createBoard: (payload: CreateBoardPayload): Promise<ApiResponse<Board>> => {
        return axios.post('/boards', payload);
    },

    updateBoard: (id: string, payload: Partial<CreateBoardPayload> ): Promise<ApiResponse<Board>> => {
        return axios.put(`/boards/${id}`, payload);
    },

    getPublicBoards: (): Promise<ApiResponse<Board[]>> => {
        return axios.get('/boards/public');
    },

    getDetailBoard: (id: string): Promise<ApiResponse<Board>> => {
        return axios.get(`/boards/${id}`);
    },

    getMembers: (boardId: string): Promise<ApiResponse<any>> => {
        return axios.get(`/boards/${boardId}/members`);
    },

    inviteMemberViaEmail: (boardId: string, email: string, role: string): Promise<ApiResponse<void>> => {
        return axios.post(`/boards/${boardId}/members/invite/email`, { email, role });
    },

    inviteMemberViaLink: (boardId: string, role: string): Promise<ApiResponse<string>> => {
        return axios.post(`/boards/${boardId}/members/invite/link`, { role });
    },

    joinBoard: (boardId: string, token: string): Promise<ApiResponse<void>> => {
        return axios.post(`/boards/${boardId}/join`, { token });
    },

    revokeLink: (boardId: string, token: string): Promise<ApiResponse<void>> => {
        return axios.post(`/boards/${boardId}/members/invite/revoke-link`, { token });
    },

    removeMember: (boardId: string, userId: string): Promise<ApiResponse<void>> => {
        return axios.delete(`/boards/${boardId}/members/${userId}`);
    },

    archiveBoard: (id: string): Promise<ApiResponse<void>> => {
        return axios.post(`/boards/${id}/archive`);
    },

    reopenBoard: (id: string): Promise<ApiResponse<void>> => {
        return axios.post(`/boards/${id}/reopen`);
    },

    uploadBackground: (file: File): Promise<ApiResponse<{ backgroundUrl: string; backgroundPublicId: string }>> => {
        const formData = new FormData();
        formData.append('file', file);
        return axios.post('/boards/background-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    getTemplateBoards: (): Promise<ApiResponse<Board[]>> => {
        return axios.get('/boards/template');
    },

    createBoardTemplate: (boardId: string): Promise<ApiResponse<void>> => {
        return axios.post(`/boards/${boardId}/template`);
    },

    createBoardFromTemplate: (templateId: string, payload: CreateBoardPayload): Promise<ApiResponse<Board>> => {
        return axios.post(`/boards/template/${templateId}`, payload);
    },

    getListsOfBoard: (boardId: string): Promise<ApiResponse<any>> => {
        return axios.get(`/boards/${boardId}/lists`);
    }

}