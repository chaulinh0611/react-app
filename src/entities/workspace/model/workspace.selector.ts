import { useWorkspaceStore } from '@/entities/workspace/model/workspace.store';
import { useShallow } from 'zustand/react/shallow';

const useWorkspaces = () => {
    return useWorkspaceStore(
        useShallow((state) =>
            state.workspaceIds.map((id) => state.workspaces[id])
        )
    );
};

export const useWorkspaceLoading = () => (
    useWorkspaceStore((state) => state.isLoading)
);

const useWorkspaceActions = () => {
    return useWorkspaceStore(
        useShallow(state => ({
            getWorkspaces: state.getWorkspaces,
            createWorkspace: state.createWorkspace,
        }))
    );
};

const useWorkspaceStatus = () => {
    return useWorkspaceStore(
        useShallow(state => ({
            isLoading: state.isLoading,
            error: state.error
        }))
    );
};

export {
    useWorkspaces,
    useWorkspaceActions,
    useWorkspaceStatus
}