import type {
    CreateCardPayload,
    ReorderCardPayload,
    UpdateCardPayload,
} from '../models/card.type';
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
};
