import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { useWorkspaces } from "@/entities/workspace/model/workspace.selector";
import { useBoardStore } from "@/entities/board/model/board.store";
import { CreateBoardCard } from "./CreateBoardCard";
import { CreateBoardDialog } from "../../ui/CreateBoardDialog";
import { BoardCard } from "./BoardCard";

const WorkspaceBoards = memo(({ workspaceId, onCreateBoard }: { workspaceId: string; onCreateBoard: () => void }) => {
    const allBoards = useBoardStore(state => state.boards);

    const boards = useMemo(() => {
        return allBoards.filter(b => b?.workspace?.id === workspaceId && !b?.isArchived);
    }, [allBoards, workspaceId]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <CreateBoardCard
                viewMode="grid"
                onClick={onCreateBoard}
            />
            {boards.map((board) => (
                <BoardCard
                    key={board.id}
                    board={board}
                    viewMode="grid"
                />
            ))}
        </div>
    );
});

export const WorkspaceList = () => {
    const workspaces = useWorkspaces();
    const { fetchBoards } = useBoardStore();
    const [createBoardDialog, setCreateBoardDialog] = useState({
        open: false,
        workspaceId: '',
    });

    const workspaceList = useMemo(() => {
        return workspaces ? Object.values(workspaces) : [];
    }, [workspaces]);

    const handleCreateBoard = useCallback((workspaceId: string) => {
        setCreateBoardDialog({ open: true, workspaceId });
    }, []);

    const handleDialogOpenChange = useCallback((open: boolean) => {
        setCreateBoardDialog(prev => ({ ...prev, open }));
    }, []);

    useEffect(() => {
        fetchBoards();
    }, []);

    useEffect(() => {
        console.log("Danh sách Workspace trong Store:", workspaces);
    }, [workspaces]);

    if (!workspaces || workspaceList.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg border-2 border-dashed">
                <p>Bạn chưa có Workspace nào. Hãy tạo mới nhé!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {workspaceList.map((workspace: any) => (
                <div key={workspace.id} className="space-y-4 border p-6 rounded-lg shadow-sm bg-white">
                    {/* Header của Workspace */}
                    <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg text-white flex items-center justify-center font-bold text-lg shadow-md">
                                {workspace.title ? workspace.title.charAt(0).toUpperCase() : 'W'}
                            </div>
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
                    <WorkspaceBoards
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