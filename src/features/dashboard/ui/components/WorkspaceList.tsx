import { useState, useCallback, useMemo, memo } from 'react';
import {
    useWorkspaceBoardsQuery,
    useWorkspacesQuery,
} from '@/entities/workspace/model/workspace.queries';
import { useGetAccessibleBoards, useGetStarredBoards } from '@/entities/board/model/useBoard';
import { useGetProfile } from '@/entities/auth/model/useAuthQueries';
import { CreateBoardCard } from './CreateBoardCard';
import { CreateBoardDialog } from './CreateBoardDialog';
import { WorkspaceBoards } from './WorkspaceBoards';
import { User, Briefcase, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { StarredBoardsSection } from './StarredBoardsSection';
import { RecentlyViewedSection } from './RecentlyViewedSection';
import { useRecentBoards } from '@/entities/board/model/useRecentlyViewed';
import { CreateWorkspaceDialog } from './CreateWorkspaceDialog';
import { Card } from '@/shared/ui/card';

const BoardList = memo(
    ({
        workspaceId,
        onCreateBoard,
        boards: providedBoards,
    }: {
        workspaceId: string;
        onCreateBoard?: () => void;
        boards?: any[];
    }) => {
        const { data: queriedBoards = [] } = useWorkspaceBoardsQuery(workspaceId);
        const sourceBoards = providedBoards ?? queriedBoards;
        const filtered = sourceBoards.filter((b: any) => {
            return !b.isArchived;
        });
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {filtered.map((board: any) => (
                    <WorkspaceBoards key={board.id} board={board} viewMode="grid" />
                ))}
                {onCreateBoard && <CreateBoardCard viewMode="grid" onClick={onCreateBoard} />}
            </div>
        );
    },
);

