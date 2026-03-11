import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/shared/ui/dropdown-menu';

export const BoardSettingContent = () => {
    return (
        <div className="flex flex-col gap-2">
            <DropdownMenuLabel>Board Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Board Settings</DropdownMenuItem>
            <DropdownMenuItem>Board Settings</DropdownMenuItem>
            <DropdownMenuItem>Board Settings</DropdownMenuItem>
        </div>
    );
};
