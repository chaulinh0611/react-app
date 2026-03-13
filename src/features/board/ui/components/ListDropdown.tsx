import { Button } from '@/shared/ui/button';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger,
} from '@/shared/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Archive, ArrowLeftRight, Copy } from 'lucide-react';
import { useDeleteList, useArchiveList, useDuplicateList } from '@/entities/list/model/useList';
import { Input } from '@/shared/ui/input';
import { toast } from 'sonner';
import { MoveList } from './MoveList';

interface ListDropdownProps {
    setIsEditing: (value: boolean) => void;
    listId: string;
    boardId: string;
}

export const ListDropdown = ({ setIsEditing, listId, boardId }: ListDropdownProps) => {
    const [copyTitle, setCopyTitle] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { mutate: deleteList } = useDeleteList(boardId);
    const handleDelete = () => {
        deleteList(listId);
    };

    const { mutate: archiveList } = useArchiveList(boardId);
    const handleArchive = () => {
        archiveList(listId);
    };

    const { mutate: duplicateList } = useDuplicateList(boardId);
    const handleDuplicate = (title?: string) => {
        duplicateList(
            { listId, title },
            {
                onSuccess: () => {
                    setCopyTitle('');
                },
                onError: () => {
                    toast.error('Failed to duplicate list');
                },
            },
        );
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreVertical className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-50">
                <DropdownMenuLabel className="text-center">List Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Rename list */}
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Rename
                </DropdownMenuItem>

                {/* Move list */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="w-full">
                        <ArrowLeftRight className="w-4 h-4 mr-2" />
                        Move list
                    </DropdownMenuSubTrigger>
                    <MoveList currentList = {listId} currentBoard = {boardId} setIsOpen={setIsOpen} />
                </DropdownMenuSub>

                {/* Copy list */}
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="w-full">
                        <Copy className="w-4 h-4 mr-2" />
                        Copy list
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <Input
                                placeholder="New list name"
                                className="mb-2"
                                value={copyTitle}
                                onChange={(e) => setCopyTitle(e.target.value)}
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => handleDuplicate(copyTitle)}
                            >
                                Copy
                            </Button>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuSeparator />

                {/* Archive list */}
                <DropdownMenuItem onClick={handleArchive}>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={handleDelete}
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
