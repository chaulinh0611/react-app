export interface CardMember {
    id: string;
    name: string;
    avatar: string | null;
}

export interface Card {
    id: string;
    title: string;
    description?: string;
    list?: { id: string; };
    listId?: string;
    position: number;
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
    dueDate: Date | string | null; 
    labels?: string[]; 
    priority: "low" | "medium" | "high" | null;
    backgroundUrl: string | null;
    backgroundPublicId: string | null;
    cardMembers?: CardMember[];
}

export interface ReorderCardPayload {
    listId: string;
    afterId: string | null;
    beforeId: string | null;
    cardId: string;
}

export interface CreateCardPayload {
    title: string;
    description?: string;
    listId: string;
}

export interface UpdateCardPayload {
    title?: string;
    description?: string;
    dueDate?: Date | string | null;
    labels?: string[];
    priority?: string | null;
    cardMembers?: CardMember[];
    isArchived?: boolean;
}

export interface CardFilters {
    keyword?: string;
    memberIds?: string[];
    labelIds?: string[];
    dueFrom?: string;
    dueTo?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export interface AssignedCardsQuery {
    boardId?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export interface CardState {
    cards: Record<string, Card>;
    listCards: Record<string, string[]>; // Map listId -> cardIds
    isLoading: boolean;
    error: string | null;
}

export interface CardAction {
    getAllListCards: (listId: string) => Promise<Card[]>;
    reorderCards: (payload: ReorderCardPayload) => Promise<void>;
    moveCardToAnotherList: (payload: ReorderCardPayload) => Promise<void>;
    createCard: (payload: CreateCardPayload) => Promise<Card>;
    updateCard: (cardId: string, payload: UpdateCardPayload) => Promise<Card>;
    deleteCard: (cardId: string) => Promise<void>;
    addMember: (cardId: string, memberId: string) => Promise<void>;
    removeMember: (cardId: string, memberId: string) => Promise<void>;
    getCardsInBoard: (boardId: string, filters: CardFilters) => Promise<Card[]>;
    getAssignedCards: (query: AssignedCardsQuery) => Promise<Card[]>;
    getCardsDueSoon: () => Promise<Card[]>;
    globalSearch: (keyword: string) => Promise<Card[]>;
}