import type {
    CreateCardPayload,
    ReorderCardPayload,
    UpdateCardPayload,
    MoveCardToAnotherListPayload
} from '../model/type';
import axios from 'axios';

export const CardApi = {
    getCardsOnList: ({ listId }: { listId: string }) => {
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

    addMemberToCard: (cardId: string, memberId: string) => {
        return axios.post(`/cards/${cardId}/members`, { memberId });
    },

    removeMemberFromCard: (cardId: string, memberId: string) => {
        return axios.delete(`/cards/${cardId}/members`, { data: { memberId } });
    },

    moveCardToAnotherList: (payload: MoveCardToAnotherListPayload) => {
        return axios.post(`/cards/${payload.cardId}/reorder-list`, payload);
    },

    getCardById: (id: string) => {
        return axios.get(`/cards/${id}`);
    },

    getUnassignedMembers: (cardId: string) => {
        return axios.get(`/cards/${cardId}/unassigned-members`);
    },

    duplicateCard: (cardId: string, listId: string, title: string) => {
        return axios.post(`/cards/${cardId}/duplicate`, { targetListId: listId, title });
    },

    uploadBackground: (cardId: string, file: File) => {
        const formData = new FormData()
        formData.append("file", file)
        return axios.post(`cards/${cardId}/background`, formData)
    }

};
