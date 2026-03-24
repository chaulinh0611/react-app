import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/shared/ui/dropdown-menu';
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu';
import { UserRoundPlus, ArrowRightLeft, Copy, FileText, Archive, Trash, Image } from 'lucide-react';
import { useArchiveCard, useDeleteCard } from '@/entities/card/model/useCard';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';

import CoverMenu from './DropdownMenu/CoverMenu';
import { MoveCardDialog } from './MoveCardDialog';

interface Props {
    cardId: string;
    listId: string;
    boardId: string;
    menu: string;
    setOpen: (open: boolean) => void;
    setMenu: (menu: string) => void;
}

export default function CardOption({ cardId, listId, boardId, menu, setOpen, setMenu }: Props) {
    const { mutate: deleteCard } = useDeleteCard();
    const { mutate: archiveCard } = useArchiveCard();
    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    // const { mutate: duplicateCard } = useDuplicateCard();

    function handleDeleteCard() {
        setOpen(false);

        setTimeout(() => {
            deleteCard(cardId);
        }, 300);
    }

    function handleArchiveCard() {
        setOpen(false);

        setTimeout(() => {
            archiveCard(cardId);
        }, 300);
    }

    function handleMoveClick() {
        setIsMoveDialogOpen(true);
    }

    if (menu == 'main')
        return (
            <>
                <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                        {/* Join */}
                        <DropdownMenuItem>
                            <UserRoundPlus /> Join
                        </DropdownMenuItem>

                        {/* Move */}
                        <DropdownMenuItem onClick={handleMoveClick}>
                            <ArrowRightLeft /> Move
                        </DropdownMenuItem>

                        {/* Duplicate */}
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <Copy /> Copy
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Input placeholder="Title" />
                                    <Button>Copy</Button>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        {/* Make template */}
                        <DropdownMenuItem>
                            <FileText /> Make template
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={handleArchiveCard}>
                            <Archive /> Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                setMenu('cover');
                            }}
                        >
                            <Image /> Change cover
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={handleDeleteCard}>
                            <Trash /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
                <MoveCardDialog
                    cardId={cardId}
                    currentBoardId={boardId}
                    currentListId={listId}
                    open={isMoveDialogOpen}
                    onOpenChange={setIsMoveDialogOpen}
                />
            </>
        );
    if (menu == 'cover') {
        return (
            <DropdownMenuContent className="p-3">
                <CoverMenu cardId={cardId} setMenu={setMenu} />
            </DropdownMenuContent>
        );
    }
}
