import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '@/shared/ui/dropdown-menu';
import { DropdownMenuGroup } from '@radix-ui/react-dropdown-menu';
import {
    UserRoundPlus,
    ArrowRightLeft,
    Copy,
    FileText,
    Archive,
    Trash,
    Image,
    ArrowLeft,
} from 'lucide-react';
import { useDeleteCard } from '@/entities/card/model/useCard';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

import CoverMenu from './DropdownMenu/CoverMenu';

interface Props {
    cardId: string;
    menu: string;
    setOpen: (open: boolean) => void;
    setMenu: (menu: string) => void;
}

export default function CardOption({ cardId, menu, setOpen, setMenu }: Props) {
    const { mutate: deleteCard } = useDeleteCard();
    // const { mutate: duplicateCard } = useDuplicateCard();
    function handleDeleteCard() {
        setOpen(false);

        setTimeout(() => {
            deleteCard(cardId);
        }, 300);
    }

    if (menu == 'main')
        return (
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    {/* Join */}
                    <DropdownMenuItem>
                        <UserRoundPlus /> Join
                    </DropdownMenuItem>

                    {/* Move */}
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <ArrowRightLeft /> Move
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent></DropdownMenuSubContent>
                    </DropdownMenuSub>

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
                    <DropdownMenuItem>
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
        );
    if (menu == 'cover') {
        return (
            <DropdownMenuContent className="p-3">
                <CoverMenu cardId={cardId} setMenu={setMenu} />
            </DropdownMenuContent>
        );
    }
}
