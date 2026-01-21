import { useWorkspaceStore } from '@/entities/workspace/model/workspace.store';
import { useShallow } from 'zustand/react/shallow';

export const useWorkspaces = () =>
    useWorkspaceStore(
        useShallow((state) =>
            state.workspaceIds.map((id) => state.workspaces[id])
        )
    );

export const useWorkspaceLoading = () =>
    useWorkspaceStore((state) => state.isLoading);

export const useWorkspaceError = () =>
    useWorkspaceStore((state) => state.error);
