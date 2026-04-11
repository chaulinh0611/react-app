import {
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
} from '@/shared/ui/dropdown-menu';
import { Archive, Trash, User2 } from 'lucide-react';
import { ArchivedItemsSubMenu } from '@/widgets/Boards/BoardSetting/ArchivedItemsSubMenu';
import { ChangeBackgroundSubMenu } from '@/widgets/Boards/BoardSetting/ChangeBackgroundSubMenu';
import { VisibilitySubMenu } from '@/widgets/Boards/BoardSetting/VisibilitySubMenu';
import { useDeleteBoard, useArchiveBoard } from '@/entities/board';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAnimatedToast } from '@/shared/ui/animated-toast';

export const BoardSettingContent = () => {
    const { mutate: deleteBoard } = useDeleteBoard();
    const { mutate: archiveBoard } = useArchiveBoard();
    const { boardId = '' } = useParams();
    const navigate = useNavigate();
    const { addToast } = useAnimatedToast();
    const deleteBoardHandler = () => {
        deleteBoard(
            { boardId },
            {
                onSuccess: () => {
                    navigate('/dashboard');
                    addToast({
                        title: 'Success',
                        message: 'Board deleted successfully.',
                        type: 'success',
                    });
                },
            },
        );
    };

    const archiveBoardHandler = () => {
        archiveBoard(
            { boardId },
            {
                onSuccess: () => {
                    navigate('/dashboard');
                    addToast({
                        title: 'Success',
                        message: 'Board archived successfully.',
                        type: 'success',
                    });
                },
            },
        );
    };

    return (
        <div className="flex flex-col gap-2">
            <DropdownMenuLabel>Board Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuSub>
                <ArchivedItemsSubMenu />
            </DropdownMenuSub>

            <DropdownMenuSub>
                <VisibilitySubMenu />
            </DropdownMenuSub>

            <DropdownMenuSub>
                <ChangeBackgroundSubMenu />
            </DropdownMenuSub>
            <DropdownMenuItem>
                <User2 />
                Members
            </DropdownMenuItem>

            <DropdownMenuItem onClick={archiveBoardHandler}>
                <Archive /> Archive Board
            </DropdownMenuItem>
            <DropdownMenuItem variant={'destructive'} onClick={deleteBoardHandler}>
                <Trash />
                Delete Board
            </DropdownMenuItem>
        </div>
    );
};
