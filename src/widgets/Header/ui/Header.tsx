import { useLocation } from 'react-router-dom';
import { NotificationPopover } from '@/features/notification';
import { InviteButton } from './InviteButton';
import { SettingButton } from './SettingButton';
import { GlobalCardSearch } from '@/features/card/ui/GlobalCardSearch';
import { Button } from '@/shared/ui/button';
import { PanelRight } from 'lucide-react';
import { useSidebar } from '@/shared/ui/sidebar';

import HeaderBreadCrumb from './HeaderBreadcrumb';

export const Header = () => {
    const { pathname } = useLocation();
    const currentPath = pathname.split('/')[1];
    const { open, setOpen } = useSidebar();
    const handleOpenSidebar = () => {
        setOpen(!open);
    };

    return (
        <header className="sticky top-0  w-full backdrop-blur-lg z-40 h-16 border-b border-b-gray-300 flex items-center justify-between ">
            <div className="flex items-center gap-2 px-4 py-2 justify-between w-full">
                <div className="flex items-center gap-3">
                    <Button variant={'ghost'} onClick={handleOpenSidebar}>
                        <PanelRight />
                    </Button>
                    <HeaderBreadCrumb />
                </div>
                <div className="flex items-center gap-2">
                    {/* Search component */}
                    <GlobalCardSearch />

                    {/* Notification component */}
                    <NotificationPopover />
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
