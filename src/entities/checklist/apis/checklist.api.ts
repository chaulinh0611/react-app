import axios from 'axios';

export const CheckListApi = {
    getChecklists: async ({cardId} : {cardId: string}) => {
        return axios.get(`/checklists/card/${cardId}`);
    },

    getChecklistItems: async (checklistId: string) => {
        return axios.get(`/checklists/${checklistId}/items`);
    },

    createChecklist : async ({title, cardId} : any) => {
        return axios.post('/checklists', { title, cardId });
    },

    addChecklistItem : async ({checklistId, content} : any) => {
        return axios.post('/checklists/items', { checklistId, content });
    },

    deleteChecklist : async (checklistId: string) => {
        return axios.delete(`/checklists/${checklistId}`);
    },

    updateChecklistItems : async ({ content, isChecked, itemId } : any) => {
        return axios.patch(`/checklists/items/${itemId}`, { content, isChecked });
    },

    deleteChecklistItem : async (itemId: string) => {
        return axios.delete(`/checklists/items/${itemId}`);
    }
}