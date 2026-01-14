import { type ReactNode, useContext, useEffect, useState } from 'react';
import { useWorkspace } from '../model/useWorkspace';
import type { Workspace } from '@/entities/workspace/model/workspace.type';
import { createContext } from 'react';

interface WorkspacesContextValue {
    workspaces: Workspace[];
    loadBoardsForWorkspaces: () => Promise<void>;
}

const WorkspacesContext = createContext<WorkspacesContextValue | null>(null);

interface WorkspaceProviderProps {
    children: ReactNode;
}

export const WorkspaceProvider = ({ children }: WorkspaceProviderProps) => {
    const { getAllWorkspacesOfUser, getBoardsInWorkspace } = useWorkspace();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

    useEffect(() => {
        const fetchWorkspaces = async () => {
            const datas = await getAllWorkspacesOfUser()

            setWorkspaces(datas);
        };
        fetchWorkspaces();
    }, []);

    const loadBoardsForWorkspaces = async () => {
        const updatedWorkspaces = await Promise.all(
            workspaces.map(async (workspace) => {
                const boards = await getBoardsInWorkspace(workspace.id);
                return { ...workspace, boards };
            }
        ));
        setWorkspaces(updatedWorkspaces);
    }

    return (
        <WorkspacesContext.Provider value={{ workspaces, loadBoardsForWorkspaces }}>{children}</WorkspacesContext.Provider>
    );
};

export const useWorkspaceContext = () => {
    const ctx = useContext(WorkspacesContext);
    if (!ctx) {
        throw new Error('useWorkspaceContext must be used inside WorkspaceProvider');
    }
    return ctx;
};