export const WorkspaceList = () => {
    const { data: workspaces = [], isLoading: isWorkspacesLoading } = useWorkspacesQuery();
    const { data: allBoards = [], isLoading: isBoardsLoading } = useGetAccessibleBoards();
    const { data: profileRes, isLoading: isProfileLoading } = useGetProfile();
    const { data: starredBoards = [] } = useGetStarredBoards();
    const currentUser = profileRes?.data;
    const { getRecentIds } = useRecentBoards(currentUser?.id);

    const starredIds = useMemo(
        () => new Set((starredBoards as any[]).map((b: any) => b.id)),
        [starredBoards],
    );

    const recentlyViewedBoards = useMemo(() => {
        const ids = getRecentIds();
        return ids
            .map((id) => (allBoards as any[]).find((b: any) => b.id === id))
            .filter(Boolean)
            .filter((b: any) => !b.isArchived && !starredIds.has(b.id))
            .slice(0, 8);
    }, [getRecentIds, allBoards, starredIds]);

    const [createBoardDialog, setCreateBoardDialog] = useState({
        open: false,
        workspaceId: '',
    });

    const [visibleCount, setVisibleCount] = useState(10);
    const [guestVisibleCount, setGuestVisibleCount] = useState(10);

    const joinedWorkspaceIds = useMemo(
        () => new Set(workspaces.map((ws: any) => ws.id)),
        [workspaces],
    );

    const guestWorkspaces = useMemo(() => {
        const guestMap: Record<
            string,
            { id: string; title: string; description: string; boards: any[] }
        > = {};

        allBoards.forEach((board: any) => {
            const ws = board.workspace;
            if (ws && !joinedWorkspaceIds.has(ws.id)) {
                if (currentUser && ws.owner?.id === currentUser.id) {
                    return;
                }

                if (!guestMap[ws.id]) {
                    guestMap[ws.id] = {
                        id: ws.id,
                        title: ws.title,
                        description: ws.description || 'Guest Workspace',
                        boards: [],
                    };
                }
                guestMap[ws.id].boards.push(board);
            }
        });

        return Object.values(guestMap);
    }, [allBoards, joinedWorkspaceIds, currentUser]);

    const handleCreateBoard = useCallback((workspaceId: string) => {
        setCreateBoardDialog({ open: true, workspaceId });
    }, []);

    const handleDialogOpenChange = useCallback((open: boolean) => {
        setCreateBoardDialog((prev) => ({ ...prev, open }));
    }, []);

    const isLoading = isWorkspacesLoading || isBoardsLoading || isProfileLoading;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p>Loading your workspaces...</p>
            </div>
        );
    }

    if (workspaces.length === 0 && guestWorkspaces.length === 0) {
        return (
            <div className="text-center  text-gray-500 py-10  rounded-lg border-2 border-dashed">
                <p className="mb-5">You don't have any workspaces yet. Create one now!</p>
                <CreateWorkspaceDialog />
            </div>
        );
    }

    return (
        <div className="space-y-12 min-w-0">
            {(starredBoards.length > 0 || recentlyViewedBoards.length > 0) && (
                <Card className="p-6">
                    {/* STARRED BOARDS */}
                    <StarredBoardsSection boards={starredBoards as any[]} />

                    {/* RECENTLY VIEWED */}
                    <RecentlyViewedSection boards={recentlyViewedBoards as any[]} />
                </Card>
            )}

            {/* YOUR WORKSPACES */}
            {workspaces.length > 0 && (
                <div className="space-y-6">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2  text-gray-700">
                            <User className="h-5 w-5" />
                            <h2 className="text-xl font-bold uppercase tracking-tight text-gray-900/80">
                                Your Workspaces
                            </h2>
                        </div>
                        <CreateWorkspaceDialog />
                    </div>

                    <Card className="">
                        {workspaces.slice(0, visibleCount).map((workspace: any) => (
                            <div
                                key={workspace.id}
                                className=" p-6 rounded-lg overflow-hidden min-w-0"
                            >
                                <div className="flex items-center justify-between  pb-3 w-full">
                                    <div className="flex items-center min-w-0 flex-1">
                                        <div className="min-w-0 flex-1">
                                            <h3
                                                className="font-bold text-xl text-gray-800 truncate"
                                                title={workspace.title}
                                            >
                                                {workspace.title}
                                            </h3>
                                            {workspace.description && (
                                                <p
                                                    className="text-sm text-gray-600 mt-1 truncate"
                                                    title={workspace.description}
                                                >
                                                    {workspace.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <BoardList
                                    workspaceId={workspace.id}
                                    onCreateBoard={() => handleCreateBoard(workspace.id)}
                                />
                            </div>
                        ))}
                    </Card>
                    {workspaces.length > visibleCount && (
                        <div className="flex justify-center pt-2">
                            <Button
                                variant="outline"
                                onClick={() => setVisibleCount((prev) => prev + 10)}
                            >
                                Show more workspaces
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* GUEST WORKSPACES */}
            {guestWorkspaces.length > 0 && (
                <div className="space-y-6 mt-12  rounded-xl  border-gray-200">
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        <h2 className="text-xl font-bold uppercase tracking-tight">
                            Guest Workspaces
                        </h2>
                    </div>

                    <Card className="space-y-8">
                        {guestWorkspaces.slice(0, guestVisibleCount).map((workspace: any) => (
                            <div
                                key={workspace.id}
                                className="space-y-4 p-6 rounded-lg  overflow-hidden min-w-0"
                            >
                                <div className="flex items-center justify-between border-b pb-3 w-full">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="min-w-0 flex-1">
                                            <h3
                                                className="font-bold text-xl text-gray-800 truncate"
                                                title={workspace.title}
                                            >
                                                {workspace.title}
                                            </h3>
                                            <p className="text-xs font-semibold text-indigo-600 bg-indigo-50 w-fit px-2.5 py-1 rounded-md mt-2 border border-indigo-100">
                                                GUEST
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <BoardList workspaceId={workspace.id} boards={workspace.boards} />
                            </div>
                        ))}
                    </Card>
                    {guestWorkspaces.length > guestVisibleCount && (
                        <div className="flex justify-center pt-2">
                            <Button
                                variant="outline"
                                onClick={() => setGuestVisibleCount((prev) => prev + 10)}
                            >
                                Show more guest workspaces
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <CreateBoardDialog
                open={createBoardDialog.open}
                onOpenChange={handleDialogOpenChange}
                workspaceId={createBoardDialog.workspaceId}
            />
        </div>
    );
};
