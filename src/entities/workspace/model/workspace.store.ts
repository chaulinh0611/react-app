import { create } from 'zustand';
import type { Workspace, WorkspaceState, WorkspaceAction, WorkspaceMember } from './workspace.type';
import { WorkspaceApi } from '../api/workspace.api';

const initialState: WorkspaceState = {
    workspaces: {},
    workspaceIds: [],
    currentWorkspace: null,
    isLoading: false,
    error: null,
    workspaceMembers: [],
    workspaceBoards: [],
};

export const useWorkspaceStore = create<WorkspaceState & WorkspaceAction>((set, get) => ({
    ...initialState,

    // 🔥 unwrap response từ BE (successResponse)
    _unwrap: (val: any): any => {
        if (val?.data) return get()._unwrap(val.data);
        return val;
    },

    // ================= WORKSPACE =================
    getWorkspaces: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await WorkspaceApi.getWorkspaces();
            const data = get()._unwrap(res) || [];

            const map: Record<string, Workspace> = {};
            const ids: string[] = [];

            data.forEach((w: Workspace) => {
                map[w.id] = w;
                ids.push(w.id);
            });

            set({
                workspaces: map,
                workspaceIds: ids,
                isLoading: false,
            });
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
        }
    },

    fetchWorkspaceById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const res = await WorkspaceApi.getWorkspaceById(id);
            const data = get()._unwrap(res);

            set({
                currentWorkspace: data,
                workspaceMembers: data.members || [],
                isLoading: false,
            });

            return data;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            throw err;
        }
    },

    createWorkspace: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            await WorkspaceApi.createWorkspace(payload);
            await get().getWorkspaces();
            set({ isLoading: false });
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            throw err;
        }
    },

    updateWorkspace: async (id, payload) => {
        set({ isLoading: true, error: null });
        try {
            await WorkspaceApi.updateWorkspace(id, payload);
            const ws = await get().fetchWorkspaceById(id);
            set({ isLoading: false });
            return ws;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            throw err;
        }
    },

    deleteWorkspace: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await WorkspaceApi.deleteWorkspace(id);
            await get().getWorkspaces();
            set({ isLoading: false });
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            throw err;
        }
    },

    archiveWorkspace: async (id) => {
        await WorkspaceApi.archiveWorkspace(id);
        await get().getWorkspaces();
    },

    unarchiveWorkspace: async (id) => {
        await WorkspaceApi.unarchiveWorkspace(id);
        await get().getWorkspaces();
    },

    fetchWorkspaceMembers: async (workspaceId) => {
        try {
            const res = await WorkspaceApi.getWorkspaceMembers(workspaceId);
            const data: WorkspaceMember[] = get()._unwrap(res);

            set({ workspaceMembers: data });
            return data;
        } catch (err) {
            set({ error: (err as Error).message });
            throw err;
        }
    },

    addWorkspaceMember: async (workspaceId, email) => {
        await WorkspaceApi.inviteByEmail(workspaceId, email);
        await get().fetchWorkspaceMembers(workspaceId);
    },

    inviteWorkspaceMember: async (workspaceId, email) => {
        await WorkspaceApi.inviteByEmail(workspaceId, email);
    },

    removeWorkspaceMember: async (workspaceId, email) => {
        await WorkspaceApi.removeWorkspaceMember(workspaceId, email);
        await get().fetchWorkspaceMembers(workspaceId);
    },

    createShareLink: async (workspaceId) => {
        const res = await WorkspaceApi.createShareLink(workspaceId);
        const data = get()._unwrap(res);
        return data.link;
    },

    revokeShareLink: async (token) => {
        await WorkspaceApi.revokeShareLink(token);
    },

 
    getBoardsInWorkspace: async (workspaceId) => {
        try {
            const res = await WorkspaceApi.getBoardsInWorkspace(workspaceId);
            const data = get()._unwrap(res);

            set({ workspaceBoards: data });
            return data;
        } catch (err) {
            set({ error: (err as Error).message });
            throw err;
        }
    },
}));