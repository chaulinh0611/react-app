import { create } from 'zustand';
import type { Workspace, WorkspaceState, WorkspaceAction } from './workspace.type';
import { WorkspaceApi } from '../api/workspace.api';

const initialState: WorkspaceState = {
    workspaces: {},
    workspaceIds: [],
    isLoading: false,
    error: null,
};

export const useWorkspaceStore = create<WorkspaceState & WorkspaceAction>((set) => ({
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
}));