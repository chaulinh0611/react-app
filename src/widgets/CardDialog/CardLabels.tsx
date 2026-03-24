import { useState } from 'react';
import { Tag, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
    LABEL_COLORS,
    LABEL_COLOR_HEX,
    type LabelColor,
    type LabelItem,
} from '@/entities/label/model/label.type';
import { useCardLabels, useDeleteLabel, useUpdateLabel } from '@/entities/label/model/useLabel';

interface CardLabelsProps {
    cardId: string;
}

export default function CardLabels({ cardId }: CardLabelsProps) {
    const { data: labels = [], isLoading } = useCardLabels(cardId);
    const updateLabel = useUpdateLabel();
    const deleteLabel = useDeleteLabel();

    const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [editingColor, setEditingColor] = useState<LabelColor>('blue');

    const startEdit = (label: LabelItem) => {
        setEditingLabelId(label.id);
        setEditingName(label.name ?? '');
        setEditingColor(label.color);
    };

    const cancelEdit = () => {
        setEditingLabelId(null);
        setEditingName('');
    };

    const handleUpdate = async () => {
        if (!editingLabelId) return;

        try {
            await updateLabel.mutateAsync({
                cardId,
                labelId: editingLabelId,
                payload: {
                    color: editingColor,
                    name: editingName.trim() || undefined,
                },
            });
            toast.success('Label updated');
            cancelEdit();
        } catch (error: any) {
            toast.error(error?.message || 'Update label failed');
        }
    };

    const handleDelete = async (labelId: string) => {
        try {
            await deleteLabel.mutateAsync({ cardId, labelId });
            toast.success('Label deleted');
            if (editingLabelId === labelId) {
                cancelEdit();
            }
        } catch (error: any) {
            toast.error(error?.message || 'Delete label failed');
        }
    };

    return (
        <div className="mt-4 space-y-3 rounded-lg border border-gray-200 p-3">
            <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <Label>Labels</Label>
            </div>

            <div className="flex flex-wrap gap-2">
                {labels.map((label) => {
                    const isEditing = editingLabelId === label.id;
                    return (
                        <div
                            key={label.id}
                            className="flex items-center gap-2 rounded-md border px-2 py-1"
                            style={{ borderColor: LABEL_COLOR_HEX[label.color] }}
                        >
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: LABEL_COLOR_HEX[label.color] }}
                            />

                            {isEditing ? (
                                <Input
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="h-7 w-32"
                                    placeholder="Label name"
                                />
                            ) : (
                                <span className="text-xs font-medium">
                                    {label.name || label.color}
                                </span>
                            )}

                            <div className="flex items-center gap-1">
                                {isEditing ? (
                                    <>
                                        <Button size="sm" className="h-7" onClick={handleUpdate}>
                                            Save
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7"
                                            onClick={cancelEdit}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6"
                                        onClick={() => startEdit(label)}
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-6 w-6 text-red-500"
                                    onClick={() => handleDelete(label.id)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
                {!isLoading && labels.length === 0 && (
                    <p className="text-xs text-gray-500">No labels on this card.</p>
                )}
            </div>

            {editingLabelId && (
                <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-600">Change color</p>
                    <div className="flex flex-wrap gap-2">
                        {LABEL_COLORS.map((item) => (
                            <button
                                key={`edit-${item}`}
                                type="button"
                                className={`h-6 w-6 rounded-full border-2 ${editingColor === item ? 'border-black' : 'border-transparent'}`}
                                style={{ backgroundColor: LABEL_COLOR_HEX[item] }}
                                onClick={() => setEditingColor(item)}
                                aria-label={`Edit color ${item}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
