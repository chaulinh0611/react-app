
export interface CardMember {
    id: string;
    user: {
        id: string;
        username: string;
        email: string;
        avatarUrl: string | null;
        fullName?: string;
    };
}

export interface Card {
    id: string;
    title: string;
    description?: string | null;
    position: number;
    backgroundUrl?: string | null;
    backgroundPublicId?: string | null;
    priority?: string;
    dueDate?: string | null;
    isArchived?: boolean;
    listId: string;
    cardMembers?: CardMember[];
    createdAt?: string;
    updatedAt?: string;
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

export interface CreateCardPayload {
    title: string;
    description?: string;
    listId: string;
}

export interface UpdateCardPayload {
    title?: string;
    description?: string;
}

export interface ReorderCardPayload {
    listId: string;
    afterId: string | null;
    beforeId: string | null;
    cardId: string;
}