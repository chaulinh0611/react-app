import { useEffect, useState } from 'react';
import type { Card } from '@/entities/card/model/type';
import { DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { useUpdateCard, useUploadCardAttachment } from '@/entities/card';
import { toast } from 'sonner';
import CardAction from './CardAction';
import CardComment from './CardComment';
import { Captions, EllipsisVertical, Paperclip, TextAlignJustify } from 'lucide-react';
import { Label } from '@/shared/ui/label';
import { CardChecklist } from './CardChecklist';
import CardMember from './CardMember';
import { DropdownMenu, DropdownMenuTrigger } from '@/shared/ui/dropdown-menu';
import CardOption from './CardOption';
import { validateHandle } from '@/shared/lib/validate_handle';
import CardDescription from './CardDescription';
import { Button } from '@/shared/ui/button';
import CardLabels from './CardLabels';

function normalizeDescriptionValue(value?: string | null): string {
    if (!value) return '';

    let next = value;
    for (let i = 0; i < 2; i++) {
        const trimmed = next.trim();
        const looksLikeStringLiteral =
            trimmed.startsWith('"') && trimmed.endsWith('"') && /\\["nrtu]/.test(trimmed);

        if (!looksLikeStringLiteral) break;

        try {
            const parsed = JSON.parse(trimmed);
            if (typeof parsed !== 'string') break;
            next = parsed;
        } catch {
            break;
        }
    }

    return next;
}

function sanitizeDescriptionForSave(value: string): string {
    const normalized = normalizeDescriptionValue(value).trim();
    if (!normalized) return '';

    const compact = normalized.replace(/\s/g, '');
    if (compact === '<p><br></p>' || compact === '<p></p>') return '';

    return normalized;
}

// Props
interface CardDialogProps {
    card: Card;
    setOpen: (open: boolean) => void;
    boardId: string;
    listId: string;
}

export default function CardDialog({ card, setOpen, boardId, listId }: CardDialogProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(normalizeDescriptionValue(card.description));
    const { mutate: updateCard } = useUpdateCard();
    const [menu, setMenu] = useState('main');
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const uploadAttachment = useUploadCardAttachment();

    useEffect(() => {
        setTitle(card.title);
        setDescription(normalizeDescriptionValue(card.description));
        setIsEditing(false);
        setIsEditingDescription(false);
        setMenu('main');
    }, [card.id, card.title, card.description]);

    // update card handle
    function handleUpdateCard() {
        const normalizedDescription = sanitizeDescriptionForSave(description);
        updateCard(
            {
                id: card.id,
                payload: {
                    title: title.trim(),
                    description: normalizedDescription || undefined,
                },
            },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    setIsEditingDescription(false);
                },

                onError: (error: any) => {
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

    async function handleAttachmentUpload(file: File) {
        await uploadAttachment.mutateAsync({ cardId: card.id, file });
        toast.success('Attachment uploaded successfully', {
            position: 'top-center',
        });
    }

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
                                        boardId={boardId}
                                        listId={listId}
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
                    <div className="pl-4">
                        {/* Card Action */}
                        <CardAction cardId={card.id} onAttachmentUpload={handleAttachmentUpload} />

                        {/* Card Labels */}
                        <CardLabels cardId={card.id} />

                        {/* Card members */}
                        <CardMember cardId={card.id} />
                    </div>
                    {/* Card Description */}
                    <div className="flex flex-col mt-3  gap-2 justify-between ">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <TextAlignJustify className="w-4 h-4" />
                                <Label>Description</Label>
                            </div>
                            {isEditingDescription || (
                                <Button
                                    variant={'outline'}
                                    size={'sm'}
                                    onClick={() => setIsEditingDescription(true)}
                                >
                                    Edit
                                </Button>
                            )}
                        </div>
                        <CardDescription
                            description={normalizeDescriptionValue(description) || ''}
                            isEditingDescription={isEditingDescription}
                            setDescription={setDescription}
                            handleUpdateCard={handleUpdateCard}
                            setIsEditingDescription={setIsEditingDescription}
                        />
                    </div>

                    {/* Card Checklist */}
                    <CardChecklist cardId={card.id} />

                    <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4" />
                        <Label>Attachments</Label>
                    </div>
                </div>
            </div>
            <CardComment cardId={card.id} />
        </div>
    );
}
