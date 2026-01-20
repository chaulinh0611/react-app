
interface Board {
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
    permissionLevel?: 'private' | 'workspace' | 'public';
    backgroundUrl?: string;
}

interface UpdateBoardPayload {
    title : string;
    description : string | null;
    permissionLevel? :  'private' | 'workspace' | 'public';

}

// STORE INTERFACE
interface BoardState {
    boards : Record<string, Board>;
    workspaceBoards : Record<string, string[]>
    isLoading: boolean
    error: string | null
}

interface BoardAction {
    getBoardsByWorkspace : (workspaceId: string) => Promise<any>;
    getBoardById: (id: string) => Promise<any>;

    createBoard: (data: CreateBoardPayload) => Promise<any>;
    updateBoard: (data : UpdateBoardPayload) => Promise<any>;
}

export type { Board, BoardMember, CreateBoardPayload, BoardState, BoardAction };
