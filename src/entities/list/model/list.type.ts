export interface List {
    id: string;
    title: string;
    position: number;
    boardId: string;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// API INTERFACE

export interface CreateList {
    title: string;
    boardId: string;
}

export interface UpdateList {
    title?: string;
}

export interface ReorderListsPayload {
    boardId: string;
    beforeId: string | null;
    afterId: string | null;
    listId: string;
}

// STORE INTERFACE

export interface ListState {
    lists: Record<string, List>;
    boardsLists: Record<string, string[]>;

    isLoading: boolean;
    isEditDialogOpen: boolean;
    error: string | null;
}

export interface ListAction {
    setIsEditDialogOpen: (open: boolean) => void;
    getListsByBoardId: (boardId: string) => Promise<List[]>;

    createList: (data: CreateList) => Promise<List | null>;
    // updateList: (listId: string, data: UpdateList) => Promise<List>;
    deleteList: (listId: string) => Promise<boolean>;

    reorderLists: (data: ReorderListsPayload) => Promise<boolean>;
}
