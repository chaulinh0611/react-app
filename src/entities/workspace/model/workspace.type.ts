interface Workspace {
    id: string;
    title: string;
    description?: string;
    permissionLevel?: 'private' | 'workspace' | 'public';
    createdAt: string;
    updatedAt: string;
    isArchived: boolean;
    ownerId: string;
    members?: WorkspaceMember[];
}

interface WorkspaceMember {
    id: string;
    username: string;
    email: string;
    role: 'workspace_admin' | 'workspace_member';
}

interface WorkspaceState {
    workspaces: Record<string, Workspace>;
    workspaceIds: string[];
    currentWorkspace: Workspace | null;
    isLoading: boolean;
    error: string | null;
    workspaceMembers: WorkspaceMember[];
    workspaceBoards: any[];
}

export type { Workspace, WorkspaceMember, WorkspaceState };
