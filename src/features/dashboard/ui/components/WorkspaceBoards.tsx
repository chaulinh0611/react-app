import { useEffect, useState } from 'react';
import { useAnimatedToast } from '@/shared/ui/animated-toast';
import type { Board } from '@/entities/board/model/board.type';
import { Link } from 'react-router-dom';
import { Users, Edit, MoreHorizontal, Trash, Star } from 'lucide-react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';
import { Archive, AlertTriangle } from 'lucide-react';
import {
    useDeleteBoard,
    useArchiveBoard,
    useGetBoardMembers,
    useToggleStarBoard,
} from '@/entities/board/model/useBoard';
import { useLocation } from 'react-router-dom';
import { useListStore } from '@/entities/list/model/list.store';
import { CreateBoardDialog } from './CreateBoardDialog';

type Props = {
    board: Board;
    viewMode: 'grid' | 'list';
    isStarred?: boolean;
};

export function WorkspaceBoards({ board, viewMode, isStarred = false }: Props) {
    const location = useLocation();
    const { addToast, removeToast } = useAnimatedToast();
    const archiveBoard = useArchiveBoard();
    const deleteBoard = useDeleteBoard();
    const toggleStar = useToggleStarBoard();
    const { data: members = [] } = useGetBoardMembers(board.id);
    const memberCount = members.length;
    const getListsByBoardId = useListStore((state) => state.getListsByBoardId);

    useEffect(() => {
        if (board.id) {
            getListsByBoardId(board.id);
        }
    }, [location.key]);
    const listCount = useListStore((state) => state.boardsLists[board.id]?.length || 0);

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        const id = addToast({
            title: 'Confirm delete',
            message: `Delete "${board.title}"?`,
            type: 'warning',
            duration: 0,

            action: {
                label: 'Delete',
                onClick: async () => {
                    removeToast(id);

                    try {
                        await deleteBoard.mutateAsync({ boardId: board.id });

                        addToast({
                            title: 'Deleted',
                            message: `Board "${board.title}" deleted successfully`,
                            type: 'success',
                        });
                    } catch (err) {
                        console.error(err);
                        addToast({
                            title: 'Error',
                            message: 'Could not delete board.',
                            type: 'error',
                        });
                    }
                },
            },

            secondaryAction: {
                label: 'Cancel',
                onClick: () => removeToast(id),
            },
        });
    };
    const handleArchiveToggle = async () => {
        try {
            await archiveBoard.mutateAsync({ boardId: board.id, workspaceId: board.workspace.id });
            addToast({
                title: board.isArchived ? 'Board unarchived' : 'Board archived',
                message: `The board "${board.title}" has been ${board.isArchived ? 'unarchived' : 'archived'} successfully.`,
                type: 'success',
            });
        } catch (err) {
            console.error(err);
            addToast({
                title: 'Error',
                message: 'Could not archive board.',
                type: 'error',
            });
        }
    };

    const handleEdit = () => {
        setIsEditDialogOpen(true);
    };

    const handleToggleStar = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleStar.mutate({ boardId: board.id });
    };

    // ===== LIST VIEW =====
    if (viewMode === 'list') {
        return (
            <>
                <Link to={`/board/${board.id}`} className="block mb-3">
                    <Card className="group transition hover:bg-muted/30 overflow-hidden">
                        <CardContent className="flex items-center gap-4 p-3">
                            <div className="relative h-12 w-20 rounded-md overflow-hidden flex-shrink-0">
                                {board.backgroundPath ? (
                                    <>
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{
                                                backgroundImage: `url(${board.backgroundPath})`,
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/20" />
                                    </>
                                ) : (
                                    <div className="absolute inset-0 bg-black/20" />
                                )}
                            </div>

                            <div className="flex-1 space-y-1.5 min-w-0">
                                <h3 className="font-semibold truncate" title={board.title}>
                                    {board.title}
                                </h3>
                                <div className="flex gap-6 text-sm text-muted-foreground">
                                    <span>{listCount} lists</span>
                                    <span>{memberCount} members</span>
                                    <span>{new Date(board.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleToggleStar}
                                className={`p-1 rounded transition-colors ${
                                    isStarred
                                        ? 'text-yellow-400 opacity-100'
                                        : 'text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-yellow-300'
                                }`}
                                title={isStarred ? 'Unstar board' : 'Star board'}
                            >
                                <Star className={`w-4 h-4 ${isStarred ? 'fill-yellow-400' : ''}`} />
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleEdit}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={handleArchiveToggle}>
                                        <Archive className="mr-2 h-4 w-4" />
                                        Archive
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setIsDeleteDialogOpen(true);
                                        }}
                                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardContent>
                    </Card>
                </Link>

                {/* Dialog edit board */}
                {isEditDialogOpen && (
                    <CreateBoardDialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        workspaceId={board.workspace.id}
                        boardToEdit={board}
                    />
                )}
            </>
        );
    }

    // ===== GRID VIEW =====
    return (
        <>
            <Card className="group relative rounded-xl overflow-hidden hover:shadow-lg">
                {board.backgroundPath ? (
                    <>
                        <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition"
                            style={{ backgroundImage: `url(${board.backgroundPath})` }}
                        />
                        <div className="absolute inset-0 bg-black/40" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600" />
                )}

                <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 flex items-center gap-1">
                    <button
                        onClick={handleToggleStar}
                        className={`p-1 rounded transition-colors ${
                            isStarred
                                ? 'text-yellow-400 opacity-100'
                                : 'text-white/70 opacity-0 group-hover:opacity-100 hover:text-yellow-300'
                        }`}
                        title={isStarred ? 'Unstar board' : 'Star board'}
                    >
                        <Star className={`w-4 h-4 ${isStarred ? 'fill-yellow-400' : ''}`} />
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleEdit}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={handleArchiveToggle}>
                                <Archive className="mr-2 h-4 w-4" />
                                Archive
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsDeleteDialogOpen(true);
                                }}
                                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Link to={`/board/${board.id}`} className="block h-full">
                    <CardContent className="relative z-10 text-white p-3 flex flex-col justify-between h-full">
                        <h3 className="font-semibold line-clamp-2">{board.title}</h3>
                        <div className="flex justify-between text-xs">
                            <span>{listCount} lists</span>
                            <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{memberCount}</span>
                            </div>
                        </div>
                    </CardContent>
                </Link>
            </Card>

            {isEditDialogOpen && (
                <CreateBoardDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    workspaceId={board.workspace.id}
                    boardToEdit={board}
                />
            )}

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div className="flex items-center gap-3 text-destructive mb-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <DialogTitle className="text-xl">Delete Board</DialogTitle>
                        </div>
                        <DialogDescription className="text-base break-words">
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-foreground break-all italic">
                                "{board.title}"
                            </span>
                            ? This action is permanent and cannot be undone. All lists and cards
                            within this board will be lost.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6 gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            className="w-full sm:w-auto shadow-sm shadow-destructive/20"
                        >
                            Delete Board
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
