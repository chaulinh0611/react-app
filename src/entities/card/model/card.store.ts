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
        try {
            const { data: cards } = await CardApi.getCardsOnList({ listId });
            set((state) => {
                const cardsMap: Record<string, Card> = { ...state.cards };
                const listCards: string[] = [];
                cards.forEach(async (card: Card) => {
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

    moveCardToAnotherList: async (payload: ReorderCardPayload) => {
        const { listId: targetListId, beforeId, afterId, cardId } = payload;
        console.log(useCardStore.getState().cards[cardId])

        const sourceListId = useCardStore.getState().cards[cardId].list.id;
        const prevCardListSource = [...(useCardStore.getState().listCards[sourceListId] || [])];
        const prevCardListTarget = [...(useCardStore.getState().listCards[targetListId] || [])];

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

            // Update card's list reference
            const updatedCard = { ...state.cards[cardId] };
            if (updatedCard.list) {
                updatedCard.list.id = targetListId;
            }

            return {
                ...state,
                cards: {
                    ...state.cards,
                    [cardId]: updatedCard,
                },
                listCards: {
                    ...state.listCards,
                    [sourceListId]: updatedSourceList,
                    [targetListId]: targetList,
                },
                isLoading: false,
            };
        });

        try {
            // Note: Backend expects 'listId' field, not 'targetListId'
            const apiPayload = {
                listId: targetListId,
                beforeId,
                afterId,
                cardId
            };
            console.log('API call moveCardToAnotherList:', apiPayload);
            await CardApi.moveCardToAnotherList(apiPayload);
            console.log('API call successful');
            set({ isLoading: false });
            return;
        } catch (err) {
            console.error('API call failed:', err);
            set({ isLoading: false, error: (err as Error).message });
            // Restore previous state using captured sourceListId
            set((state) => ({
                ...state,
                cards: {
                    ...state.cards,
                    [cardId]: {
                        ...state.cards[cardId],
                        list: {
                            ...state.cards[cardId].list,
                            id: sourceListId,
                        },
                    },
                },
                listCards: {
                    ...state.listCards,
                    [sourceListId]: prevCardListSource,
                    [targetListId]: prevCardListTarget,
                },
            }));
            return;
        }
    },

    createCard: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const { data: newCard } = await CardApi.createCard(payload);
            console.log('Created Card:', newCard);
            set((state) => ({
                ...state,
                cards: {
                    ...state.cards,
                    [newCard.id]: newCard,
                },
                listCards: {
                    ...state.listCards,
                    [newCard.list.id]: [...(state.listCards[newCard.list.id] || []), newCard.id],
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
        set({ isLoading: true, error: null });
        try {
            const response = await CardApi.updateCard(cardId, payload);
            const updatedCard = response.data;
            set((state) => ({
                ...state,
                cards: {
                    ...state.cards,
                    [updatedCard.id]: updatedCard,
                },
                isLoading: false,
            }));
            return updatedCard;
        } catch (err) {
            set({ isLoading: false, error: (err as Error).message });
            return null;
        }
    },
    deleteCard: async (cardId) => {
        console.log('Frontend deleteCard called with:', cardId);
        set({ isLoading: true, error: null });
        try {
            console.log('Calling API to delete card...');
            await CardApi.deleteCard(cardId);
            console.log('API call successful, updating local state...');
            set((state) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [cardId]: _, ...restCards } = state.cards;
                const listId = state.cards[cardId]?.list.id;
                const updatedListCards = (state.listCards[listId] || []).filter(
                    (id) => id !== cardId,
                );
                return {
                    ...state,
                    cards: restCards,
                    listCards: {
                        ...state.listCards,
                        [listId]: updatedListCards,
                    },
                    isLoading: false,
                };
            });
            return;
        } catch (err) {
            console.error('Delete card API error:', err);
            set({ isLoading: false, error: (err as Error).message });
            return;
        }
    },


    // Card Members

    addMember: async (cardId, memberId) => { },
    removeMember: async (cardId, memberId) => { },
}));
