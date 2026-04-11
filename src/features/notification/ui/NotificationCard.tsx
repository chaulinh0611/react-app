import type { Notification } from '@/entities/notification';
import { useDeleteNotification, useMarkNotificationAsRead } from '@/entities/notification';
import { useGetBoardById } from '@/entities/board';
import { useWorkspaceByIdQuery } from '@/entities/workspace';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { cn } from '@/shared/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Dot, Loader2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NotificationCardProps {
    notification: Notification;
}

export const NotificationCard = ({ notification }: NotificationCardProps) => {
    const navigate = useNavigate();
    const isCardType = notification.entityType === 'card';
    const isBoardType = notification.entityType === 'board';
    const isWorkspaceType = notification.entityType === 'workspace';

    const { data: board } = useGetBoardById(isBoardType ? notification.entityId : '');
    const { data: workspace } = useWorkspaceByIdQuery(isWorkspaceType ? notification.entityId : '');
    const markAsReadMutation = useMarkNotificationAsRead();
    const deleteNotificationMutation = useDeleteNotification();

    const handleNotificationClick = () => {
        if (!notification.isRead) {
            markAsReadMutation.mutate(notification.id);
        }

        if (notification.actionUrl) {
            navigate(notification.actionUrl);
        }
    };

    const handleDeleteClick = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        deleteNotificationMutation.mutate(notification.id);
    };

    return (
        <Card
            className={cn(
                'group flex cursor-pointer flex-row items-start gap-3 border-none p-3 shadow-none transition-all hover:bg-gray-100/50',
                !notification.isRead && 'bg-blue-50/40',
            )}
            onClick={handleNotificationClick}
        >
            <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={notification.actor.avatarUrl || ''} />
                <AvatarFallback>
                    {notification.actor.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="text-sm leading-5">
                    <span className="font-semibold text-gray-900">
                        {notification.actor.username}
                    </span>{' '}
                    <span className="text-gray-700">{notification.message}</span>
                </div>

                {isCardType && (
                    <div className="mt-1 w-fit rounded bg-blue-50 px-1.5 py-0.5 text-[12px] font-medium text-blue-600">
                        Card
                    </div>
                )}

                {isBoardType && (
                    <div className="mt-1 w-fit rounded bg-indigo-50 px-1.5 py-0.5 text-[12px] font-medium text-indigo-600">
                        Board: {board?.title || 'Loading...'}
                    </div>
                )}

                {isWorkspaceType && (
                    <div className="mt-1 w-fit rounded bg-purple-50 px-1.5 py-0.5 text-[12px] font-medium text-purple-600">
                        Workspace: {workspace?.title || 'Loading...'}
                    </div>
                )}

                <div className="mt-1 text-[11px] text-gray-400">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </div>
            </div>

            <div className="flex shrink-0 flex-col items-end justify-between self-stretch gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={handleDeleteClick}
                    disabled={deleteNotificationMutation.isPending}
                    aria-label="Delete notification"
                >
                    {deleteNotificationMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    ) : (
                        <Trash2 className="h-4 w-4 text-gray-500" />
                    )}
                </Button>

                {!notification.isRead && <Dot className="h-8 w-8 text-blue-500 animate-pulse" />}
            </div>
        </Card>
    );
};
