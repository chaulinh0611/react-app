import { create } from 'zustand';
import type { Workspace, WorkspaceAction, WorkspaceState } from './workspace.type';
import { WorkspaceApi } from '../api/workspace.api';

const initState = {
    workspaces: {},
    workspaceIds: [],
    isLoading: false,
    error: null,
};

export const useWorkspaceStore = create<WorkspaceState & WorkspaceAction>((set) => ({
    ...initState,

    getWorkspaces: async () => {
        set({ isLoading: true, error: null });
        const response = await WorkspaceApi.getWorkspaces();
        const workspaces: Workspace[] = response.data;
        try {
            set((state) => {
                const workspaceMap: Record<string, Workspace> = {};
                const ids: string[] = [];

                workspaces.forEach((w) => {
                    workspaceMap[w.id] = w;
                    ids.push(w.id);
                });
                return {
                    ...state,
                    workspaces: workspaceMap,
                    workspaceIds: ids,
                    isLoading: false
                };
            });
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
        }
    },
}));
