export type BoardVisibility = 'private' | 'workspace' | 'public';

export interface Board {
    id: string;
    title: string;
    description?: string;
    category?: string;
    workspace: {
        id: string;
        title?: string;
        description?: string;
    };
    updatedAt: string;
    createdAt: string;
    isArchived: boolean;
    backgroundPath?: string;
    backgroundPublicId?: string;
    permissionLevel: BoardVisibility;
    boardMembers?: BoardMember[];
}

export interface BoardMember {
    id: string;
    boardId: string;
    userId: string;
    roleId: string;
}

// API INTERFACE
export interface CreateBoardPayload {
    title: string;
    description?: string;
    category?: string;
    workspaceId: string;
    permissionLevel?: BoardVisibility;
    backgroundUrl?: string;
}

export interface UpdateBoardPayload {
    title: string;
    description: string | null;
    permissionLevel?: BoardVisibility;
}

// STORE INTERFACE
export interface BoardState {
    boards: Record<string, Board>;
    workspaceBoards: Record<string, string[]>;
    isLoading: boolean;
    error: string | null;
}

export interface BoardAction {
    getBoardsByWorkspace: (workspaceId: string) => Promise<any>;
    getBoardById: (id: string) => Promise<any>;

    createBoard: (data: CreateBoardPayload) => Promise<any>;
    updateBoard: (data: UpdateBoardPayload) => Promise<any>;
}
