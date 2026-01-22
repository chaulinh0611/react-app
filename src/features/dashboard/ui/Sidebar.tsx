import { useWorkspaces } from '@/entities/workspace/model/workspace.selector';
import { useWorkspaceStore } from '@/entities/workspace/model/workspace.store';
import { useUserStore } from '@/entities/users/model/user.store';
import {
    SidebarGroupLabel,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/shared/ui/sidebar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { 
    PanelsTopLeft, 
    Kanban, 
    ChevronsUpDown, 
    LogOut, 
    Settings, 
    User 
} from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Sidebar() {
    const navigate = useNavigate();
    
    const workspaces = useWorkspaces();
    const { getWorkspaces } = useWorkspaceStore();

    const { user, fetchUser } = useUserStore();

    useEffect(() => {
        getWorkspaces();
        fetchUser();
    }, [getWorkspaces, fetchUser]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
    };

    return (
        <aside className="w-64 border-r bg-white flex flex-col justify-between h-screen fixed left-0 top-0 z-40">
            {/* --- PHẦN TRÊN: LOGO & MENU --- */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                    <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2">
                        <Kanban className="h-6 w-6 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-900">Kanby</span>
                    </Link>
                </div>

                <nav className="mt-3">
                    <SidebarGroup className="px-4 mb-4">
                        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md mb-1 transition-colors"
                        >
                            <PanelsTopLeft className="h-4 w-4" />
                            Dashboard
                        </Link>
                    </SidebarGroup>

                    <SidebarGroup className="px-4">
                        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                        <SidebarMenu>
                            {workspaces.map((workspace) => (
                                <SidebarMenuItem key={workspace.id}>
                                    <SidebarMenuButton asChild>
                                        <Link
                                            to={`/workspace/${workspace.id}`}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                        >
                                            <div className='flex items-center gap-2 truncate'>
                                                <div className="h-4 w-4 rounded bg-blue-500/20 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                                    {workspace.title?.[0]?.toUpperCase() || 'W'}
                                                </div>
                                                <span className="truncate max-w-[140px]">{workspace.title}</span>
                                            </div>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </nav>
            </div>

            {/* --- PHẦN DƯỚI: USER PROFILE POPUP --- */}
            <div className="p-4 border-t bg-white mt-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-md transition-all outline-none group text-left">
                            {/* Avatar: Lấy ký tự đầu của tên hoặc mặc định 'U' */}
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
                                {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                            </div>
                            
                            {/* Info User */}
                            <div className="flex-1 overflow-hidden">
                                {/* 👇 ĐÃ SỬA: full_name -> fullName */}
                                <p className="text-sm font-semibold text-gray-700 truncate group-hover:text-gray-900">
                                    {user?.fullName || "User"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user?.email || "loading..."}
                                </p>
                            </div>

                            {/* Icon mũi tên */}
                            <ChevronsUpDown className="h-4 w-4 text-gray-400 shrink-0" />
                        </button>
                    </DropdownMenuTrigger>

                    {/* Nội dung Popup */}
                    <DropdownMenuContent align="end" side="right" sideOffset={10} className="w-56">
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                {/* 👇 ĐÃ SỬA: full_name -> fullName */}
                                <p className="text-sm font-medium leading-none">{user?.fullName}</p>
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
                            <Link to="/settings" className="cursor-pointer flex items-center gap-2">
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
            </div>
        </aside>
    );
}