import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { notificationApi } from '../api/notification.api';
import type { NotificationStore, Notification, FetchNotificationsParams } from './notification.type';

const initialState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
};

export const useNotificationStore = create<NotificationStore>()(
    devtools(
        (set, get) => ({
            ...initialState,
            fetchNotifications: async (params?: FetchNotificationsParams) => {
                set({ isLoading: true, error: null });
                try {
                    const data = await notificationApi.getNotifications(params);
                    set({ notifications: data.notifications, isLoading: false });
                } catch (err) {
                    set({ isLoading: false, error: (err as Error).message });
                }
            },

            fetchUnreadCount: async () => {
                try {
                    const count = await notificationApi.getUnreadCount();
                    set({ unreadCount: count });
                } catch (err) {
                    console.error('Failed to fetch unread count:', err);
                }
            },

            markAsReadApi: async (id: string) => {
                const previousNotifications = get().notifications;
                const previousUnread = get().unreadCount;

                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n.id === id ? { ...n, isRead: true } : n
                    ),
                    unreadCount: Math.max(0, state.unreadCount - 1),
                }));

                try {
                    await notificationApi.markAsRead(id);
                } catch (err) {
                    set({
                        notifications: previousNotifications,
                        unreadCount: previousUnread,
                        error: (err as Error).message
                    });
                }
            },

            markAllAsReadApi: async () => {
                const previousNotifications = get().notifications;
                const previousUnread = get().unreadCount;

                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                    unreadCount: 0,
                }));

                try {
                    await notificationApi.markAllAsRead();
                } catch (err) {
                    set({
                        notifications: previousNotifications,
                        unreadCount: previousUnread,
                        error: (err as Error).message
                    });
                }
            },

            deleteNotificationApi: async (id: string) => {
                const previousNotifications = get().notifications;
                const previousUnread = get().unreadCount;

                set((state) => {
                    const notification = state.notifications.find((n) => n.id === id);
                    const wasUnread = notification && !notification.isRead;
                    return {
                        notifications: state.notifications.filter((n) => n.id !== id),
                        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
                    };
                });

                try {
                    await notificationApi.deleteNotification(id);
                } catch (err) {
                    set({
                        notifications: previousNotifications,
                        unreadCount: previousUnread,
                        error: (err as Error).message
                    });
                }
            },

            prependNotification: (notification: Notification) =>
                set((state) => {
                    const exists = state.notifications.some((n) => n.id === notification.id);
                    if (exists) return state;
                    return { notifications: [notification, ...state.notifications] };
                }),

            setUnreadCount: (count: number) => set({ unreadCount: count }),
            incrementUnread: () => set((state) => ({ unreadCount: state.unreadCount + 1 })),
            decrementUnread: () => set((state) => ({ unreadCount: Math.max(0, state.unreadCount - 1) })),
            setLoading: (loading: boolean) => set({ isLoading: loading }),
            setError: (error: string | null) => set({ error }),
        }),
        { name: 'notification-store' }
    )
);

export const selectNotifications = (state: NotificationStore) => state.notifications;
export const selectUnreadCount = (state: NotificationStore) => state.unreadCount;
export const selectIsNotificationsLoading = (state: NotificationStore) => state.isLoading;
export const selectNotificationError = (state: NotificationStore) => state.error;
export const selectHasUnread = (state: NotificationStore) => state.unreadCount > 0;
