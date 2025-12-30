import type { ApiResponse } from "@/shared/models/response";
import axios from "axios";

export const WorkspaceApi = {
    getWorkspaces: (): Promise<ApiResponse<any>> => {
        return axios.get('/workspaces');
    },

    createWorkspace: (payload: { name: string; description?: string }): Promise<ApiResponse<any>> => {
        return axios.post('/workspaces', payload);
    },
    updateWorkspace: (id: string, payload: { name?: string; description?: string; isArchived?: boolean }): Promise<ApiResponse<any>> => {
        return axios.put(`/workspaces/${id}`, payload);
    },

    deleteWorkspace: (id: string): Promise<ApiResponse<void>> => {
        return axios.delete(`/workspaces/${id}`);
    },

    getWorkspaceById: (id: string): Promise<ApiResponse<any>> => {
        return axios.get(`/workspaces/${id}`);
    },

    getWorkspaceMembers: (workspaceId: string): Promise<ApiResponse<any>> => {
        return axios.get(`/workspaces/${workspaceId}/members`);
    },

    addWorkspaceMember: (workspaceId: string, payload: { userId: string; role: string }): Promise<ApiResponse<void>> => {
        return axios.post(`/workspaces/${workspaceId}/members`, payload);
    },

    removeWorkspaceMember: (workspaceId: string, userId: string): Promise<ApiResponse<void>> => {
        return axios.delete(`/workspaces/${workspaceId}/members/${userId}`);
    },

    archiveWorkspace: (id: string): Promise<ApiResponse<void>> => {
        return axios.post(`/workspaces/${id}/archive`);
    },

    unarchiveWorkspace: (id: string): Promise<ApiResponse<void>> => {
        return axios.post(`/workspaces/${id}/unarchive`);
    }

}