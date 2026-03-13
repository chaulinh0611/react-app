export type NotificationType =
    | 'card_assigned'
    | 'card_comment'
    | 'card_due_soon'
    | 'card_moved'
    | 'board_invite'
    | 'workspace_invite'
    | 'mention'

export type EntityType = 'card' | 'board' | 'workspace' | 'comment'

export interface Notification {
    id: string
    message: string
    type: NotificationType
    data: Record<string, any> | null
    isRead: boolean
    actionUrl: string | null
    actorId: string
    entityType: EntityType
    entityId: string
    createdAt: string
    updatedAt: string
    actor: {
        id: string
        username: string
        fullName: string | null
        avatarUrl: string | null
    }
}

export interface GetNotificationsResponse {
    notifications: Notification[]
    total: number
    limit: number
    offset: number
}

export interface NotificationStates {
    notifications: Notification[]
    unreadCount: number
    isLoading: boolean
    error: string | null
}

export interface FetchNotificationsParams {
    limit?: number
    offset?: number
    unreadOnly?: boolean
}

export interface NotificationActions {
    fetchNotifications: (params?: FetchNotificationsParams) => Promise<void>
    fetchUnreadCount: () => Promise<void>
    markAsReadApi: (id: string) => Promise<void>
    markAllAsReadApi: () => Promise<void>
    deleteNotificationApi: (id: string) => Promise<void>

    prependNotification: (notification: Notification) => void
    setUnreadCount: (count: number) => void
    incrementUnread: () => void
    decrementUnread: () => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export type NotificationStore = NotificationStates & NotificationActions;


