import { Button } from '@/shared/ui/button';
import { Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { NotificationPopover } from '../Notification/NotificationContent';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { InviteButton } from './InviteButton';
import { SettingButton } from './SettingButton';
import { GlobalCardSearch } from '@/features/card/ui/GlobalCardSearch';
import { useUnreadCount } from '@/entities/notification/hooks/useNotification';

export const Header = () => {
    const { pathname } = useLocation();
    const currentPath = pathname.split('/')[1];
    const { data: unreadCount = 0 } = useUnreadCount();

    const getTitle = () => {
        switch (currentPath) {
            case 'dashboard':
                return 'Dashboard';
            case 'profile':
                return 'Profile';
            case 'workspace':
                return 'Workspace';
            case 'board':
                return 'Board';
            default:
                return 'Dashboard';
        }
    };

    return (
        <header className="sticky top-0 w-full z-40 h-16 border-b bg-white flex items-center justify-between ">
            <div className="flex items-center gap-2 px-4 py-2 justify-between w-full">
                <span className="text-2xl font-bold text-gray-900">{getTitle()}</span>
                <div className="flex items-center gap-2">
                    {/* Search component */}
                    <GlobalCardSearch />

                    {/* Notification component */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="relative group">
                                <Bell className="h-5 w-5 text-gray-600 group-hover:text-black transition-colors" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white ring-2 ring-white">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            align="end"
                            className="rounded-[5px] w-[500px] max-h-[85vh] flex flex-col overflow-hidden px-4 py-6"
                        >
                            <NotificationPopover />
                        </PopoverContent>
                    </Popover>
                    {currentPath === 'board' && (
                        <div className="flex items-center gap-2">
                            <InviteButton />
                            <SettingButton />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
