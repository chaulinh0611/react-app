import { create } from 'zustand';
import { CardApi } from '../api/card.api';
import type { CardState, CardAction, Card, ReorderCardPayload } from './card.type';

const initState = {
    cards: {},
    listCards: {},
    isLoading: false,
    error: null,
};

export const useCardStore = create<CardState & CardAction>((set, get) => ({
    ...initState,

    getAllListCards: async (listId: string) => {
        set({ isLoading: true });
        try {
            const { data: cards } = await CardApi.getCardsOnList({ listId });
            set((state) => {
                const cardsMap: Record<string, Card> = { ...state.cards };
                const listCards: string[] = [];
                cards.forEach((card: Card) => {
                    cardsMap[card.id] = card;
                    listCards.push(card.id);
                });
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
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return [];
        }
    },

    reorderCards: async (payload: ReorderCardPayload) => {
        const { listId, beforeId, afterId, cardId } = payload;
        const prevCardList = [...(get().listCards[listId] || [])];
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
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            set((state) => ({
                ...state,
                listCards: {
                    ...state.listCards,
                    [listId]: prevCardList,
                },
            }));
        }
    },

    moveCardToAnotherList: async (payload: ReorderCardPayload) => {
        const { listId: targetListId, beforeId, afterId, cardId } = payload;
        const sourceListId = get().cards[cardId]?.list?.id || get().cards[cardId]?.listId;
        
        if (!sourceListId) return;

        const prevCardListSource = [...(get().listCards[sourceListId] || [])];
        const prevCardListTarget = [...(get().listCards[targetListId] || [])];

        set({ isLoading: true, error: null });

        set((state) => {
            const updatedSourceList = (state.listCards[sourceListId] || []).filter((id) => id !== cardId);
            const targetList = [...(state.listCards[targetListId] || [])];
            let insertIndex = targetList.length;
            if (beforeId) {
                insertIndex = targetList.indexOf(beforeId) + 1;
            } else if (afterId) {
                insertIndex = targetList.indexOf(afterId);
            }
            targetList.splice(insertIndex, 0, cardId);

            const updatedCard = { ...state.cards[cardId], listId: targetListId };
            if (updatedCard.list) updatedCard.list.id = targetListId;

            return {
                ...state,
                cards: { ...state.cards, [cardId]: updatedCard },
                listCards: {
                    ...state.listCards,
                    [sourceListId]: updatedSourceList,
                    [targetListId]: targetList,
                },
                isLoading: false,
            };
        });

        try {
            await CardApi.moveCardToAnotherList({ listId: targetListId, beforeId, afterId, cardId });
            set({ isLoading: false });
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            set((state) => ({
                ...state,
                cards: {
                    ...state.cards,
                    [cardId]: { ...state.cards[cardId], listId: sourceListId },
                },
                listCards: {
                    ...state.listCards,
                    [sourceListId]: prevCardListSource,
                    [targetListId]: prevCardListTarget,
                },
            }));
        }
    },

    createCard: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const { data: newCardRes } = await CardApi.createCard(payload);
            const newCard = newCardRes.data || newCardRes;
            set((state) => ({
                ...state,
                cards: { ...state.cards, [newCard.id]: newCard },
                listCards: {
                    ...state.listCards,
                    [newCard.listId || newCard.list.id]: [...(state.listCards[newCard.listId || newCard.list.id] || []), newCard.id],
                },
                isLoading: false,
            }));
            return newCard;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return null;
        }
    },

    updateCard: async (cardId, payload) => {
        try {
            const response = await CardApi.updateCard(cardId, payload);
            const updatedCard = response.data.data || response.data;
            
            set((state) => ({
                ...state,
                cards: { ...state.cards, [updatedCard.id]: updatedCard },
            }));
            return updatedCard;
        } catch (err) {
            console.error(err);
            return null;
        }
    },

    deleteCard: async (cardId) => {
        set({ isLoading: true, error: null });
        try {
            const listId = get().cards[cardId]?.list?.id || get().cards[cardId]?.listId;
            await CardApi.deleteCard(cardId);
            set((state) => {
                const { [cardId]: _, ...restCards } = state.cards;
                const updatedListCards = (state.listCards[listId] || []).filter((id) => id !== cardId);
                return {
                    ...state,
                    cards: restCards,
                    listCards: { ...state.listCards, [listId]: updatedListCards },
                    isLoading: false,
                };
            });
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
        }
    },

    getCardsInBoard: async (boardId, filters) => {
        set({ isLoading: true });
        try {
            const res = await CardApi.getCardsInBoard(boardId, filters);
            const cards = res.data.data || res.data; 
            
            const cardsMap = { ...get().cards };
            if(Array.isArray(cards)){
                cards.forEach((card: Card) => {
                    cardsMap[card.id] = card;
                });
            }

            set({ cards: cardsMap, isLoading: false });
            return Array.isArray(cards) ? cards : [];
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return [];
        }
    },

    getAssignedCards: async (query) => {
        set({ isLoading: true });
        try {
            const res = await CardApi.getAssignedCards(query);
            set({ isLoading: false });
            return res.data.data || []; 
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return [];
        }
    },

    getCardsDueSoon: async () => {
        set({ isLoading: true });
        try {
            const res = await CardApi.getCardsDueSoon();
            set({ isLoading: false });
            return res.data.data || []; 
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return [];
        }
    },

    globalSearch: async (keyword) => {
        set({ isLoading: true });
        try {
            const res = await CardApi.globalSearch(keyword);
            set({ isLoading: false });
            return res.data.data || []; 
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return [];
        }
    },

    addMember: async (cardId, memberId) => {
        try {
            await CardApi.addMember(cardId, memberId);
            const currentListId = get().cards[cardId]?.listId;
            if (currentListId) {
                get().getAllListCards(currentListId);
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    
    removeMember: async (cardId, memberId) => { /* Chờ bổ sung sau */ },
}));