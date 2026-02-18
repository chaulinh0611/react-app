import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Bell, Plus, SearchIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Header = () => {
    const { pathname } = useLocation();
    const currentPath = pathname.split('/')[1];

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
                    <div className="relative w-full max-w-sm">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input className="pl-10" placeholder="Search..." type="search" />
                    </div>
                    <Button variant="outline">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <Button>
                        <Plus /> Create
                    </Button>
                </div>
            </div>
        </header>
    );
};
