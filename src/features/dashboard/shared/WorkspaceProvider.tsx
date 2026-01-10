import { type ReactNode, useContext, useEffect, useState } from 'react';
import { useWorkspace } from '../model/useWorkspace';
import type { Workspace } from '@/entities/workspace/model/workspace.type';
import { createContext } from 'react';

interface WorkspacesContextValue {
    workspaces: Workspace[];
}

const WorkspacesContext = createContext<WorkspacesContextValue | null>(null);

interface WorkspaceProviderProps {
    children: ReactNode;
}

export const WorkspaceProvider = ({ children }: WorkspaceProviderProps) => {
    const { getAllWorkspacesOfUser } = useWorkspace();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

    useEffect(() => {
        const fetchWorkspaces = async () => {
            const data = await getAllWorkspacesOfUser();
            setWorkspaces(data);
        };

        fetchWorkspaces();
    }, []);

    return (
        <WorkspacesContext.Provider value={{ workspaces }}>{children}</WorkspacesContext.Provider>
    );
};

export const useWorkspaceContext = () => {
    const ctx = useContext(WorkspacesContext);
    if (!ctx) {
        throw new Error('useWorkspaceContext must be used inside WorkspaceProvider');
    }
    return ctx;
};
