import { Pencil, Tag, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { Switch } from '@/shared/ui/switch';
import { cn } from '@/shared/lib/utils';

import {
    LABEL_COLORS,
    LABEL_COLOR_HEX,
    type LabelColor,
    type LabelItem,
} from '@/entities/label/model/label.type';
import {
    useAssignExistingLabel,
    useBoardLabels,
    useCardLabels,
    useCreateLabel,
    useDeleteLabel,
    useUnassignLabel,
    useUpdateLabel,
} from '@/entities/label/model/useLabel';

interface CardActionLabelsProps {
    cardId: string;
}

export default function CardActionLabels({ cardId }: CardActionLabelsProps) {
    const { boardId = '' } = useParams();

    const createLabel = useCreateLabel();
    const assignLabel = useAssignExistingLabel();
    const unassignLabel = useUnassignLabel();
    const updateLabel = useUpdateLabel();
    const deleteLabel = useDeleteLabel();

    const { data: boardLabels = [] } = useBoardLabels(boardId);
    const { data: cardLabels = [] } = useCardLabels(cardId);

    const [labelName, setLabelName] = useState('');
    const [labelColor, setLabelColor] = useState<LabelColor>('blue');
    const [labelPopoverOpen, setLabelPopoverOpen] = useState(false);
    const [labelView, setLabelView] = useState<'list' | 'create' | 'edit'>('list');
    const [labelSearch, setLabelSearch] = useState('');
    const [editingLabel, setEditingLabel] = useState<LabelItem | null>(null);
    const [colorblindMode, setColorblindMode] = useState(() => {
        try {
            return localStorage.getItem('labels_colorblind_mode') === '1';
        } catch {
            return false;
        }
    });

    const labelTriggerRef = useRef<HTMLButtonElement | null>(null);
    const labelPanelRef = useRef<HTMLDivElement | null>(null);

    const labelTextClass = (color: LabelColor) =>
        color === 'yellow' || color === 'orange' ? 'text-foreground' : 'text-primary-foreground';

    const filteredBoardLabels = boardLabels.filter((l) => {
        const q = labelSearch.trim().toLowerCase();
        if (!q) return true;
        return (l.name ?? l.color).toLowerCase().includes(q);
    });

    const resetLabelPanel = () => {
        setLabelView('list');
        setLabelSearch('');
        setEditingLabel(null);
        setLabelName('');
        setLabelColor('blue');
    };

    useEffect(() => {
        if (!labelPopoverOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setLabelPopoverOpen(false);
            }
        };

        const handlePointerDown = (e: MouseEvent) => {
            const target = e.target as Node | null;
            if (!target) return;

            if (labelPanelRef.current?.contains(target)) return;
            if (labelTriggerRef.current?.contains(target)) return;

            setLabelPopoverOpen(false);
            resetLabelPanel();
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousedown', handlePointerDown, true);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousedown', handlePointerDown, true);
        };
    }, [labelPopoverOpen]);

    const openCreateLabel = () => {
        setLabelView('create');
        setEditingLabel(null);
        setLabelName('');
        setLabelColor('blue');
    };

    const openEditLabel = (label: LabelItem) => {
        setLabelView('edit');
        setEditingLabel(label);
        setLabelName(label.name ?? '');
        setLabelColor(label.color);
    };

    const handleToggleColorblind = (next: boolean) => {
        setColorblindMode(next);
        try {
            localStorage.setItem('labels_colorblind_mode', next ? '1' : '0');
        } catch {
            // ignore
        }
    };

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
            setLabelView('list');
            setEditingLabel(null);
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

    async function handleUnassignExistingLabel(labelId: string) {
        try {
            await unassignLabel.mutateAsync({ cardId, labelId });
            toast.success('Label removed from card');
        } catch (error: any) {
            toast.error(error?.message || 'Remove label failed');
        }
    }

    async function handleUpdateEditingLabel() {
        if (!editingLabel) return;

        try {
            await updateLabel.mutateAsync({
                cardId,
                labelId: editingLabel.id,
                payload: {
                    color: labelColor,
                    name: labelName.trim() || undefined,
                },
            });
            toast.success('Label updated');
            setLabelView('list');
            setEditingLabel(null);
        } catch (error: any) {
            toast.error(error?.message || 'Update label failed');
        }
    }

    async function handleDeleteEditingLabel() {
        if (!editingLabel) return;

        try {
            await deleteLabel.mutateAsync({ cardId, labelId: editingLabel.id });
            toast.success('Label deleted');
            setLabelView('list');
            setEditingLabel(null);
        } catch (error: any) {
            toast.error(error?.message || 'Delete label failed');
        }
    }

    return (
        <div className="relative">
            <Button
                ref={labelTriggerRef}
                type="button"
                variant={'outline'}
                className="text-[12px] rounded-sm"
                onClick={() => {
                    setLabelPopoverOpen((prev) => {
                        const next = !prev;
                        if (!next) {
                            resetLabelPanel();
                        }
                        return next;
                    });
                }}
            >
                <Tag />
                Label
            </Button>

            {labelPopoverOpen ? (
                <div
                    className="absolute top-full left-0 z-50 mt-2 pointer-events-none"
                    aria-hidden={false}
                >
                    <div
                        ref={labelPanelRef}
                        className="pointer-events-auto w-80 max-w-[calc(100vw-2rem)] rounded-md border border-border bg-popover p-0 text-popover-foreground shadow-md"
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-label="Labels"
                    >
                        <div className="flex items-center border-b border-border px-3 py-2">
                            <div className="w-7" />
                            <p className="flex-1 text-center text-sm font-semibold">
                                {labelView === 'list'
                                    ? 'Labels'
                                    : labelView === 'create'
                                      ? 'Create label'
                                      : 'Edit label'}
                            </p>
                            <Button
                                type="button"
                                size="icon-xs"
                                variant="ghost"
                                onClick={() => {
                                    setLabelPopoverOpen(false);
                                    resetLabelPanel();
                                }}
                                aria-label="Close"
                            >
                                <X />
                            </Button>
                        </div>

                        <div className="flex flex-col gap-3 p-3">
                            {labelView === 'list' ? (
                                <>
                                    <Input
                                        value={labelSearch}
                                        onChange={(e) => setLabelSearch(e.target.value)}
                                        placeholder="Search labels..."
                                    />

                                    <div className="flex flex-col gap-2">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Labels
                                        </p>

                                        <ScrollArea className="max-h-64">
                                            <div className="flex flex-col gap-2 pr-2">
                                                {filteredBoardLabels.length === 0 ? (
                                                    <p className="py-2 text-center text-xs text-muted-foreground">
                                                        No labels found
                                                    </p>
                                                ) : null}

                                                {filteredBoardLabels.map((item) => {
                                                    const checked = cardLabels.some(
                                                        (l) => l.id === item.id,
                                                    );
                                                    const isPending =
                                                        assignLabel.isPending ||
                                                        unassignLabel.isPending;

                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Checkbox
                                                                checked={checked}
                                                                onCheckedChange={(v) => {
                                                                    const nextChecked = v === true;
                                                                    if (nextChecked) {
                                                                        handleAssignExistingLabel(
                                                                            item.id,
                                                                        );
                                                                    } else {
                                                                        handleUnassignExistingLabel(
                                                                            item.id,
                                                                        );
                                                                    }
                                                                }}
                                                                disabled={isPending}
                                                                aria-label={
                                                                    checked
                                                                        ? 'Remove label from card'
                                                                        : 'Add label to card'
                                                                }
                                                            />

                                                            <button
                                                                type="button"
                                                                className={cn(
                                                                    'h-8 flex-1 rounded-sm px-3 text-left text-sm font-medium',
                                                                    labelTextClass(item.color),
                                                                )}
                                                                style={{
                                                                    backgroundColor:
                                                                        LABEL_COLOR_HEX[item.color],
                                                                }}
                                                                onClick={() =>
                                                                    checked
                                                                        ? handleUnassignExistingLabel(
                                                                              item.id,
                                                                          )
                                                                        : handleAssignExistingLabel(
                                                                              item.id,
                                                                          )
                                                                }
                                                                disabled={isPending}
                                                            >
                                                                {item.name || item.color}
                                                            </button>

                                                            <Button
                                                                type="button"
                                                                size="icon-xs"
                                                                variant="ghost"
                                                                onClick={() => openEditLabel(item)}
                                                                aria-label="Edit label"
                                                            >
                                                                <Pencil />
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </ScrollArea>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="w-full"
                                        onClick={openCreateLabel}
                                    >
                                        Create a new label
                                    </Button>

                                    <Separator />

                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm">Enable colorblind friendly mode</p>
                                        <Switch
                                            checked={colorblindMode}
                                            onCheckedChange={handleToggleColorblind}
                                            aria-label="Enable colorblind friendly mode"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div
                                        className={cn(
                                            'h-9 rounded-sm px-3 text-sm font-medium flex items-center',
                                            labelTextClass(labelColor),
                                        )}
                                        style={{
                                            backgroundColor: LABEL_COLOR_HEX[labelColor],
                                        }}
                                    >
                                        {labelName.trim() ||
                                            (editingLabel?.name ?? 'Label') ||
                                            labelColor}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Title
                                        </p>
                                        <Input
                                            value={labelName}
                                            onChange={(e) => setLabelName(e.target.value)}
                                            placeholder="Label name"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Select a color
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {LABEL_COLORS.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    className={cn(
                                                        'size-7 rounded-sm ring-offset-background focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                                                        labelColor === color
                                                            ? 'ring-2 ring-ring ring-offset-2'
                                                            : 'ring-1 ring-border',
                                                    )}
                                                    style={{
                                                        backgroundColor: LABEL_COLOR_HEX[color],
                                                    }}
                                                    onClick={() => setLabelColor(color)}
                                                    aria-label={`Select ${color}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {labelView === 'create' ? (
                                        <Button
                                            type="button"
                                            className="w-full"
                                            onClick={handleCreateLabel}
                                            disabled={createLabel.isPending}
                                        >
                                            {createLabel.isPending ? 'Creating...' : 'Create'}
                                        </Button>
                                    ) : (
                                        <>
                                            <Button
                                                type="button"
                                                className="w-full"
                                                onClick={handleUpdateEditingLabel}
                                                disabled={updateLabel.isPending}
                                            >
                                                {updateLabel.isPending ? 'Saving...' : 'Save'}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                className="w-full"
                                                onClick={handleDeleteEditingLabel}
                                                disabled={deleteLabel.isPending}
                                            >
                                                {deleteLabel.isPending ? 'Deleting...' : 'Delete'}
                                            </Button>
                                        </>
                                    )}

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full"
                                        onClick={() => {
                                            setLabelView('list');
                                            setEditingLabel(null);
                                        }}
                                    >
                                        Back
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
