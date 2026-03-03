export interface Card {
    id: string;
    title: string;
    description: string;
    position: number;
    listId: string;
    boardId: string;
    members: CardMember[];
    labels: CardLabel[];
    attachments: CardAttachment[];
    checklists: CardChecklist[];
    comments: CardComment[];
    createdAt: string;
    updatedAt: string;
}

export interface CardMember {
    id: string;
    userId: string;
    user: User;
}

export interface CardLabel {
    id: string;
    name: string;
    color: string;
}

export interface CardAttachment {
    id: string;
    name: string;
    url: string;
}

export interface CardChecklist {
    id: string;
    name: string;
    items: CardChecklistItem[];
}

export interface CardChecklistItem {
    id: string;
    name: string;
    isCompleted: boolean;
}

export interface CardComment {
    id: string;
    content: string;
    user: User;
    createdAt: string;
}

export interface CreateCardPayload {
    title: string;
    description?: string;
    position?: number;
    listId: string;
    boardId: string;
}

export interface UpdateCardPayload {
    id: string;
    title?: string;
    description?: string;
    position?: number;
    listId?: string;
    boardId?: string;
}

export interface ReorderCardPayload {
    id: string;
    position: number;
    listId: string;
    boardId: string;
}