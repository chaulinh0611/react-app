import type { Board } from '@/entities/board/model/board.type';
import { Link } from 'react-router-dom';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { useBoardStore } from '@/entities/board/model/board.store';

export function BoardCard({ board }: { board: Board }) {
    const { deleteBoard, setIsEditDialogOpen } = useBoardStore();

    const handleDelete = () => {
        if (confirm(`Delete board "${board.title}"?`)) {
            deleteBoard(board.id);
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
                        <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
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
                    <CardTitle className="pr-8">{board.title}</CardTitle>
                    {board.description && <CardDescription>{board.description}</CardDescription>}
                </CardHeader>
            </Link>
        </Card>
    );
}
