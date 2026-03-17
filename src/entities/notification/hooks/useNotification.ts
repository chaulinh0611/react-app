import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/notification.api';
import type {
    FetchNotificationsParams,
    GetNotificationsResponse,
} from '../model/notification.type';

export const notificationQueryKeys = {
    all: ['notifications'] as const,
    lists: ['notifications', 'list'] as const,
    list: (params?: FetchNotificationsParams) => ['notifications', 'list', params || {}] as const,
    unreadCount: ['notifications', 'unread-count'] as const,
};

export const useNotifications = (params?: FetchNotificationsParams) => {
    return useQuery({
        queryKey: notificationQueryKeys.list(params),
        queryFn: () => notificationApi.getNotifications(params),
    });
};

export const useUnreadCount = () => {
    return useQuery({
        queryKey: notificationQueryKeys.unreadCount,
        queryFn: notificationApi.getUnreadCount,
    });
};

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => notificationApi.markAsRead(id),
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: notificationQueryKeys.lists });

            const previousLists = queryClient.getQueriesData<GetNotificationsResponse>({
                queryKey: notificationQueryKeys.lists,
            });
            const previousUnreadCount = queryClient.getQueryData<number>(
                notificationQueryKeys.unreadCount,
            );

            queryClient.setQueriesData<GetNotificationsResponse>(
                { queryKey: notificationQueryKeys.lists },
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        notifications: old.notifications.map((notification) =>
                            notification.id === id
                                ? { ...notification, isRead: true }
                                : notification,
                        ),
                    };
                },
            );

            if (typeof previousUnreadCount === 'number' && previousUnreadCount > 0) {
                queryClient.setQueryData(
                    notificationQueryKeys.unreadCount,
                    previousUnreadCount - 1,
                );
            }

            return { previousLists, previousUnreadCount };
        },
        onError: (_error, _id, context) => {
            context?.previousLists.forEach(([key, value]) => {
                queryClient.setQueryData(key, value);
            });
            if (typeof context?.previousUnreadCount === 'number') {
                queryClient.setQueryData(
                    notificationQueryKeys.unreadCount,
                    context.previousUnreadCount,
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: notificationQueryKeys.lists });
            queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount });
        },
    });
};

export const useMarkAllNotificationsAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => notificationApi.markAllAsRead(),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: notificationQueryKeys.lists });

            const previousLists = queryClient.getQueriesData<GetNotificationsResponse>({
                queryKey: notificationQueryKeys.lists,
            });
            const previousUnreadCount = queryClient.getQueryData<number>(
                notificationQueryKeys.unreadCount,
            );

            queryClient.setQueriesData<GetNotificationsResponse>(
                { queryKey: notificationQueryKeys.lists },
                (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        notifications: old.notifications.map((notification) => ({
                            ...notification,
                            isRead: true,
                        })),
                    };
                },
            );
            queryClient.setQueryData(notificationQueryKeys.unreadCount, 0);

            return { previousLists, previousUnreadCount };
        },
        onError: (_error, _id, context) => {
            context?.previousLists.forEach(([key, value]) => {
                queryClient.setQueryData(key, value);
            });
            if (typeof context?.previousUnreadCount === 'number') {
                queryClient.setQueryData(
                    notificationQueryKeys.unreadCount,
                    context.previousUnreadCount,
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: notificationQueryKeys.lists });
            queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount });
        },
    });
};

export const useDeleteNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => notificationApi.deleteNotification(id),
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: notificationQueryKeys.lists });

            const previousLists = queryClient.getQueriesData<GetNotificationsResponse>({
                queryKey: notificationQueryKeys.lists,
            });
            const previousUnreadCount = queryClient.getQueryData<number>(
                notificationQueryKeys.unreadCount,
            );

            let removedUnread = false;

            queryClient.setQueriesData<GetNotificationsResponse>(
                { queryKey: notificationQueryKeys.lists },
                (old) => {
                    if (!old) return old;

                    const target = old.notifications.find((notification) => notification.id === id);
                    removedUnread = removedUnread || Boolean(target && !target.isRead);

                    return {
                        ...old,
                        notifications: old.notifications.filter(
                            (notification) => notification.id !== id,
                        ),
                        total: Math.max(0, old.total - 1),
                    };
                },
            );

            if (
                removedUnread &&
                typeof previousUnreadCount === 'number' &&
                previousUnreadCount > 0
            ) {
                queryClient.setQueryData(
                    notificationQueryKeys.unreadCount,
                    previousUnreadCount - 1,
                );
            }

            return { previousLists, previousUnreadCount };
        },
        onError: (_error, _id, context) => {
            context?.previousLists.forEach(([key, value]) => {
                queryClient.setQueryData(key, value);
            });
            if (typeof context?.previousUnreadCount === 'number') {
                queryClient.setQueryData(
                    notificationQueryKeys.unreadCount,
                    context.previousUnreadCount,
                );
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: notificationQueryKeys.lists });
            queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount });
        },
    });
};
