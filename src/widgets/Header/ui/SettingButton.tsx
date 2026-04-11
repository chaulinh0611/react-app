import { Button } from '@/shared/ui/button';
import { Settings } from 'lucide-react';
import { BoardSettingContent } from '../../Boards/BoardSetting/BoardSettingContent';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
export const SettingButton = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <Settings />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                <BoardSettingContent />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
