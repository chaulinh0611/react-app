import { Link } from 'react-router';
import { Kanban, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
export function BoardCard({ board } : any) {
    return (
        <>
            <Card className="cursor-pointer hover:shadow-md transition-shadow group relative w-100 h-40">
                {/* Board Actions Dropdown */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Board
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Trash className="w-4 h-4 mr-2" />
                                Delete Board
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <Link to={`/board/${board.id}`}>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 pr-8">
                            <Kanban className="h-4 w-4" />
                            {board.title}
                        </CardTitle>
                        {board.description && (
                            <CardDescription className="text-sm">
                                {board.description}
                            </CardDescription>
                        )}
                    </CardHeader>
                </Link>
            </Card>
        </>
    );
}
