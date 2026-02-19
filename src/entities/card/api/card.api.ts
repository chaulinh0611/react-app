import type {
    CreateCardPayload,
    ReorderCardPayload,
    UpdateCardPayload,
    CardFilters, 
    AssignedCardsQuery, 
} from '../model/card.type'; 
import axios from 'axios';

export const CardApi = {
    getCardsOnList: ({ listId } : { listId: string }) => {
        return axios.get(`/lists/${listId}/cards`);
    },
    reorderCards: (payload: ReorderCardPayload) => {
        return axios.post(`/cards/${payload.cardId}/reorder`, payload);
    },
    createCard: (payload: CreateCardPayload) => {
        return axios.post(`/cards`, payload);
    },
    updateCard: (id: string, payload: Partial<UpdateCardPayload>) => {
        return axios.patch(`/cards/${id}`, payload);
    },
    deleteCard: (id: string) => {
        return axios.delete(`/cards/${id}`);
    },
    getMembersOnCard: (cardId: string) => {
        return axios.get(`/cards/${cardId}/members`);
    },
    moveCardToAnotherList: (payload: ReorderCardPayload) => {
        return axios.post(`/cards/${payload.cardId}/reorder-list`, payload);
    },

    getCardsInBoard: (boardId: string, filters: CardFilters) => {
        return axios.get(`/boards/${boardId}/cards`, { 
            params: filters,
            paramsSerializer: { indexes: null } 
        });
    },
    getAssignedCards: (query: AssignedCardsQuery) => {
        return axios.get('/cards/assigned-to-me', { params: query });
    },
    getCardsDueSoon: () => {
        return axios.get('/cards/due-soon');
    },
    globalSearch: (keyword: string) => {
        return axios.get('/cards/search', { params: { keyword } });
    },
    // --- BỔ SUNG GỌI API CHO NÚT MEMBERS ---
    addMember: (cardId: string, memberId: string) => {
        return axios.post(`/cards/${cardId}/members`, { memberId });
    }
};