import axios from 'axios';
import type { GetNotificationsResponse } from '../model/notification.type';

export const notificationApi = {
    getNotifications: async (params?: {
        limit?: number;
        offset?: number;
        unreadOnly?: boolean;
    }): Promise<GetNotificationsResponse> => {
        const { data } = await axios.get(`/notifications`, {
            params,
            withCredentials: true,
        });
        return data;
    },

    getUnreadCount: async (): Promise<number> => {
        const { data } = await axios.get(`/notifications/unread-count`, {
            withCredentials: true,
        });
        if (typeof data === 'number') return data;
        if (typeof data?.data === 'number') return data.data;
        if (typeof data?.count === 'number') return data.count;
        return 0;
    },

    markAsRead: async (id: string): Promise<void> => {
        await axios.patch(
            `/notifications/${id}/read`,
            {},
            {
                withCredentials: true,
            },
        );
    },

    markAllAsRead: async (): Promise<void> => {
        await axios.patch(
            `/notifications/read-all`,
            {},
            {
                withCredentials: true,
            },
        );
    },

    deleteNotification: async (id: string): Promise<void> => {
        await axios.delete(`/notifications/${id}`, {
            withCredentials: true,
        });
    },
};
