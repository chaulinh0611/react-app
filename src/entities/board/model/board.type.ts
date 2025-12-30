export interface Board {
    id: string;
    name: string;
    description?: string;
    workspaceId: string;
    updatedAt: string;
    createdAt: string;
    isArchived: boolean;
    backgroundUrl?: string;
    backgroundPublicId?: string;
    permissionLevel: 'private' | 'workspace' | 'public';
}

export interface CreateBoardPayload {
    name: string;
    description?: string;
    workspaceId: string;
    permissionLevel?: 'private' | 'workspace' | 'public';
    backgroundUrl?: string;
}