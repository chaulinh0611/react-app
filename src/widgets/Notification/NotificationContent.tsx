import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { PopoverHeader, PopoverTitle } from '@/shared/ui/popover';
import { Switch } from '@/shared/ui/switch';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import NotificationCard from './NotificationCard';
import { ScrollArea } from '@/shared/ui/scroll-area';
import {
    useMarkAllNotificationsAsRead,
    useNotifications,
} from '@/entities/notification/hooks/useNotification';

export const NotificationPopover = () => {
    const [unreadOnly, setUnreadOnly] = useState(false);
    const { data, isLoading, isError } = useNotifications({ unreadOnly });
    const markAllAsReadMutation = useMarkAllNotificationsAsRead();

    const notifications = data?.notifications || [];

    return (
        <div className="flex flex-col flex-1 min-h-0">
            <PopoverHeader className="flex flex-row justify-between items-center border-b pb-4 mb-4 shrink-0">
                <PopoverTitle className="flex text-lg font-bold">Notifications</PopoverTitle>

                <div className="flex items-center gap-2">
                    <Label htmlFor="show-unread" className=" text-gray-700 text-[12px]">
                        Only show unread
                    </Label>
                    <Switch id="show-unread" checked={unreadOnly} onCheckedChange={setUnreadOnly} />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markAllAsReadMutation.mutate()}
                        disabled={notifications.length === 0 || markAllAsReadMutation.isPending}
                    >
                        <EllipsisVertical className="h-5 w-5" />
                    </Button>
                </div>
            </PopoverHeader>
            <ScrollArea className="overflow-y-auto flex-1 min-h-0 pr-2 pb-2">
                {isLoading && (
                    <div className="px-2 py-3 text-sm text-gray-500">Loading notifications...</div>
                )}
                {isError && (
                    <div className="px-2 py-3 text-sm text-red-500">
                        Failed to load notifications.
                    </div>
                )}
                {!isLoading && !isError && notifications.length === 0 && (
                    <div className="px-2 py-3 text-sm text-gray-500">No notifications found.</div>
                )}
                {notifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                ))}
            </ScrollArea>
        </div>
    );
};
