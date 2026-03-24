import type { ApiResponse } from '@/shared/models/response';
import axios from 'axios';
import type { Board, CreateBoardPayload } from '../model/board.type';

export const BoardApi = {
    getAccessiableBoards: (): Promise<ApiResponse<any>> => {
        return axios.get(`/boards`);
    },

    createBoard: (payload: CreateBoardPayload): Promise<Board> => {
        return axios.post('/boards', payload);
    },

    updateBoard: (
        id: string,
        payload: Partial<CreateBoardPayload>,
    ): Promise<ApiResponse<Board>> => {
        return axios.patch(`/boards/${id}`, payload);
    },


    getPublicBoards: (): Promise<Board[]> => {
        return axios.get('/boards/public');
    },

    getDetailBoard: (id: string): Promise<Board> => {
        return axios.get(`/boards/${id}`);
    },

    getMembers: (boardId: string): Promise<any> => {
        return axios.get(`/boards/${boardId}/members`);
    },

    inviteMemberViaEmail: (
        boardId: string,
        email: string,
        role: string,
    ): Promise<ApiResponse<void>> => {
        return axios.post(`/boards/${boardId}/members/invite/email`, { email, role });
    },

    createLinkInvite: (boardId: string): Promise<ApiResponse<string>> => {
        return axios.post(`/boards/${boardId}/invite/link`);
    },

    joinBoard: (token: string): Promise<ApiResponse<void>> => {
        return axios.get(`/boards/join?token=${token}`);
    },

    revokeLink: (boardId: string): Promise<ApiResponse<void>> => {
        return axios.delete(`/boards/${boardId}/share-link`);
    },

    removeMember: (boardId: string, userId: string): Promise<void> => {
        return axios.delete(`/boards/${boardId}/members/${userId}`);
    },

    archiveBoard: (id: string): Promise<void> => {
        return axios.post(`/boards/${id}/archive`);
    },

    deleteBoard: (id: string): Promise<void> => {
        return axios.delete(`/boards/${id}`);
    },

    reopenBoard: (id: string): Promise<void> => {
        return axios.post(`/boards/${id}/reopen`);
    },

    uploadBackground: (
        boardId: string,
        file: File,
    ): Promise<ApiResponse<{ backgroundPath: string; backgroundPublicId: string }>> => {
        const formData = new FormData();
        formData.append('background', file);
        return axios.post(`/boards/${boardId}/background`, formData, {
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

    createBoardFromTemplate: (
        templateId: string,
        payload: CreateBoardPayload,
    ): Promise<ApiResponse<Board>> => {
        return axios.post(`/boards/template/${templateId}`, payload);
    },
    inviteMemberViaLink: (
        boardId: string,
        role: string,
    ): Promise<ApiResponse<string>> => {
        return axios.post(`/boards/${boardId}/members/invite/link`, { role });
    },

    getListsOfBoard: (boardId: string): Promise<ApiResponse<any>> => {
        return axios.get(`/boards/${boardId}/lists`);
    },

    getArchivedBoards: (): Promise<any[]> => {
        return axios.get('/boards/archived');
    },
};
