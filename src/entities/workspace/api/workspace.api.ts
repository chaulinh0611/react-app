import type { ApiResponse } from "@/shared/models/response";
import type { Workspace } from "../model/workspace.type";
import type { WorkspaceMember } from "../model/workspace.type";
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
    getWorkspaces: (): Promise<Workspace[]> => {
        return axios.get('/workspaces', getConfig());
    },

    createWorkspace: (payload: { title: string; description?: string }): Promise<Workspace> => {
        return axios.post('/workspaces', payload, getConfig());
    },
  
    async updateWorkspace(id: string, payload: any) {
        const res = await axios.put(`/workspaces/${id}`, payload);
        return res.data.data; 
    },

    deleteWorkspace: (id: string): Promise<ApiResponse<void>> => {
        return axios.delete(`/workspaces/${id}`, getConfig());
    },

    getWorkspaceById: (id: string): Promise<Workspace> => {
        return axios.get(`/workspaces/${id}`, getConfig());
    },

    getWorkspaceMembers: (workspaceId: string): Promise<WorkspaceMember[]> => {
        return axios.get(`/workspaces/${workspaceId}/members`, getConfig());
    },

    inviteByEmail: (workspaceId: string, email: string): Promise<ApiResponse<any>> => {
        return axios.post(`/workspaces/${workspaceId}/invite`, { email }, getConfig());
    },

    getAllInvitations: (): Promise<ApiResponse<any>> => {
        return axios.get(`/workspaces/invitations`, getConfig());
    },

    respondToInvitation: (workspaceId: string, status: string): Promise<ApiResponse<any>> => {
        return axios.post(`/workspaces/invitations/${workspaceId}`, { status }, getConfig());
    },

    createShareLink: (workspaceId: string): Promise<ApiResponse<any>> => {
        return axios.post(`/workspaces/${workspaceId}/share-link`, {}, getConfig());
    },

    revokeShareLink: (token: string): Promise<ApiResponse<any>> => {
        return axios.post(`/workspaces/share-link/revoke?token=${token}`, {}, getConfig());
    },

    addWorkspaceMember: (workspaceId: string, email: string): Promise<ApiResponse<void>> => {
        return axios.post(`/workspaces/${workspaceId}/members`, { email }, getConfig());
    },

    removeWorkspaceMember: (workspaceId: string, email: string): Promise<ApiResponse<void>> => {
        return axios.delete(`/workspaces/${workspaceId}/members`, { data: { email }, ...getConfig() });
    },

    archiveWorkspace: (id: string): Promise<ApiResponse<void>> => {
        return axios.post(`/workspaces/${id}/archive`, {}, getConfig());
    },

    unarchiveWorkspace: (id: string): Promise<ApiResponse<void>> => {
        return axios.post(`/workspaces/${id}/unarchive`, {}, getConfig());
    },

    getBoardsInWorkspace: (workspaceId: string): Promise<any[]> => {
        return axios.get(`/workspaces/${workspaceId}/boards`, getConfig());
    }
}