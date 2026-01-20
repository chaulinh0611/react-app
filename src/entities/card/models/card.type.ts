import { Card } from '@/shared/ui/card';
interface Card {
    id: string;
    title: string;
    description?: string;
    listId: string;
    position: number;
    createdAt: Date;
    updatedAt: Date;
}

// Payload interface

interface GetCardsOnListPayLoad {
    listId: string;
}

interface ReorderCardPayload {
    listId: string;
    afterId: string | null;
    beforeId: string | null;
    cardId: string;
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
    reorderCards: (payload : ReorderCardPayload) => Promise<void>;
}

export type { Card, GetCardsOnListPayLoad, CardState, CardAction, ReorderCardPayload };