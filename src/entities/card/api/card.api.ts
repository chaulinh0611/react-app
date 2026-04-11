import type {
    CardAttachment,
    CreateCardPayload,
    ReorderCardPayload,
    UpdateCardPayload,
    MoveCardToAnotherListPayload,
} from '../model/type';
import axios from 'axios';

type PresignedAttachmentResponse = {
    signature: string;
    apiKey: string;
    cloudName: string;
    timestamp: number;
    folder: string;
};

type UploadToCloudinaryResponse = {
    secure_url?: string;
    url?: string;
    public_id?: string;
};

type CreateAttachmentPayload = {
    fileUrl: string;
    fileName: string;
    publicId?: string;
};

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

    archiveCard: (id: string) => {
        return axios.patch(`/cards/${id}/archive`);
    },

    unarchiveCard: (id: string) => {
        return axios.patch(`/cards/${id}/unarchive`);
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

    getAttachments: (cardId: string) => {
        return axios.get(`/cards/${cardId}/attachments`);
    },

    getAttachmentPresignedUrl: (
        cardId: string,
        fileName: string,
        fileType: string,
        fileSize: number,
    ) => {
        return axios.post(`/cards/${cardId}/presigned-url`, {
            fileName,
            fileType,
            fileSize,
        });
    },

    createAttachment: (cardId: string, payload: CreateAttachmentPayload) => {
        return axios.post(`/cards/${cardId}/attachments`, payload);
    },

    deleteAttachment: (attachmentId: string) => {
        return axios.delete(`/cards/attachments/${attachmentId}`);
    },

    uploadAttachment: async (cardId: string, file: File): Promise<CardAttachment> => {
        const presignedResponse = await CardApi.getAttachmentPresignedUrl(
            cardId,
            file.name,
            file.type,
            file.size,
        );

        const presignedData = presignedResponse?.data as PresignedAttachmentResponse;
        if (!presignedData?.cloudName || !presignedData?.signature) {
            throw new Error('Failed to prepare attachment upload');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', presignedData.apiKey);
        formData.append('timestamp', String(presignedData.timestamp));
        formData.append('folder', presignedData.folder);
        formData.append('signature', presignedData.signature);
        formData.append('tags', 'card-attachment');

        const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${presignedData.cloudName}/auto/upload`,
            {
                method: 'POST',
                body: formData,
            },
        );

        if (!uploadResponse.ok) {
            throw new Error('Attachment upload failed');
        }

        const uploaded = (await uploadResponse.json()) as UploadToCloudinaryResponse;
        const fileUrl = uploaded.secure_url || uploaded.url;
        const publicId = uploaded.public_id;

        if (!fileUrl) {
            throw new Error('Attachment upload returned no file URL');
        }

        const created = await CardApi.createAttachment(cardId, {
            fileUrl,
            fileName: file.name,
            publicId,
        });

        return created?.data ?? created;
    },

    getUnassignedMembers: (cardId: string) => {
        return axios.get(`/cards/${cardId}/unassigned-members`);
    },

    duplicateCard: (cardId: string, listId: string, title: string) => {
        return axios.post(`/cards/${cardId}/duplicate`, { targetListId: listId, title });
    },

    moveCardToBoard: (
        cardId: string,
        targetBoardId: string,
        targetListId: string,
        beforeId?: string | null,
        afterId?: string | null,
    ) => {
        return axios.post(`/cards/${cardId}/move`, {
            targetBoardId,
            targetListId,
            beforeId,
            afterId,
        });
    },

    uploadBackground: (cardId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return axios.post(`cards/${cardId}/background`, formData);
    },

    getAssignedCards: (query?: any) => {
        return axios.get(`/cards/assigned`, { params: query });
    },

    getCardsDueSoon: () => {
        return axios.get(`/cards/due-soon`);
    },
};
