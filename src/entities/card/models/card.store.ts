import { create } from 'zustand';
import { CardApi } from '../api/card.api';
import type { CardState, CardAction, Card, ReorderCardPayload } from './card.type';
const initState = {
    cards: {},
    listCards: {},
    isLoading: false,
    error: null,
};

export const useCardStore = create<CardState & CardAction>((set) => ({
    ...initState,
    getAllListCards: async (listId: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await CardApi.getCardsOnList({ listId });
            const cards = response.data;
            set((state) => {
                const cardsMap: Record<string, Card> = { ...state.cards };
                const listCards: string[] = [];
                cards.forEach((card: Card) => {
                    cardsMap[card.id] = card;
                    listCards.push(card.id);
                }
                );
                return {
                    ...state,
                    cards: cardsMap,
                    listCards: {
                        ...state.listCards,
                        [listId]: listCards,
                    },
                    isLoading: false,
                };
            });
            return cards;
        }
        catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return [];
        }
    },


    reorderCards: async (payload: ReorderCardPayload) => {
        const { listId, beforeId, afterId, cardId } = payload;
        const prevCardList = [...(useCardStore.getState().listCards[listId] || [])];
        set({ isLoading: true, error: null });

        set((state) => {
                const listCards = [...(state.listCards[listId] || [])];
                const filter = listCards.filter((id) => id !== cardId);
                let insertIndex = filter.length;

                if (beforeId) {
                    insertIndex = filter.indexOf(beforeId) + 1;
                } else if (afterId) {
                    insertIndex = filter.indexOf(afterId);
                }

                filter.splice(insertIndex, 0, cardId);
                return {
                    ...state,
                    listCards: {
                        ...state.listCards,
                        [listId]: filter,
                    },
                    isLoading: false,
                };
            });

        try {
            await CardApi.reorderCards({ listId, beforeId, afterId, cardId });
            set({ isLoading: false });
            return;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            set((state) => ({
                ...state,
                listCards: {
                    ...state.listCards,
                    [listId]: prevCardList,
                },
            }));
            return;
        }
    },

}));
