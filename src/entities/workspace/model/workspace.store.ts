import { create } from 'zustand';
import type { Workspace, WorkspaceState, WorkspaceAction } from './workspace.type';
import { WorkspaceApi } from '../api/workspace.api';

const initialState: WorkspaceState = {
    workspaces: {},
    workspaceIds: [],
    currentWorkspace: null,
    isLoading: false,
    error: null,
    currentWorkspace: null,
    workspaceMembers: [],
    workspaceBoards: [],
};

export const useWorkspaceStore = create<WorkspaceState & WorkspaceAction>((set, get) => ({
    ...initialState,
    _unwrap: (val: any): any => {
        if (val && typeof val === 'object' && ('data' in val || 'workspace' in val)) {
            if ('data' in val) return get()._unwrap!(val.data);
            if ('workspace' in val) return get()._unwrap!(val.workspace);
        }
        return val;
    },

    getWorkspaces: async () => {
        try {
            set({ isLoading: true, error: null });

            const result: any = await WorkspaceApi.getWorkspaces();
            console.log('WorkspaceApi.getWorkspaces returned', result);
            let workspaces: Workspace[] = [];
            if (Array.isArray(result)) {
                workspaces = result;
            } else if (result && Array.isArray(result.data)) {
                workspaces = result.data;
            } else if (result && Array.isArray(result.workspaces)) {
                workspaces = result.workspaces;
            } else {
                console.warn('Unexpected workspaces shape', result);
            }

            const workspaceMap: Record<string, Workspace> = {};
            const ids: string[] = [];

            workspaces.forEach((w) => {
                workspaceMap[w.id] = w;
                ids.push(w.id);
            });

            set({
                workspaces: workspaceMap,
                workspaceIds: ids,
                isLoading: false,
            });
        } catch (err) {
            set({
                isLoading: false,
                error: (err as Error).message,
            });
        }
    },

    createWorkspace: async (payload: { title: string; description?: string }) => {
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
            const updatePayload: any = {};

            if (payload.title?.trim()) {
                updatePayload.title = payload.title.trim();
            }

            if (payload.description !== undefined) {
                updatePayload.description = payload.description.trim();
            }

            if (Object.keys(updatePayload).length === 0) {
                throw new Error('No valid fields to update');
            }

            await WorkspaceApi.updateWorkspace(id, updatePayload);

            // 🔥 reload lại workspace từ server
            const ws = await get().fetchWorkspaceById(id);

            set({ isLoading: false });

            return ws;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            throw err;
        }
    },

    deleteWorkspace: async (id: string) => {
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

    fetchWorkspaceById: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
            const raw = await WorkspaceApi.getWorkspaceById(id);
            const ws = get()._unwrap!(raw);
            set((state) => ({
                currentWorkspace: ws,
                workspaces: {
                    ...state.workspaces,
                    [ws.id]: ws,
                },
                workspaceIds: state.workspaceIds.includes(ws.id)
                    ? state.workspaceIds
                    : [...state.workspaceIds, ws.id],
                isLoading: false,
            }));
            console.log('Fetched workspace by ID', ws);
            return ws;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            throw err;
        }
    },

    fetchWorkspaceMembers: async (workspaceId: string) => {
        set({ isLoading: true, error: null });

        try {
            const raw = await WorkspaceApi.getWorkspaceMembers(workspaceId);

            const members = get()._unwrap!(raw) || [];

            set({
                workspaceMembers: Array.isArray(members) ? members : [],
                isLoading: false,
            });

            return members;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            throw err;
        }
    },

    inviteWorkspaceMember: async (workspaceId, email) => {
        await WorkspaceApi.inviteByEmail(workspaceId, email);
    },

    createShareLink: async (workspaceId: string) => {
        set({ isLoading: true, error: null });

        try {
            const raw = await WorkspaceApi.createShareLink(workspaceId);

            const data = get()._unwrap!(raw);

            set({ isLoading: false });

            return data.link;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            throw err;
        }
    },

    revokeShareLink: async (token: string) => {
        set({ isLoading: true, error: null });

        try {
            await WorkspaceApi.revokeShareLink(token);

            set({ isLoading: false });
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            throw err;
        }
    },

    addWorkspaceMember: async (workspaceId: string, email: string) => {
        set({ isLoading: true, error: null });
        try {
            await WorkspaceApi.addWorkspaceMember(workspaceId, email);
            await get().fetchWorkspaceMembers(workspaceId);
            set({ isLoading: false });
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            throw err;
        }
    },

    removeWorkspaceMember: async (workspaceId: string, email: string) => {
        set({ isLoading: true, error: null });
        try {
            await WorkspaceApi.removeWorkspaceMember(workspaceId, email);
            await get().fetchWorkspaceMembers(workspaceId);
            set({ isLoading: false });
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            throw err;
        }
    },

    archiveWorkspace: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await WorkspaceApi.archiveWorkspace(id);
            await get().fetchWorkspaceById(id);
            set({ isLoading: false });
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            throw err;
        }
    },

    unarchiveWorkspace: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await WorkspaceApi.unarchiveWorkspace(id);
            await get().fetchWorkspaceById(id);
            set({ isLoading: false });
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            throw err;
        }
    },

    getBoardsInWorkspace: async (workspaceId: string) => {
        set({ isLoading: true, error: null });
        try {
            const raw = await WorkspaceApi.getBoardsInWorkspace(workspaceId);
            const boards = get()._unwrap!(raw) || [];
            set({ workspaceBoards: boards, isLoading: false });
            return boards;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            throw err;
        }
    },
}));
