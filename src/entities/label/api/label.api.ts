import axios from 'axios';
import type { ApiResponse } from '@/shared/models/response';
import type { CreateLabelPayload, LabelItem, UpdateLabelPayload } from '../model/label.type';

export const LabelApi = {
    createLabelOnCard: (
        cardId: string,
        payload: CreateLabelPayload,
    ): Promise<ApiResponse<LabelItem>> => {
        return axios.post(`/labels/cards/${cardId}`, payload);
    },

    updateLabel: (id: string, payload: UpdateLabelPayload): Promise<ApiResponse<LabelItem>> => {
        return axios.patch(`/labels/${id}`, payload);
    },

    getLabelsOnCard: (cardId: string): Promise<ApiResponse<LabelItem[]>> => {
        return axios.get(`/labels/cards/${cardId}`);
    },

    getLabelsOnBoard: (boardId: string): Promise<ApiResponse<LabelItem[]>> => {
        return axios.get(`/labels/boards/${boardId}`);
    },

    assignExistingLabelToCard: (
        cardId: string,
        labelId: string,
    ): Promise<ApiResponse<LabelItem>> => {
        return axios.post(`/labels/cards/${cardId}/assign`, { labelId });
    },

    deleteLabel: (id: string): Promise<ApiResponse<void>> => {
        return axios.delete(`/labels/${id}`);
    },
};
