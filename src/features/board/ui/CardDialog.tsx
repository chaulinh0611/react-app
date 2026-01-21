// import { useState } from 'react';
import { Trash2, X, CheckSquare, UserPlus, Tag, Check, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
// import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Separator } from '@/shared/ui/separator';
// import { Badge } from '@/shared/ui/badge';
import type { Card as CardType } from '@/entities/card/models/card.type';
import { useCardStore } from '@/entities/card/models/card.store';
import { useEffect, useState, useMemo } from 'react';
import { useListStore } from '@/entities/list/models/list.store';
import { useChecklistStore } from '@/entities/checklist/model/checklist.store';

interface CardDialogProps {
    card: CardType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CardDialog({ card, open, onOpenChange }: CardDialogProps) {
    const [description, setDescription] = useState(card.description || '');
    const [title, setTitle] = useState(card.title || '');
    const [newChecklistTitle, setNewChecklistTitle] = useState('');
    const [newItemContents, setNewItemContents] = useState<Record<string, string>>({});
    const { updateCard, deleteCard } = useCardStore();
    const lists = useListStore((state) => state.lists);
    const list = card?.listId ? lists[card.listId] : undefined;
    const {
        checklists,
        checklistItems,
        cardChecklists,
        getChecklistsOnCard,
        createChecklist,
        deleteChecklist,
        addChecklistItem,
        updateChecklistItems,
        deleteChecklistItem,
    } = useChecklistStore();

    const cardChecklistIds = useMemo(
        () => cardChecklists[card.id] || [],
        [cardChecklists, card.id],
    );
    const cardChecklistsData = useMemo(
        () => cardChecklistIds.map((id) => checklists[id]).filter(Boolean),
        [cardChecklistIds, checklists],
    );

    useEffect(() => {
        setTitle(card.title || '');
        setDescription(card.description || '');
        if (open && card.id) {
            getChecklistsOnCard(card.id);
        }
    }, [card, open, getChecklistsOnCard]);

    const handleUpdateCard = async () => {
        try {
            await updateCard(card.id, {
                title: title,
                description: description,
            });
        } catch (err) {
            console.error('Failed to update card:', err);
        }
    };

    const handleCreateChecklist = async () => {
        if (!newChecklistTitle.trim()) return;
        try {
            await createChecklist(newChecklistTitle, card.id);
            setNewChecklistTitle('');
        } catch (err) {
            console.error('Failed to create checklist:', err);
        }
    };

    const handleDeleteChecklist = async (checklistId: string) => {
        try {
            await deleteChecklist(checklistId);
        } catch (err) {
            console.error('Failed to delete checklist:', err);
        }
    };

    const handleAddChecklistItem = async (checklistId: string) => {
        const content = newItemContents[checklistId];
        if (!content?.trim()) return;
        try {
            await addChecklistItem(checklistId, content);
            setNewItemContents((prev) => ({ ...prev, [checklistId]: '' }));
        } catch (err) {
            console.error('Failed to add checklist item:', err);
        }
    };

    const handleToggleChecklistItem = async (itemId: string) => {
        const item = checklistItems[itemId];
        if (!item) return;
        try {
            await updateChecklistItems(itemId, item.content, !item.isChecked);
        } catch (err) {
            console.error('Failed to toggle checklist item:', err);
        }
    };

    const handleDeleteChecklistItem = async (itemId: string) => {
        try {
            await deleteChecklistItem(itemId);
        } catch (err) {
            console.error('Failed to delete checklist item:', err);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCard(card.id);
            onOpenChange(false);
        } catch (err) {
            console.error('Failed to delete card:', err);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto [&>button]:hidden">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-semibold">
                            {list?.title || 'Card Details'}
                        </DialogTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="h-6 w-6 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <DialogDescription className="sr-only">
                        Edit card details, assign users, and manage comments
                    </DialogDescription>
                </DialogHeader>
                Action Buttons
                <div className="flex gap-2 flex-wrap">
                    <Popover>
                        <PopoverTrigger>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Tag className="w-4 h-4" />
                                Add tags
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-96"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-3">Tags</h3>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <CheckSquare className="w-4 h-4" />
                                Add checklist
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-96"
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-3">Add Checklist</h3>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter checklist title"
                                            value={newChecklistTitle}
                                            onChange={(e) => setNewChecklistTitle(e.target.value)}
                                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleCreateChecklist();
                                                }
                                            }}
                                            className="flex-1"
                                        />
                                        <Button
                                            size="sm"
                                            onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation();
                                                handleCreateChecklist();
                                            }}
                                            disabled={!newChecklistTitle.trim()}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Add member
                    </Button>
                </div>
                <div className="space-y-6">
                    {/* Card Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={handleUpdateCard}
                            className="text-lg font-medium"
                        />
                    </div>

                    {/* Card Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={handleUpdateCard}
                            placeholder="Add a description..."
                            className="w-full p-3 border rounded-md min-h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Checklists */}
                    {cardChecklistsData.length > 0 && (
                        <div className="space-y-4">
                            {cardChecklistsData.map((checklist) => {
                                const items = (checklist.items || [])
                                    .map((itemId) => checklistItems[itemId])
                                    .filter(Boolean);
                                const completedCount = items.filter(
                                    (item) => item.isChecked,
                                ).length;
                                const totalCount = items.length;
                                const percentage =
                                    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                                return (
                                    <div key={checklist.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <CheckSquare className="w-4 h-4" />
                                                <Label className="text-base font-semibold">
                                                    {checklist.title}
                                                </Label>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDeleteChecklist(checklist.id)}
                                                className="h-6 px-2 hover:bg-red-100"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs text-gray-600">
                                                <span>{Math.round(percentage)}%</span>
                                                <span>
                                                    {completedCount}/{totalCount}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Checklist items */}
                                        {items.length > 0 && (
                                            <div className="space-y-2">
                                                {items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50"
                                                    >
                                                        <button
                                                            className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                                                item.isChecked
                                                                    ? 'bg-green-500 border-green-500 text-white'
                                                                    : 'border-gray-300 hover:border-gray-400'
                                                            }`}
                                                            onClick={() =>
                                                                handleToggleChecklistItem(item.id)
                                                            }
                                                        >
                                                            {item.isChecked && (
                                                                <Check className="w-3 h-3" />
                                                            )}
                                                        </button>
                                                        <span
                                                            className={`flex-1 text-sm ${
                                                                item.isChecked
                                                                    ? 'line-through text-gray-500'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {item.content}
                                                        </span>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-6 w-6 p-0 hover:bg-red-100"
                                                            onClick={() =>
                                                                handleDeleteChecklistItem(item.id)
                                                            }
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Add item input */}
                                        <div className="flex gap-2 pt-2">
                                            <Input
                                                placeholder="Add an item..."
                                                value={newItemContents[checklist.id] || ''}
                                                onChange={(e) =>
                                                    setNewItemContents((prev) => ({
                                                        ...prev,
                                                        [checklist.id]: e.target.value,
                                                    }))
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleAddChecklistItem(checklist.id);
                                                    }
                                                }}
                                                className="flex-1"
                                            />
                                            <Button
                                                size="sm"
                                                onClick={() => handleAddChecklistItem(checklist.id)}
                                                disabled={!newItemContents[checklist.id]?.trim()}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Card Tags */}
                    {/* {cardTags.length > 0 && (
                        <div className="space-y-2">
                            <Label>Tags</Label>
                            <div className="flex flex-wrap gap-2">
                                {cardTags.map((tag) => (
                                    <Badge
                                        key={tag.id}
                                        style={{ backgroundColor: tag.color }}
                                        className="text-white"
                                        title={tag.name}
                                    >
                                        <span className="truncate max-w-32">{tag.name}</span>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )} */}

                    {/* Assigned Users */}
                    {/* <div className="space-y-3">
                        <Label>Assigned Users</Label>
                        {assignedUsers.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {assignedUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                                    >
                                        <Avatar className="w-5 h-5">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback className="text-xs">
                                                {user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{user.name}</span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-4 w-4 p-0 hover:bg-red-100"
                                            onClick={() => handleUnassignUser(user.id)}
                                        >
                                            ×
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {availableUsers.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">Available users:</p>
                                <div className="flex flex-wrap gap-2">
                                    {availableUsers.map((user) => (
                                        <Button
                                            key={user.id}
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleAssignUser(user.id)}
                                            className="flex items-center gap-2"
                                        >
                                            <Avatar className="w-4 h-4">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback className="text-xs">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            {user.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div> */}

                    <Separator />

                    {/* Comments */}

                    {/* Actions */}
                    <div className="flex justify-between pt-4">
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Card
                        </Button>

                        <Button onClick={() => onOpenChange(false)}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
