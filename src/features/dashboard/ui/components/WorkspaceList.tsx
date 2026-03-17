import { useState, useCallback, useMemo, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WorkspaceApi } from '@/entities/workspace/api/workspace.api';
import { useBoardStore } from '@/entities/board/model/board.store';
import { CreateBoardCard } from './CreateBoardCard';
import { CreateBoardDialog } from './CreateBoardDialog';
import { WorkspaceBoards } from './WorkspaceBoards';

const BoardList = memo(
    ({ workspaceId, onCreateBoard }: { workspaceId: string; onCreateBoard: () => void }) => {
        const allBoards = useBoardStore((state) => state.boards);

        const boards = useMemo(() => {
            return allBoards.filter((b: any) => b?.workspace?.id === workspaceId && !b?.isArchived);
        }, [allBoards, workspaceId]);

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {boards.map((board: any) => (
                    <WorkspaceBoards key={board.id} board={board} viewMode="grid" />
                ))}
                <CreateBoardCard viewMode="grid" onClick={onCreateBoard} />
            </div>
        );
    },
);

export const WorkspaceList = () => {
    const { data: workspacesResponse, isLoading } = useQuery({
        queryKey: ['workspaces'],
        queryFn: async () => {
            const res = await WorkspaceApi.getWorkspaces();
            return res.data;
        }
    });

    const workspaces = useMemo(() => {
        return (workspacesResponse || []).filter((ws: any) => !ws.isArchived);
    }, [workspacesResponse]);
    const { fetchBoards } = useBoardStore();
    const [createBoardDialog, setCreateBoardDialog] = useState({
        open: false,
        workspaceId: '',
    });

    const handleCreateBoard = useCallback((workspaceId: string) => {
        setCreateBoardDialog({ open: true, workspaceId });
    }, []);

    const handleDialogOpenChange = useCallback((open: boolean) => {
        setCreateBoardDialog((prev) => ({ ...prev, open }));
    }, []);

    useMemo(() => {
        fetchBoards();
    }, [fetchBoards]);

    if (isLoading) {
        return <div className="py-10 text-center">Loading workspaces...</div>;
    }

    if (workspaces.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg border-2 border-dashed">
                <p>Bạn chưa có Workspace nào. Hãy tạo mới nhé!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {workspaces.map((workspace: any) => (
                <div key={workspace.id} className="space-y-4  p-6 rounded-lg bg-white">
                    {/* Header của Workspace */}

                    <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-3">
                            <div>
                                <h3 className="font-bold text-xl text-gray-800">
                                    {workspace.title}
                                </h3>
                                {workspace.description && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {workspace.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Danh sách Boards */}
                    <BoardList
                        workspaceId={workspace.id}
                        onCreateBoard={() => handleCreateBoard(workspace.id)}
                    />
                </div>
            ))}

            <CreateBoardDialog
                open={createBoardDialog.open}
                onOpenChange={handleDialogOpenChange}
                workspaceId={createBoardDialog.workspaceId}
            />
        </div>
    );
};
