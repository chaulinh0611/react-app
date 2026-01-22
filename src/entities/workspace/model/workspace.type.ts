interface Workspace {
    id: string;
    title: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    isArchived: boolean;
    ownerId: string;
    members?: WorkspaceMember[];
}

interface WorkspaceMember {
    id: string;
    userId: string;
    role: 'workspace_admin' | 'workspace_member';
    joinedAt: string;
}

interface WorkspaceState {
    workspaces: Record<string, Workspace>;
    workspaceIds: string[];
    isLoading: boolean;
    error: string | null;
}

interface WorkspaceAction {
    getWorkspaces: () => Promise<void>;
    createWorkspace: (payload: { title: string; description?: string }) => Promise<void>;
}

export type { Workspace, WorkspaceMember, WorkspaceState, WorkspaceAction };