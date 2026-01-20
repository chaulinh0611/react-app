import { useCardStore } from './card.store';
import { useShallow } from 'zustand/react/shallow';

export const useCardsByListId = (listId: string) => {
    return useCardStore(
        useShallow((state) => {
            const cardIds = state.listCards[listId] || [];
            return cardIds.map((id) => state.cards[id]);
        }),
    );
};
