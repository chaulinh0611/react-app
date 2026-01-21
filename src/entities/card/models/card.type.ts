import { Card } from '@/shared/ui/card';
interface Card {
    id: string;
    title: string;
    description?: string;
    list?: {
        id: string;
    };
    listId?: string;
    position: number;
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
    dueDate: Date | null;
    priority: "low" | "medium" | "high" | null;
    backgroundUrl: string | null;
    backgroundPublicId: string | null;

    cardMembers?: CardMember[];
}

interface CardMember {
    id: string;
    name: string;
    avatar: string | null;
}

// Payload interface
interface ReorderCardPayload {
    listId: string;
    afterId: string | null;
    beforeId: string | null;
    cardId: string;
}

interface CreateCardPayload {
    title: string;
    description?: string;
    listId: string;
}

interface UpdateCardPayload {
    title?: string;
    description?: string;
}

// States interface
interface CardState {
    cards: Record<string, Card>;
    listCards: Record<string, string[]>;
    isLoading: boolean;
    error: string | null;
}

// Action interface
interface CardAction {
    getAllListCards: (listId: string) => Promise<Card[]>;
    reorderCards: (payload: ReorderCardPayload) => Promise<void>;
    moveCardToAnotherList: (payload: ReorderCardPayload) => Promise<void>;

    // CRUD
    createCard: (payload: CreateCardPayload) => Promise<Card>;
    updateCard: (cardId: string, payload: UpdateCardPayload) => Promise<Card>;
    deleteCard: (cardId: string) => Promise<void>;

    // MEMBERS
    addMember: (cardId: string, memberId: string) => Promise<void>;
    removeMember: (cardId: string, memberId: string) => Promise<void>;
}

export type {
    Card,
    CardMember,
    CardState,
    CardAction,
    ReorderCardPayload,
    CreateCardPayload,
    UpdateCardPayload
};
