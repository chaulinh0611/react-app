export type BoardVisibility = 'private' | 'workspace' | 'public';

interface Board {
    id: string;
    title: string;
    description?: string;
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

interface BoardMember {
    id: string;
    boardId: string;
    userId: string;
    roleId: string;
}

// API INTERFACE
interface CreateBoardPayload {
    title: string;
    description?: string;
    workspaceId: string;
    permissionLevel?: BoardVisibility;
    backgroundUrl?: string;
}

interface UpdateBoardPayload {
    title: string;
    description: string | null;
    permissionLevel?: BoardVisibility;
}

// STORE INTERFACE
interface BoardState {
    boards: Record<string, Board>;
    workspaceBoards: Record<string, string[]>;
    isLoading: boolean;
    error: string | null;
}

interface BoardAction {
    getBoardsByWorkspace: (workspaceId: string) => Promise<any>;
    getBoardById: (id: string) => Promise<any>;

    createBoard: (data: CreateBoardPayload) => Promise<any>;
    updateBoard: (data: UpdateBoardPayload) => Promise<any>;
}

export type { Board, BoardMember, BoardVisibility, CreateBoardPayload, BoardState, BoardAction };
