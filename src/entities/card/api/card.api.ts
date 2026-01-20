import type { GetCardsOnListPayLoad, ReorderCardPayload } from "../models/card.type"
import axios from "axios";

export const CardApi = {
    getCardsOnList: (payload: GetCardsOnListPayLoad) => {
        return axios.get(`/lists/${payload.listId}/cards`);
    },

    reorderCards: (payload: ReorderCardPayload) => {
        return axios.post(`/cards/${payload.cardId}/reorder`, payload);
    }
}