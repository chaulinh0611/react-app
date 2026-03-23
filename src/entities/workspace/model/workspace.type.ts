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

interface WorkspaceAction {
    // internal helper used by store for unwrapping api results
    _unwrap: (val: any) => any;
    getWorkspaces: () => Promise<void>;
    createWorkspace: (payload: { title: string; description?: string }) => Promise<void>;
    updateWorkspace: (
        id: string,
        payload: { title?: string; description?: string },
    ) => Promise<Workspace>;
    deleteWorkspace: (id: string) => Promise<void>;

    fetchWorkspaceById: (id: string) => Promise<Workspace>;
    fetchWorkspaceMembers: (workspaceId: string) => Promise<WorkspaceMember[]>;
    inviteWorkspaceMember: (workspaceId: string, email: string) => Promise<void>;
    addWorkspaceMember: (workspaceId: string, email: string) => Promise<void>;
    createShareLink: (workspaceId: string) => Promise<string>;
    revokeShareLink: (token: string) => Promise<void>;
    removeWorkspaceMember: (workspaceId: string, email: string) => Promise<void>;
    archiveWorkspace: (id: string) => Promise<void>;
    unarchiveWorkspace: (id: string) => Promise<void>;
    getBoardsInWorkspace: (workspaceId: string) => Promise<any[]>;
}

export type { Workspace, WorkspaceMember, WorkspaceState, WorkspaceAction };
