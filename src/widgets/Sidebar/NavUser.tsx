import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronsUpDown, Loader2 } from 'lucide-react';
import { useUserStore } from '@/entities/users/model/user.store';

export const NavUser = () => {
    const { user, isLoading } = useUserStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    const userInitial = (user?.fullName || user?.username || user?.email || 'U')
        .charAt(0)
        .toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-md transition-all outline-none group text-left">
                    {/* KHỐI HIỂN THỊ AVATAR */}
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm shrink-0 overflow-hidden border border-gray-100">
                        {user?.avatarUrl ? (
                            <img 
                                src={user.avatarUrl} 
                                alt="Avatar" 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    // Xử lý nếu link ảnh lỗi thì hiện chữ cái
                                    (e.target as HTMLImageElement).style.display = 'none';
                                }}
                            />
                        ) : (
                            <span>{userInitial}</span>
                        )}
                    </div>

                    {/* Info User */}
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-gray-700 truncate group-hover:text-gray-900">
                            {user?.fullName || user?.username || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {user?.email || 'loading...'}
                        </p>
                    </div>

                    <ChevronsUpDown className="h-4 w-4 text-gray-400 shrink-0" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" side="right" sideOffset={10} className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.fullName || user?.username}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 flex items-center gap-2"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};