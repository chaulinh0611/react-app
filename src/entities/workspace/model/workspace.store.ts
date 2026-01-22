import { create } from 'zustand';
import type { Workspace, WorkspaceState, WorkspaceAction } from './workspace.type';
import { WorkspaceApi } from '../api/workspace.api';

const initialState: WorkspaceState = {
    workspaces: {},
    workspaceIds: [],
    isLoading: false,
    error: null,
};

export const useWorkspaceStore = create<WorkspaceState & WorkspaceAction>((set, get) => ({
    ...initialState,

    getWorkspaces: async () => {
        try {
            set({ isLoading: true, error: null });

            const response = await WorkspaceApi.getWorkspaces();
            const workspaces: Workspace[] = response.data;

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
    reateWorkspace: async (payload: { title: string; description?: string }) => {
        set({ isLoading: true, error: null });
        try {
            await WorkspaceApi.createWorkspace(payload);

            await get().getWorkspaces();

            set({ isLoading: false });
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            throw err;
        }
    }
}));