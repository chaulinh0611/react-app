import { Button } from '@/shared/ui/button';
import { UserPlus, Tag, ListTodo, File } from 'lucide-react';
import { useCreateChecklist } from '@/entities/checklist/model/useChecklist';
import {
    useAssignExistingLabel,
    useBoardLabels,
    useCardLabels,
    useCreateLabel,
} from '@/entities/label/model/useLabel';
import { LABEL_COLORS, LABEL_COLOR_HEX, type LabelColor } from '@/entities/label/model/label.type';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
} from '@/shared/ui/popover';
import { Input } from '@/shared/ui/input';
import { useState } from 'react';
import { useAddMemberToCard, useGetUnassignedMembers } from '@/entities/card/model/useCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

interface CardActionProps {
    cardId: string;
    onAttachmentUpload?: (file: File) => Promise<void>;
}

export default function CardAction({ cardId, onAttachmentUpload }: CardActionProps) {
    const { boardId = '' } = useParams();
    const { mutate: createChecklist } = useCreateChecklist();
    const [title, setTitle] = useState('');
    const [labelName, setLabelName] = useState('');
    const [labelColor, setLabelColor] = useState<LabelColor>('blue');
    const [attachmentError, setAttachmentError] = useState('');
    const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
    const { mutate: addMemberToCard } = useAddMemberToCard();
    const createLabel = useCreateLabel();
    const assignLabel = useAssignExistingLabel();
    const { data: boardLabels = [] } = useBoardLabels(boardId);
    const { data: cardLabels = [] } = useCardLabels(cardId);
    const { data: unassignedMembers } = useGetUnassignedMembers(cardId);

    const unassignedBoardLabels = boardLabels.filter(
        (boardLabel) => !cardLabels.some((cardLabel) => cardLabel.id === boardLabel.id),
    );

    function handleAddChecklist() {
        createChecklist(
            { title, cardId },
            {
                onSuccess: () => {
                    setTitle('');
                },
            },
        );
    }

    function handleAssignMember(memberId: string) {
        addMemberToCard(
            { cardId, memberId },
            {
                onSuccess: () => {},
                onError(err) {
                    console.log(memberId);
                    console.error(err);
                },
            },
        );
    }

    async function handleCreateLabel() {
        try {
            await createLabel.mutateAsync({
                cardId,
                payload: {
                    color: labelColor,
                    name: labelName.trim() || undefined,
                },
            });
            setLabelName('');
            toast.success('Label created');
        } catch (error: any) {
            toast.error(error?.message || 'Create label failed');
        }
    }

    async function handleAssignExistingLabel(labelId: string) {
        try {
            await assignLabel.mutateAsync({ cardId, labelId });
            toast.success('Label assigned to card');
        } catch (error: any) {
            toast.error(error?.message || 'Assign label failed');
        }
    }

    const handleAttachmentChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) return;

        if (!onAttachmentUpload) {
            toast.error('Attachment upload is unavailable.');
            return;
        }

        try {
            setAttachmentError('');
            setIsUploadingAttachment(true);
            await onAttachmentUpload(file);
        } catch (error: any) {
            setAttachmentError(error?.message || 'Attachment upload failed');
            toast.error(error?.message || 'Attachment upload failed');
        } finally {
            setIsUploadingAttachment(false);
        }
    };

    return (
        <div className="flex gap-3">
            {/* Members */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={'outline'} className="text-[12px] rounded-sm ">
                        <UserPlus />
                        Assign Member
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start">
                    <PopoverHeader className="mb-2">
                        <PopoverTitle>Assign Member</PopoverTitle>
                    </PopoverHeader>
                    <div className="flex flex-col gap-2">
                        {unassignedMembers?.length === 0 && (
                            <p className="text-center text-sm text-muted-foreground">
                                No available members
                            </p>
                        )}
                        {unassignedMembers?.map((member: any) => (
                            <div
                                key={member.id}
                                className="flex items-center gap-2 hover:bg-gray-200"
                                onClick={() => handleAssignMember(member.userId)}
                            >
                                <Avatar>
                                    <AvatarImage src={member.avatarUrl} />
                                    <AvatarFallback>{member.fullName}</AvatarFallback>
                                </Avatar>
                                <Label>{member.fullName}</Label>
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>

            {/* Label */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={'outline'} className="text-[12px] rounded-sm ">
                        <Tag />
                        Label
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-72 space-y-3">
                    <PopoverHeader className="mb-0">
                        <PopoverTitle>Create Label</PopoverTitle>
                    </PopoverHeader>

                    <div className="space-y-2">
                        <Label>Assign existing labels on board</Label>
                        <div className="max-h-32 space-y-1 overflow-y-auto rounded-md border border-gray-200 p-2">
                            {unassignedBoardLabels.length === 0 && (
                                <p className="text-xs text-gray-500">No available board labels</p>
                            )}
                            {unassignedBoardLabels.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className="flex w-full items-center justify-between rounded px-2 py-1 text-left text-xs hover:bg-gray-100"
                                    onClick={() => handleAssignExistingLabel(item.id)}
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <span
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: LABEL_COLOR_HEX[item.color] }}
                                        />
                                        {item.name || item.color}
                                    </span>
                                    <span className="text-[10px] text-gray-500">Assign</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Color</Label>
                        <div className="flex flex-wrap gap-2">
                            {LABEL_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`h-7 w-7 rounded-full border-2 ${labelColor === color ? 'border-black' : 'border-transparent'}`}
                                    style={{ backgroundColor: LABEL_COLOR_HEX[color] }}
                                    onClick={() => setLabelColor(color)}
                                    aria-label={`Select ${color}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="label-name">Name</Label>
                        <Input
                            id="label-name"
                            value={labelName}
                            onChange={(e) => setLabelName(e.target.value)}
                            placeholder="Optional label name"
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateLabel()}
                        />
                    </div>

                    <Button
                        className="w-full"
                        onClick={handleCreateLabel}
                        disabled={createLabel.isPending}
                    >
                        {createLabel.isPending ? 'Creating...' : 'Create Label'}
                    </Button>
                </PopoverContent>
            </Popover>

            {/* Checklist */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={'outline'} className="text-[12px] rounded-sm ">
                        <ListTodo />
                        Checklist
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="flex gap-2">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter checklist title..."
                            onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist()}
                        />
                        <Button onClick={handleAddChecklist}>Add</Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Attachment */}
            <label>
                <input className="hidden" type="file" onChange={handleAttachmentChange} />
                <Button
                    variant={'outline'}
                    className="text-[12px] rounded-sm"
                    type="button"
                    disabled={isUploadingAttachment}
                    asChild
                >
                    <span>
                        <File />
                        {isUploadingAttachment ? 'Uploading...' : 'Attachment'}
                    </span>
                </Button>
            </label>

            {attachmentError && <p className="text-xs text-red-500">{attachmentError}</p>}
        </div>
    );
}
