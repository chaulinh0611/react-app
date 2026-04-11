import {
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/shared/ui/dropdown-menu';
import { Globe, Lock, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAnimatedToast } from '@/shared/ui/animated-toast';
import { useGetBoardById, useUpdateBoard } from '@/entities/board';
import type { BoardVisibility } from '@/entities/board';

type VisibilityOption = {
    value: BoardVisibility;
    label: string;
    description: string;
    icon: typeof Globe;
};

const visibilityOptions: VisibilityOption[] = [
    {
        value: 'private',
        label: 'Private',
        description: 'Only board members can access it.',
        icon: Lock,
    },
    {
        value: 'workspace',
        label: 'Workspace',
        description: 'Visible to people in the workspace.',
        icon: Users,
    },
    {
        value: 'public',
        label: 'Public',
        description: 'Anyone with access can open it.',
        icon: Globe,
    },
];

export const VisibilitySubMenu = () => {
    const { boardId = '' } = useParams();
    const { data: board } = useGetBoardById(boardId);
    const updateBoard = useUpdateBoard();
    const { addToast } = useAnimatedToast();

    const currentVisibility = board?.permissionLevel ?? 'workspace';

    const handleVisibilityChange = async (value: string) => {
        if (!board?.workspace?.id || value === currentVisibility) {
            return;
        }

        try {
            await updateBoard.mutateAsync({
                boardId,
                workspaceId: board.workspace.id,
                payload: {
                    permissionLevel: value as BoardVisibility,
                },
            });

            addToast({
                title: 'Visibility updated',
                message: `Board visibility changed to ${value}.`,
                type: 'success',
            });
        } catch (error) {
            console.error(error);
            addToast({
                title: 'Error',
                message: 'Could not update board visibility.',
                type: 'error',
            });
        }
    };

    return (
        <>
            <DropdownMenuSubTrigger>
                <Globe />
                Visibility
            </DropdownMenuSubTrigger>

            <DropdownMenuSubContent className="w-80 p-2">
                <DropdownMenuLabel className="px-2">Board Visibility</DropdownMenuLabel>
                <DropdownMenuSeparator className="mt-1" />

                <DropdownMenuRadioGroup
                    value={currentVisibility}
                    onValueChange={handleVisibilityChange}
                >
                    {visibilityOptions.map((option) => {
                        const Icon = option.icon;

                        return (
                            <DropdownMenuRadioItem
                                key={option.value}
                                value={option.value}
                                className="items-start py-2"
                            >
                                <div className="flex w-full items-start gap-3 pr-2">
                                    <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                        <span className="font-medium">{option.label}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {option.description}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuRadioItem>
                        );
                    })}
                </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
        </>
    );
};
