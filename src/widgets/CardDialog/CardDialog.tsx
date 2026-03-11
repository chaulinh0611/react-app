import { useState } from 'react';
import type { Card } from '@/entities/card/model/type';
import { DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { useUpdateCard } from '@/entities/card/model/useCard';
import { toast } from 'sonner';
import CardAction from './CardAction';
import CardComment from './CardComment';
import { Captions, EllipsisVertical, TextAlignJustify } from 'lucide-react';
import { Label } from '@/shared/ui/label';
import { CardChecklist } from './CardChecklist';
import CardMember from './CardMember';
import { DropdownMenu, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import CardOption from './CardOption';
import { validateHandle } from '@/shared/lib/validate_handle';

// Props
interface CardDialogProps {
    card: Card;
    setOpen: (open: boolean) => void;
}

export default function CardDialog({ card, setOpen }: CardDialogProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description);
    const { mutate: updateCard } = useUpdateCard();
    const [menu, setMenu] = useState('main');

    // update card handle
    function handleUpdateCard() {
        updateCard(
            { id: card.id, payload: { title, description: description || undefined } },
            {
                onSuccess: () => {
                    setIsEditing(false);
                },

                onError: (error) => {
                    if (error.error_code == 'VALIDATE_ERROR') {
                        toast.error((validateHandle(error) as string) || 'Something went wrong!', {
                            position: 'top-center',
                        });
                        return;
                    }
                    toast.error(error.message || 'Something went wrong', {
                        position: 'top-center',
                    });
                },
            },
        );
    }

    function handleCopyLink() {}
    return (
        <div className="flex flex-row min-h-0 flex-1 min-w-0">
            <div className="flex-4 min-w-0 min-h-0 border-r border-gray-200 flex flex-col">
                <DialogHeader className="border-b gap-0 border-gray-200">
                    {/* Card cover */}
                    {card.backgroundUrl && (
                        <div className="w-full min-w-0">
                            <img
                                src={card.backgroundUrl}
                                alt=""
                                className="w-full h-auto max-h-48 object-cover border-b border-gray-200"
                            />
                        </div>
                    )}
                    {/* Card Title */}
                    <div className="p-2 w-full min-w-0">
                        {isEditing ? (
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUpdateCard()}
                                onBlur={() => handleUpdateCard()}
                                className="text-sm font-semibold bg-white"
                                autoFocus
                            />
                        ) : (
                            <div className="flex flex-row items-center gap-2 w-full min-w-0">
                                <Captions className="shrink-0" />
                                <DialogTitle
                                    className="text-lg font-mono hover:bg-gray-200 truncate rounded py-1 cursor-pointer font-semibold flex-1 min-w-0 text-left"
                                    onClick={() => setIsEditing(true)}
                                >
                                    {card.title}
                                </DialogTitle>
                                <DropdownMenu
                                    onOpenChange={(e) => {
                                        if (!e) setMenu('main');
                                    }}
                                >
                                    <DropdownMenuTrigger>
                                        <EllipsisVertical className="w-4 h-4" />
                                    </DropdownMenuTrigger>
                                    <CardOption
                                        cardId={card.id}
                                        menu={menu}
                                        setOpen={setOpen}
                                        setMenu={setMenu}
                                    />
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                </DialogHeader>

                <div className="flex-1 mt-2 overflow-y-auto px-4 pb-4">
                    {/* Card Action */}
                    <CardAction cardId={card.id} />

                    {/* Card Description */}
                    <div className="flex items-center mt-3 gap-2">
                        <TextAlignJustify className="w-4 h-4" />
                        <Label>Description</Label>
                    </div>

                    <textarea
                        value={description || ''}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={() => handleUpdateCard()}
                        className="mt-2 w-full p-3 border rounded-md min-h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a description"
                    />
                    {/* Card members */}
                    <CardMember cardId={card.id} />

                    {/* Card Checklist */}
                    <CardChecklist cardId={card.id} />
                </div>
            </div>
            <CardComment cardId={card.id} />
        </div>
    );
}
