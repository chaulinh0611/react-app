import { Button } from '@/shared/ui/button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Archive } from 'lucide-react';
import { useListStore } from '@/entities/list/model/list.store';

interface ListDropdownProps {
    setIsEditing: (value: boolean) => void;
    listId: string;
}

export const ListDropdown = ({ setIsEditing, listId }: ListDropdownProps) => {
    const { deleteList } = useListStore();

    const handleDelete = () => {
        deleteList(listId);
    };
    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem>
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
        </div>
    );
};
