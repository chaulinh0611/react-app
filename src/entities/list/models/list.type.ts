interface List {
    id: string;
    title: string;
    position: number;
    boardId: string;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// API INTERFACE

interface CreateList {
    title: string;
    boardId: string;
}

interface UpdateList {
    title?: string;
}

interface ReorderListsPayload {
    boardId: string;
    beforeId: string | null;
    afterId: string | null;
    listId: string;
}

// STORE INTERFACE

interface ListState {
    lists: Record<string, List>;
    boardsLists: Record<string, string[]>;

    isLoading: boolean;
    error: string | null;
}

interface ListAction {
    getListsByBoardId: (boardId: string) => Promise<List[]>;

    // createList: (data: CreateList) => Promise<List>;
    // updateList: (listId: string, data: UpdateList) => Promise<List>;
    // deleteList: (listId: string) => Promise<void>;

    reorderLists: ( data : ReorderListsPayload ) => Promise<boolean>;
}

export type { List, CreateList, UpdateList, ListState, ListAction, ReorderListsPayload };
