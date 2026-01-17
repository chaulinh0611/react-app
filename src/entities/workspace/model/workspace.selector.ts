import { useWorkspaceStore } from './workspace.store';
import { useShallow } from 'zustand/react/shallow';

const useWorkspaces = () => {
    return useWorkspaceStore(
        useShallow(state =>
            state.workspaceIds.map(id => state.workspaces[id])
        )
    )
};


export {
    useWorkspaces
}