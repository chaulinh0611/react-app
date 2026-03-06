import { SquareCheckBig, Trash } from 'lucide-react';
import { Label } from '@/shared/ui/label';
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
                placeholder="Add item"
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
    const { mutate: deleteChecklist } = useDeleteChecklist();
    const { mutate: updateChecklistItem } = useUpdateChecklistItem();
    const { mutate: deleteChecklistItem } = useDeleteChecklistItem();

    const items = item.items || [];
    const completedCount = items.filter((i: any) => i.isChecked).length;
    const totalCount = items.length;
    const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between my-3 gap-2">
                <div className="flex items-center gap-2">
                    <SquareCheckBig className="w-4 h-4" />
                    <Label className="font-semibold text-base">{item.title}</Label>
                </div>
                <Button
                    variant={'outline'}
                    className="text-sm py-1! rounded-sm"
                    onClick={() => deleteChecklist(item.id)}
                >
                    Delete
                </Button>
            </div>

            <div className="ml-6">
                <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                    <span className="w-8 font-mono">{progress}%</span>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {items.map((checklistItem: any) => (
                        <div key={checklistItem.id} className="flex items-start gap-2 group">
                            <Checkbox
                                checked={checklistItem.isChecked}
                                onChange={(e) => {
                                    updateChecklistItem({
                                        itemId: checklistItem.id,
                                        isChecked: e.target.checked,
                                        content: checklistItem.content,
                                    });
                                }}
                                className="mt-1 shrink-0 cursor-pointer"
                            />
                            <Label
                                className={`flex-1 text-sm mt-0.5 cursor-pointer ${
                                    checklistItem.isChecked ? 'line-through text-gray-400' : ''
                                }`}
                                onClick={() => {
                                    updateChecklistItem({
                                        itemId: checklistItem.id,
                                        isChecked: !checklistItem.isChecked,
                                        content: checklistItem.content,
                                    });
                                }}
                            >
                                {checklistItem.content}
                            </Label>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                onClick={() => deleteChecklistItem(checklistItem.id)}
                            >
                                <Trash className="h-3 w-3 text-red-500" />
                            </Button>
                        </div>
                    ))}
                    <div className="mt-2">
                        {isAddingItem ? (
                            <AddItemInput checklistId={item.id} setIsAddingItem={setIsAddingItem} />
                        ) : (
                            <Button
                                variant={'outline'}
                                size={'sm'}
                                className="text-sm py-1! rounded-sm"
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
