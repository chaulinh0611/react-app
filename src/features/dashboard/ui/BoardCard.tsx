import type { Board } from '@/entities/board';
import { Link } from 'react-router-dom';
import { Edit, MoreHorizontal, Trash, Globe, Lock, UsersRound } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { useDeleteBoard } from '@/entities/board';

export function BoardCard({ board }: { board: Board }) {
    const deleteBoard = useDeleteBoard();
    const visibilityMeta = {
        private: {
            label: 'Private',
            icon: Lock,
            className: 'bg-slate-900/80 text-white',
        },
        workspace: {
            label: 'Workspace',
            icon: UsersRound,
            className: 'bg-sky-500/80 text-white',
        },
        public: {
            label: 'Public',
            icon: Globe,
            className: 'bg-emerald-500/80 text-white',
        },
    } as const;

    const visibility = visibilityMeta[board.permissionLevel];

    const handleDelete = () => {
        if (confirm(`Delete board "${board.title}"?`)) {
            deleteBoard.mutate({ boardId: board.id });
        }
    };

    return (
        <Card className="cursor-pointer hover:shadow-md transition-shadow group relative">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit board
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                            <Trash className="w-4 h-4 mr-2" />
                            Delete board
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Link to={`/board/${board.id}`}>
                <CardHeader>
                    <span
                        className={`mb-2 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${visibility.className}`}
                    >
                        <visibility.icon className="h-3 w-3" />
                        {visibility.label}
                    </span>
                    <CardTitle className="pr-8">{board.title}</CardTitle>
                    {board.description && <CardDescription>{board.description}</CardDescription>}
                </CardHeader>
            </Link>
        </Card>
    );
}
