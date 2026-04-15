import { Card, CardContent } from '@/shared/ui/card';
import type { Card as CardType } from '@/entities/card/model/type';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog';
import CardDialog from '@/widgets/CardDialog/CardDialog';
import { useMemo, useState } from 'react';
import { Calendar, ListTodo, Paperclip, Tag, TextAlignJustify, Users } from 'lucide-react';
import { useGetMembersOnCard } from '@/entities/card/model/useCard';
import { useCardLabels } from '@/entities/label/model/useLabel';
import { LABEL_COLOR_HEX } from '@/entities/label/model/label.type';
import { useCardAttachments } from '@/entities/card';
import { useChecklist } from '@/entities/checklist/model/useChecklist';

interface ListCardProps {
    card: CardType;
    isDragging?: boolean;
    boardId: string;
    listId: string;
}

export default function ListCard({ card, isDragging, boardId, listId }: ListCardProps) {
    const [open, setOpen] = useState(false);
    const { data: cardMembers } = useGetMembersOnCard(card.id);
    const { data: labels = [] } = useCardLabels(card.id);
    const { data: attachments = [] } = useCardAttachments(card.id);
    const { data: checklists = [] } = useChecklist(card.id);

    const checklistStats = useMemo(() => {
        const items = checklists?.flatMap((checklist: any) => checklist.items || []) ?? [];
        const total = items.length;
        const completed = items.filter((item: any) => item.isChecked).length;

        return { total, completed };
    }, [checklists]);

    const formatDueDate = (value?: string | null) => {
        if (!value) return '';

        return new Date(value).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const isDueToday =
        !!card.dueDate && new Date(card.dueDate).toDateString() === new Date().toDateString();
    const isOverdue =
        !!card.dueDate &&
        new Date(card.dueDate) < new Date() &&
        new Date(card.dueDate).toDateString() !== new Date().toDateString();

    const metricClass =
        'inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-600 shadow-sm';

    const metrics = [
        card.description ? (
            <span key="description" className={metricClass} title="Description">
                <TextAlignJustify className="h-3 w-3" />
            </span>
        ) : null,
        labels.length > 0 ? (
            <span key="labels" className={metricClass} title="Labels">
                <Tag className="h-3 w-3" />
            </span>
        ) : null,
        (cardMembers?.length || 0) > 0 ? (
            <span key="members" className={metricClass} title="Members">
                <Users className="h-3 w-3" />
            </span>
        ) : null,
        attachments.length > 0 ? (
            <span key="attachments" className={metricClass} title="Attachments">
                <Paperclip className="h-3 w-3" />
                <span>{attachments.length}</span>
            </span>
        ) : null,
        checklistStats.total > 0 ? (
            <span key="checklists" className={metricClass} title="Checklist items">
                <ListTodo className="h-3 w-3" />
                <span>
                    {checklistStats.completed}/{checklistStats.total}
                </span>
            </span>
        ) : null,
        card.dueDate ? (
            <span
                key="due-date"
                className={`${metricClass} ${isOverdue ? 'border-red-200 bg-red-50 text-red-700' : isDueToday ? 'border-orange-200 bg-orange-50 text-orange-700' : ''}`}
                title={card.dueDate}
            >
                <Calendar className="h-3 w-3" />
                <span>{formatDueDate(card.dueDate)}</span>
            </span>
        ) : null,
    ].filter(Boolean);
    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);
            }}
        >
            <DialogTrigger asChild>
                <Card
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                        isDragging ? 'shadow-lg rotate-1' : ''
                    }`}
                >
                    <CardContent>
                        {card.backgroundUrl && (
                            <div
                                className="w-full h-24 mb-2 rounded-md bg-cover bg-center"
                                style={{ backgroundImage: `url(${card.backgroundUrl})` }}
                            />
                        )}
                        <h4 className="text-sm font-medium text-gray-900 mb-2 overflow-hidden text-ellipsis">
                            {card.title}
                        </h4>

                        {/* Card Labels */}
                        {labels.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-1">
                                {labels.map((label) => (
                                    <span
                                        key={label.id}
                                        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold text-white"
                                        style={{ backgroundColor: LABEL_COLOR_HEX[label.color] }}
                                    >
                                        {label.name || label.color}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="mt-2 flex flex-wrap gap-1.5">{metrics}</div>

                        {/* Card Members */}
                        {(cardMembers?.length || 0) > 0 && (
                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center -space-x-2">
                                    {cardMembers?.slice(0, 3).map((member: any) => (
                                        <Avatar
                                            key={member.userId}
                                            className="w-6 h-6 border-2 border-white ring-1 ring-gray-100"
                                        >
                                            <AvatarImage src={member.avatarUrl || undefined} />
                                            <AvatarFallback className="text-[10px]">
                                                {(member.fullName || 'U').charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                    {(cardMembers?.length || 0) > 3 && (
                                        <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-medium text-gray-600 ring-1 ring-gray-100">
                                            +{(cardMembers?.length || 0) - 3}
                                        </div>
                                    )}
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1 text-[10px] font-medium text-gray-600">
                                    <Users className="h-3 w-3" />
                                    {cardMembers?.length || 0}
                                </span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="rounded-sm min-w-5xl p-0! max-h-[min(700px,80vh)] flex flex-col overflow-hidden">
                <CardDialog card={card} setOpen={setOpen} boardId={boardId} listId={listId} />
            </DialogContent>
        </Dialog>
    );
}
