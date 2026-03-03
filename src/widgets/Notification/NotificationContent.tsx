import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { PopoverHeader, PopoverTitle } from '@/shared/ui/popover';
import { Switch } from '@/shared/ui/switch';
import { EllipsisVertical } from 'lucide-react';
import { useNotificationStore } from '@/entities/notification/model/notification.store';
import { useEffect } from 'react';
import { selectNotifications } from '@/entities/notification/model/notification.store';
import NotificationCard from './NotificationCard';

export const NotificationPopover = () => {
    const { fetchNotifications } = useNotificationStore();
    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);
    const notifications = useNotificationStore(selectNotifications);
    return (
        <div>
            <PopoverHeader className="flex flex-row justify-between items-center border-b pb-4 mb-4">
                <PopoverTitle className="flex text-lg font-bold">Notifications</PopoverTitle>

                <div className="flex items-center gap-2">
                    <Label htmlFor="show-unread" className=" text-gray-700 text-[12px]">
                        Only show unread
                    </Label>
                    <Switch id="show-unread" />
                    <Button variant="ghost" size="icon">
                        <EllipsisVertical className="h-5 w-5" />
                    </Button>
                </div>
            </PopoverHeader>
            <div>
                {notifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                ))}
            </div>
        </div>
    );
};
