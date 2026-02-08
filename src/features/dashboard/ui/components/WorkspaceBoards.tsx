import type { Board } from '@/entities/board/model/board.type';
import { Link } from 'react-router-dom';
import { Kanban, Users, Edit, MoreHorizontal, Trash } from 'lucide-react';

import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

import { useBoardStore } from '@/entities/board/model/board.store';
import { useMemberCountByBoardId } from '@/entities/board-member/model/board-member.selector';
import { useListStore } from '@/entities/list/model/list.store';

type Props = {
    board: Board;
    viewMode: 'grid' | 'list';
};

export function WorkspaceBoards({ board, viewMode }: Props) {
    const { deleteBoard } = useBoardStore();
    const memberCount = useMemberCountByBoardId(board.id);
    const listCount = useListStore((state) => state.boardsLists[board.id]?.length || 0);
    const setIsEditDialogOpen = useListStore((state) => state.setIsEditDialogOpen);
    const handleDelete = () => {
        if (confirm(`Delete "${board.title}"?`)) {
            deleteBoard(board.id);
        }
    };

    /* ================= LIST MODE ================= */
    if (viewMode === 'list') {
        return (
            <Link to={`/board/${board.id}`} className="block mb-3">
                <Card className="group transition hover:bg-muted/30 ">
                    <CardContent className=" flex items-center gap-6 ">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                            <Kanban className="h-5 w-5 text-white" />
                        </div>

                        <div className="flex-1 space-y-1.5">
                            <h3 className="font-semibold leading-tight">{board.title}</h3>

                            <div className="mt-1 flex flex-wrap gap-6 text-sm text-muted-foreground">
                                <span>{listCount} lists</span>
                                <span>{memberCount} members</span>
                                <span>
                                    Created {new Date(board.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="opacity-0 group-hover:opacity-100 transition">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setIsEditDialogOpen(true);
                                        }}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete();
                                        }}
                                        className="text-destructive"
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        );
    }

    /* ================= GRID MODE ================= */
    return (
        <Card
            className="
                group relative
                rounded-xl border bg-card
                transition-all
                hover:-translate-y-1 hover:shadow-lg
                px-6
            "
        >
            {/* Actions */}
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Link to={`/board/${board.id}`} className="block h-full">
                <CardContent className="flex p-2! h-full justify-between flex-col gap-2">
                    <div className="flex items-start gap-2">
                        <h3 className="text-base font-semibold overflow-hidden text-ellipsis line-clamp-2 leading-tight">
                            {board.title}
                        </h3>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{listCount} lists</span>
                            <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{memberCount}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}
