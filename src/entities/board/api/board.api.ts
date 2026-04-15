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

    getDetailBoard: async (id: string): Promise<Board> => {
        const res = await axios.get(`/boards/${id}`);
        return res.data;
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

    updateMemberRole: (
        boardId: string,
        userId: string,
        roleName: string,
    ): Promise<ApiResponse<void>> => {
        return axios.patch(`/boards/${boardId}/members/${userId}/role`, { roleName });
    },

    createLinkInvite: (boardId: string): Promise<ApiResponse<string>> => {
        return axios.post(`/boards/${boardId}/invite/link`);
    },

    joinBoard: (token: string): Promise<ApiResponse<{ boardId: string }>> => {
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

    unarchiveBoard: (id: string): Promise<void> => {
        return axios.post(`/boards/${id}/reopen`);
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

    createBoardTemplate: (
        boardId: string,
        payload?: { category?: string; copyCard?: boolean },
    ): Promise<ApiResponse<void>> => {
        return axios.post(`/boards/${boardId}/template`, payload, {
            params:
                payload?.copyCard !== undefined
                    ? { copyCard: payload.copyCard ? '1' : '0' }
                    : undefined,
        });
    },

    createBoardFromTemplate: (
        templateId: string,
        payload: CreateBoardPayload,
    ): Promise<ApiResponse<Board>> => {
        return axios.post(`/boards/template/${templateId}`, payload);
    },
    inviteMemberViaLink: (boardId: string, role: string): Promise<ApiResponse<string>> => {
        return axios.post(`/boards/${boardId}/members/invite/link`, { role });
    },

    getListsOfBoard: (boardId: string): Promise<ApiResponse<any>> => {
        return axios.get(`/boards/${boardId}/lists`);
    },

    getArchivedBoards: (): Promise<any[]> => {
        return axios.get('/boards/archived').then((res) => res.data);
    },

    getArchivedListsInBoard: (boardId: string): Promise<any[]> => {
        return axios.get(`/boards/${boardId}/archived/lists`).then((res) => res.data);
    },

    getArchivedCardsInBoard: (boardId: string): Promise<any[]> => {
        return axios.get(`/boards/${boardId}/archived/cards`).then((res) => res.data);
    },

    toggleStarBoard: (boardId: string): Promise<any> => {
        return axios.post(`/boards/${boardId}/star`);
    },

    getStarredBoards: (): Promise<any> => {
        return axios.get('/boards/starred');
    },

    getBoardActivities: (boardId: string) => {
        return axios.get(`/activities/board/${boardId}`);
    },
};
