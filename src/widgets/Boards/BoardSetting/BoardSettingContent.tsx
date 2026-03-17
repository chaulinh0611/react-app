import {
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
} from '@/shared/ui/dropdown-menu';
import { Archive, EarthIcon, Trash, User2 } from 'lucide-react';
import { ArchivedItemsSubMenu } from '@/widgets/Boards/BoardSetting/ArchivedItemsSubMenu';
import { ChangeBackgroundSubMenu } from '@/widgets/Boards/BoardSetting/ChangeBackgroundSubMenu';

export const BoardSettingContent = () => {
    return (
        <div className="flex flex-col gap-2">
            <DropdownMenuLabel>Board Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuSub>
                <ArchivedItemsSubMenu />
            </DropdownMenuSub>

            <DropdownMenuItem>
                <EarthIcon />
                Visibility
            </DropdownMenuItem>
            <DropdownMenuSub>
                <ChangeBackgroundSubMenu />
            </DropdownMenuSub>
            <DropdownMenuItem>
                <User2 />
                Members
            </DropdownMenuItem>

            <DropdownMenuItem>
                <Archive /> Archive Board
            </DropdownMenuItem>
            <DropdownMenuItem variant={'destructive'}>
                <Trash />
                Delete Board
            </DropdownMenuItem>
        </div>
    );
};
