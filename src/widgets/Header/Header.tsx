import { Button } from '@/shared/ui/button';
import { Bell, Plus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { GlobalCardSearch } from '@/features/card/ui/GlobalCardSearch';

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
        <header className="w-full h-16 border-b bg-white flex items-center justify-between sticky top-0 left-0 z-40">
            <div className="flex items-center gap-2 px-4 py-2 justify-between w-full">
                <span className="text-2xl font-bold text-gray-900">{getTitle()}</span>
                <div className="flex items-center gap-2">
                    {}
                    <GlobalCardSearch />
                    
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