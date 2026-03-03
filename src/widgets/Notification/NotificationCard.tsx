import type { Notification } from '@/entities/notification/model/notification.type';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { Card } from '@/shared/ui/card';
import { Dot } from 'lucide-react';
import { useBoardById } from '@/entities/board/model/board.selector';
import { useBoardStore } from '@/entities/board/model/board.store';
import { useEffect } from 'react';
import { cn } from '@/shared/lib/utils';
import { useNotificationStore } from '@/entities/notification/model/notification.store';
import { useNavigate } from 'react-router-dom';

interface NotificationCardProps {
    notification: Notification;
}

export default function NotificationCard({ notification }: NotificationCardProps) {
    const navigate = useNavigate();
    const isCardType = notification.entityType === 'card';
    const isBoardType = notification.entityType === 'board';

    const board = useBoardById(isBoardType ? notification.entityId : '');

    const fetchBoardById = useBoardStore((state) => state.fetchBoardById);
    const markAsRead = useNotificationStore((state) => state.markAsReadApi);

    useEffect(() => {
        if (isBoardType && notification.entityId && !board) {
            fetchBoardById(notification.entityId);
        }
    }, [isBoardType, notification.entityId, board, fetchBoardById]);

    const handleNotificationClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!notification.isRead) {
            markAsRead(notification.id);
        }
        if (notification.actionUrl) {
            navigate(notification.actionUrl);
        }
    };

    return (
        <Card
            className={cn(
                'flex flex-row items-start gap-3 p-3 border-none shadow-none cursor-pointer transition-all hover:bg-gray-100/50',
                !notification.isRead && 'bg-blue-50/40',
            )}
            onClick={handleNotificationClick}
        >
            <Avatar className="h-9 w-9">
                <AvatarImage src={notification.actor.avatarUrl || ''} />
                <AvatarFallback>
                    {notification.actor.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col flex-1 gap-0.5">
                <div className="text-sm">
                    <span className="font-semibold text-gray-900">
                        {notification.actor.username}
                    </span>{' '}
                    <span className="text-gray-700">{notification.message}</span>
                </div>

                {isCardType && (
                    <div className="text-[12px] font-medium text-blue-600 bg-blue-50 w-fit px-1.5 py-0.5 rounded mt-0.5">
                        Thẻ:
                    </div>
                )}

                {isBoardType && board && (
                    <div className="text-[12    px] font-medium text-indigo-600 bg-indigo-50 w-fit px-1.5 py-0.5 rounded mt-0.5">
                        Bảng: {board.title}
                    </div>
                )}

                <div className="text-[11px] text-gray-400 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </div>
            </div>

            <div className="flex items-center self-stretch justify-center w-6">
                {!notification.isRead && <Dot className="h-8 w-8 text-blue-500 animate-pulse" />}
            </div>
        </Card>
    );
}
