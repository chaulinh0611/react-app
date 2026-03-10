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
}));
