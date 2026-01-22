import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Filter, Grid, List, ArrowUpAZ, ArrowDownAZ, Clock, Calendar } from 'lucide-react';


import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

import { useBoardStore } from '@/entities/board/model/board.store';
import { useBoardMemberStore } from '@/entities/board-member/model/board-member.store';

import { BoardCard } from '@/features/dashboard/shared/components/BoardCard';
import { CreateBoardCard } from '@/features/dashboard/shared/components/CreateBoardCard';
import { CreateBoardDialog } from '@/features/dashboard/ui/CreateBoardDialog';
type SortOption = 'az' | 'za' | 'recent' | 'oldest';
type ViewMode = 'grid' | 'list';

export default function WorkspacePage() {
    const { workspaceId } = useParams<{ workspaceId: string }>();

    const { boards, fetchBoards } = useBoardStore();

    const fetchMembersByBoardId = useBoardMemberStore((s) => s.fetchMembersByBoardId);

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('recent');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    useEffect(() => {
        fetchBoards();
    }, [fetchBoards]);

    useEffect(() => {
        boards.forEach((b) => fetchMembersByBoardId(b.id));
    }, [boards, fetchMembersByBoardId]);

    const workspaceBoards = useMemo(() => {
        if (!workspaceId) return [];
        return boards.filter((b) => b.workspace?.id === workspaceId);
    }, [boards, workspaceId]);

    const workspaceTitle = workspaceBoards[0]?.workspace?.title ?? 'Workspace';

    const workspaceDescription = workspaceBoards[0]?.description ?? 'Workspace description';

    const filteredBoards = useMemo(() => {
        const filtered = workspaceBoards.filter(
            (b) =>
                b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.description?.toLowerCase().includes(searchQuery.toLowerCase()),
        );

        switch (sortBy) {
            case 'az':
                return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
            case 'za':
                return [...filtered].sort((a, b) => b.title.localeCompare(a.title));
            case 'recent':
                return [...filtered].sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                );
            case 'oldest':
                return [...filtered].sort(
                    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                );
            default:
                return filtered;
        }
    }, [workspaceBoards, searchQuery, sortBy]);

    return (
        <div>
            <header className="sticky top-0 z-10 h-16 border-b bg-white px-6 flex items-center">
                <h1 className="text-lg font-semibold">Dashboard</h1>
            </header>

            <div className="space-y-15 p-8 pt-8">
                <div className="space-y-3">
                    <h1 className="text-3xl font-bold">{workspaceTitle}</h1>
                    <p className="text-muted-foreground">{workspaceDescription}</p>
                    <p className="text-sm text-muted-foreground">
                        {workspaceBoards.length} board
                        {workspaceBoards.length !== 1 && 's'}
                    </p>
                </div>

                <div className="flex items-center justify-between gap-8">
                    <div className="flex flex-1 items-center gap-4">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search boards..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    <Filter className="h-4 w-4" />
                                    Sort
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setSortBy('az')}>
                                    <ArrowUpAZ className="mr-2 h-4 w-4" /> A–Z
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('za')}>
                                    <ArrowDownAZ className="mr-2 h-4 w-4" /> Z–A
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('recent')}>
                                    <Clock className="mr-2 h-4 w-4" /> Recent
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                                    <Calendar className="mr-2 h-4 w-4" /> Oldest
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
                        <Button
                            size="sm"
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* ===== Boards ===== */}
                <div
                    className={
                        viewMode === 'grid'
                            ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-4'
                            : 'space-y-2'
                    }
                >
                    {filteredBoards.map((board) => (
                        <BoardCard key={board.id} board={board} viewMode={viewMode} />
                    ))}

                    <CreateBoardCard
                        viewMode={viewMode}
                        onClick={() => setIsCreateDialogOpen(true)}
                    />
                    <CreateBoardDialog
                        open={isCreateDialogOpen}
                        onOpenChange={setIsCreateDialogOpen}
                        workspaceId={workspaceId!}
                    />
                </div>
            </div>
        </div>
    );
}
