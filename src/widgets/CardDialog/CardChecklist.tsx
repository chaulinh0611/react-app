import { SquareCheckBig, Trash } from 'lucide-react';
import {
    useChecklist,
    useCreateChecklistItem,
    useDeleteChecklist,
    useUpdateChecklistItem,
    useDeleteChecklistItem,
} from '@/entities/checklist/model/useChecklist';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { useState } from 'react';

// input for add item
export function AddItemInput({
    checklistId,
    setIsAddingItem,
}: {
    checklistId: string;
    setIsAddingItem: (value: boolean) => void;
}) {
    const { mutate: addChecklistItem, isPending } = useCreateChecklistItem();
    const [content, setContent] = useState('');

    function handleAddChecklistItem() {
        if (!content.trim()) return;
        addChecklistItem(
            { checklistId, content },
            {
                onSuccess: () => {
                    setContent('');
                    setIsAddingItem(false);
                },
            },
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Input
                placeholder="Add an item"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                autoFocus
            />
            <div className="flex gap-1 shrink-0">
                <Button
                    size="sm"
                    onClick={handleAddChecklistItem}
                    disabled={isPending || !content.trim()}
                >
                    Add
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsAddingItem(false)}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}

function SingleChecklist({ item }: { item: any }) {
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [draftContent, setDraftContent] = useState('');

    const { mutate: deleteChecklist } = useDeleteChecklist();
    const { mutate: updateChecklistItem, isPending: isUpdatingItem } = useUpdateChecklistItem();
    const { mutate: deleteChecklistItem } = useDeleteChecklistItem();

    const items = item.items || [];
    const completedCount = items.filter((i: any) => i.isChecked).length;
    const totalCount = items.length;
    const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    function beginEdit(checklistItem: any) {
        setEditingItemId(checklistItem.id);
        setDraftContent(checklistItem.content ?? '');
    }

    function cancelEdit() {
        setEditingItemId(null);
        setDraftContent('');
    }

    function commitEdit(checklistItem: any) {
        const next = draftContent.trim();
        if (!next) return;
        if (next === (checklistItem.content ?? '')) {
            cancelEdit();
            return;
        }

        updateChecklistItem(
            {
                itemId: checklistItem.id,
                isChecked: !!checklistItem.isChecked,
                content: next,
            },
            {
                onSuccess: () => cancelEdit(),
            },
        );
    }

    return (
        <div className="mb-6">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    <SquareCheckBig className="h-4 w-4 text-muted-foreground" />
                    <div className="font-semibold text-base leading-none">{item.title}</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => deleteChecklist(item.id)}>
                    Delete
                </Button>
            </div>

            <div className="mt-3 ml-6">
                <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                    <span className="w-9 font-mono tabular-nums">{progress}%</span>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                            className="h-full bg-primary transition-[width] duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    {items.map((checklistItem: any) => {
                        const isEditing = editingItemId === checklistItem.id;
                        const isChecked = !!checklistItem.isChecked;

                        return (
                            <div
                                key={checklistItem.id}
                                className="group flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-accent/50"
                            >
                                <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(next) => {
                                        updateChecklistItem({
                                            itemId: checklistItem.id,
                                            isChecked: !!next,
                                            content: checklistItem.content,
                                        });
                                    }}
                                    className="mt-0.5 shrink-0"
                                />

                                <div className="min-w-0 flex-1">
                                    {isEditing ? (
                                        <Input
                                            value={draftContent}
                                            onChange={(e) => setDraftContent(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') commitEdit(checklistItem);
                                                if (e.key === 'Escape') cancelEdit();
                                            }}
                                            onBlur={() => commitEdit(checklistItem)}
                                            disabled={isUpdatingItem}
                                            className="h-8"
                                            autoFocus
                                        />
                                    ) : (
                                        <button
                                            type="button"
                                            className={
                                                'w-full text-left text-sm leading-5 wrap-break-word ' +
                                                (isChecked
                                                    ? 'text-muted-foreground line-through'
                                                    : 'text-foreground')
                                            }
                                            onClick={() => beginEdit(checklistItem)}
                                        >
                                            {checklistItem.content}
                                        </button>
                                    )}
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                                    onClick={() => deleteChecklistItem(checklistItem.id)}
                                >
                                    <Trash className="h-3.5 w-3.5 text-destructive" />
                                </Button>
                            </div>
                        );
                    })}

                    <div className="mt-2">
                        {isAddingItem ? (
                            <AddItemInput checklistId={item.id} setIsAddingItem={setIsAddingItem} />
                        ) : (
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setIsAddingItem(true)}
                            >
                                Add an item
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CardChecklist({ cardId }: { cardId: string }) {
    const { data: checklists } = useChecklist(cardId);

    if (checklists?.length > 0)
        return (
            <div className="mt-6">
                {checklists?.map((item: any) => (
                    <SingleChecklist key={item.id} item={item} />
                ))}
            </div>
        );
    return null;
}
