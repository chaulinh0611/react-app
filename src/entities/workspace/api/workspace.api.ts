import type { ApiResponse } from "@/shared/models/response";
import axios from "axios";

const getConfig = () => {
    const token = localStorage.getItem('accessToken');
    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

export const WorkspaceApi = {
    getWorkspaces: (): Promise<ApiResponse<any>> => {
        return axios.get('/workspaces', getConfig());
    },

    createWorkspace: (payload: { title: string; description?: string }): Promise<ApiResponse<any>> => {
        return axios.post('/workspaces', payload, getConfig());
    },
    updateWorkspace: (id: string, payload: { title?: string; description?: string; isArchived?: boolean }): Promise<ApiResponse<any>> => {
        return axios.put(`/workspaces/${id}`, payload, getConfig());
    },

    deleteWorkspace: (id: string): Promise<ApiResponse<void>> => {
        return axios.delete(`/workspaces/${id}`, getConfig());
    },

    getWorkspaceById: (id: string): Promise<ApiResponse<any>> => {
        return axios.get(`/workspaces/${id}`, getConfig());
    },

    getWorkspaceMembers: (workspaceId: string): Promise<ApiResponse<any>> => {
        return axios.get(`/workspaces/${workspaceId}/members`, getConfig());
    },

    addWorkspaceMember: (workspaceId: string, payload: { userId: string; role: string }): Promise<ApiResponse<void>> => {
        return axios.post(`/workspaces/${workspaceId}/members`, payload, getConfig());
    },

    removeWorkspaceMember: (workspaceId: string, userId: string): Promise<ApiResponse<void>> => {
        return axios.delete(`/workspaces/${workspaceId}/members/${userId}`, getConfig());
    },

    archiveWorkspace: (id: string): Promise<ApiResponse<void>> => {
        return axios.post(`/workspaces/${id}/archive`, {}, getConfig());
    },

    unarchiveWorkspace: (id: string): Promise<ApiResponse<void>> => {
        return axios.post(`/workspaces/${id}/unarchive`, {}, getConfig());
    },

    getBoardsInWorkspace: (workspaceId: string): Promise<ApiResponse<any>> => {
        return axios.get(`/workspaces/${workspaceId}/boards`, getConfig());
    }
}