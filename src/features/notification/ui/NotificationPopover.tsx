import { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from '@/shared/ui/popover';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Switch } from '@/shared/ui/switch';
import {
    useMarkAllNotificationsAsRead,
    useNotifications,
    useUnreadCount,
} from '@/entities/notification';
import { NotificationCard } from './NotificationCard';

export const NotificationPopover = () => {
    const [unreadOnly, setUnreadOnly] = useState(false);
    const { data: unreadCount = 0 } = useUnreadCount();
    const { data, isLoading, isError } = useNotifications({ unreadOnly, limit: 10, offset: 0 });
    const markAllAsReadMutation = useMarkAllNotificationsAsRead();

    const notifications = data?.notifications || [];

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="relative group">
                    <Bell className="h-5 w-5 text-gray-600 transition-colors group-hover:text-black" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white ring-2 ring-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                className="flex max-h-[85vh] w-125 flex-col overflow-hidden rounded-[5px] px-4 py-6"
            >
                <div className="flex flex-col flex-1 min-h-0">
                    <PopoverHeader className="mb-4 flex shrink-0 flex-row items-center justify-between border-b pb-4">
                        <PopoverTitle className="flex text-lg font-bold">
                            Notifications
                        </PopoverTitle>

                        <div className="flex items-center gap-2">
                            <Label htmlFor="show-unread" className="text-[12px] text-gray-700">
                                Only show unread
                            </Label>
                            <Switch
                                id="show-unread"
                                checked={unreadOnly}
                                onCheckedChange={setUnreadOnly}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                className="gap-2 text-gray-700"
                                onClick={() => markAllAsReadMutation.mutate()}
                                disabled={
                                    notifications.length === 0 || markAllAsReadMutation.isPending
                                }
                            >
                                <CheckCheck className="h-4 w-4" />
                                Mark all as read
                            </Button>
                        </div>
                    </PopoverHeader>

                    <ScrollArea className="flex-1 min-h-0 overflow-y-auto pr-2 pb-2">
                        {isLoading && (
                            <div className="px-2 py-3 text-sm text-gray-500">
                                Loading notifications...
                            </div>
                        )}
                        {isError && (
                            <div className="px-2 py-3 text-sm text-red-500">
                                Failed to load notifications.
                            </div>
                        )}
                        {!isLoading && !isError && notifications.length === 0 && (
                            <div className="px-2 py-3 text-sm text-gray-500">
                                No notifications found.
                            </div>
                        )}
                        {notifications.map((notification) => (
                            <NotificationCard key={notification.id} notification={notification} />
                        ))}
                    </ScrollArea>
                </div>
            </PopoverContent>
        </Popover>
    );
};
