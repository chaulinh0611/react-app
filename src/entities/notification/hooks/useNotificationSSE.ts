import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { notificationQueryKeys } from './useNotification';
import type { GetNotificationsResponse, Notification } from '../model/notification.type';

export const useNotificationSSE = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        let eventSource: EventSource | null = null;
        let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
        let reconnectAttempts = 0;

        const connect = () => {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                return;
            }

            const streamUrl = `${import.meta.env.VITE_API_URL}/notifications/stream?token=${encodeURIComponent(accessToken)}`;
            eventSource = new EventSource(streamUrl, { withCredentials: true });

            eventSource.addEventListener('connected', () => {
                reconnectAttempts = 0;
            });

            eventSource.addEventListener('notification', (event) => {
                try {
                    const notification = JSON.parse(event.data) as Notification;

                    queryClient.setQueriesData<GetNotificationsResponse>(
                        { queryKey: notificationQueryKeys.lists },
                        (old) => {
                            if (!old) return old;

                            const exists = old.notifications.some(
                                (item) => item.id === notification.id,
                            );
                            if (exists) return old;

                            return {
                                ...old,
                                notifications: [notification, ...old.notifications],
                                total: old.total + 1,
                            };
                        },
                    );

                    queryClient.setQueryData<number>(
                        notificationQueryKeys.unreadCount,
                        (old = 0) => {
                            if (notification.isRead) {
                                return old;
                            }
                            return old + 1;
                        },
                    );
                } catch (error) {
                    console.error('Failed to parse SSE notification payload', error);
                }
            });

            eventSource.onerror = () => {
                eventSource?.close();

                const delay = Math.min(30000, 1000 * 2 ** reconnectAttempts);
                reconnectAttempts += 1;

                reconnectTimeout = setTimeout(() => {
                    connect();
                }, delay);
            };
        };

        connect();

        return () => {
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            eventSource?.close();
        };
    }, [queryClient]);
};
