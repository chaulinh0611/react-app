import {
    type ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    useMemo,
} from 'react';
import { useWorkspace } from '../model/useWorkspace';

interface WorkspacesContextValue {
    workspaces: Workspace[];
    isLoading: boolean;
    reload: () => Promise<void>;
}

interface Workspace {
    id: string;
    title: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    isArchived: boolean;
    boards: Board[];
}
interface Board {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

const WorkspacesContext = createContext<WorkspacesContextValue | null>(null);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
    const { getAllWorkspacesOfUser, getBoardsInWorkspace } = useWorkspace();

    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadWorkspaces = useCallback(async () => {
        setIsLoading(true);
        try {
            const ws = await getAllWorkspacesOfUser();

            const withBoards = await Promise.all(
                ws.map(async (workspace: Workspace) => ({
                    ...workspace,
                    boards: (await getBoardsInWorkspace(workspace.id)) ?? [],
                })),
            );

            setWorkspaces(withBoards);
        } catch (error) {
            console.error('Failed to load workspaces', error);
            setWorkspaces([]);
        } finally {
            setIsLoading(false);
        }
    }, [getAllWorkspacesOfUser, getBoardsInWorkspace]);

    useEffect(() => {
        loadWorkspaces();
    }, [loadWorkspaces]);

    const value = useMemo(
        () => ({
            workspaces,
            isLoading,
            reload: loadWorkspaces,
        }),
        [workspaces, isLoading, loadWorkspaces],
    );

    return <WorkspacesContext.Provider value={value}>{children}</WorkspacesContext.Provider>;
};

export const useWorkspaceContext = () => {
    const context = useContext(WorkspacesContext);
    if (!context) {
        throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
    }
    return context;
}
