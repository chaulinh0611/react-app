import { Button } from '@/shared/ui/button';
import { Plus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { InvitePopover } from '../../Boards/Invite/InviteContent';

export const InviteButton = () => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button>
                    <Plus /> Share
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[600px]">
                <InvitePopover />
            </PopoverContent>
        </Popover>
    );
};
