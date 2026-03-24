export interface Card {
    id: string;
    title: string;
    description?: string;
    list?: {
        id: string;
        title: string;
        board?: {
            id: string;
        };
        boardId?: string;
    };
}

export interface Board {
    id: string;
    title: string;
    description?: string;
}

export interface Workspace {
    id: string;
    title: string;
    description?: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    fullName?: string;
}

export interface SearchResults {
    cards: Card[];
    boards: Board[];
    workspaces: Workspace[];
    members: User[];
}
