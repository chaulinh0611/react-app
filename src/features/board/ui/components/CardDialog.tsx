import { useEffect, useState, useMemo, useRef } from 'react';
import { Trash2, X, CheckSquare, UserPlus, Tag, Check, Plus, Calendar, Clock } from 'lucide-react';
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
import { Separator } from '@/shared/ui/separator';

import type { Card as CardType } from '@/entities/card/model/card.type';
import { useCardStore } from '@/entities/card/model/card.store';
import { useListStore } from '@/entities/list/model/list.store';
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
    
    const [localLabels, setLocalLabels] = useState<string[]>(card.labels || []);
    const [localDueDate, setLocalDueDate] = useState<string | null>(
        card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : null
    );

    const dateInputRef = useRef<HTMLInputElement>(null);

    const { updateCard, deleteCard, addMember } = useCardStore();
    const lists = useListStore((state) => state.lists);
    const list = card?.listId ? lists[card.listId] : undefined;

    const {
        checklists, checklistItems, cardChecklists,
        getChecklistsOnCard, createChecklist, deleteChecklist,
        addChecklistItem, updateChecklistItems, deleteChecklistItem,
    } = useChecklistStore();

    const cardChecklistIds = useMemo(() => cardChecklists[card.id] || [], [cardChecklists, card.id]);
    const cardChecklistsData = useMemo(() => cardChecklistIds.map((id) => checklists[id]).filter(Boolean), [cardChecklistIds, checklists]);

    useEffect(() => {
        if (open && card.id) {
            setTitle(card.title || '');
            setDescription(card.description || '');
            setLocalLabels(card.labels || []);
            setLocalDueDate(card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : null);
            getChecklistsOnCard(card.id);
        }
    }, [card, open, getChecklistsOnCard]);

    const handleUpdateCard = async (payload: Partial<CardType>) => {
        try {
            await updateCard(card.id, payload);
        } catch (err) {
            console.error('Failed to update:', err);
        }
    };

    const handleDateClick = () => {
        if (dateInputRef.current) {
            dateInputRef.current.showPicker(); 
        }
    };

    const onDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val) {
            setLocalDueDate(val);
            handleUpdateCard({ dueDate: val });
        }
    };

    const toggleLabel = (color: string) => {
        const current = localLabels;
        const newLabels = current.includes(color)
            ? current.filter(c => c !== color)
            : [...current, color];
        
        setLocalLabels(newLabels);
        handleUpdateCard({ labels: newLabels });
    };

    const handleAssignMe = async () => {
        try {
            await addMember(card.id, ""); 
        } catch (error) {
            console.error("Lỗi khi tham gia thẻ:", error);
            alert("Lỗi! Bạn đã là thành viên của thẻ này, hoặc chưa đăng nhập.");
        }
    };

    const handleCreateChecklist = async () => {
        if (!newChecklistTitle.trim()) return;
        await createChecklist(newChecklistTitle, card.id);
        setNewChecklistTitle('');
    };
    const handleDeleteChecklist = async (id: string) => { await deleteChecklist(id); };
    const handleAddChecklistItem = async (id: string) => {
        if (!newItemContents[id]?.trim()) return;
        await addChecklistItem(id, newItemContents[id]);
        setNewItemContents((prev) => ({ ...prev, [id]: '' }));
    };
    const handleToggleChecklistItem = async (id: string) => {
        const item = checklistItems[id];
        if (item) await updateChecklistItems(id, item.content, !item.isChecked);
    };
    const handleDeleteChecklistItem = async (id: string) => { await deleteChecklistItem(id); };
    const handleDelete = async () => {
        if (card.id) { await deleteCard(card.id); onOpenChange(false); }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">{list?.title || 'Card Details'}</DialogTitle>
                    <DialogDescription className="sr-only">Details</DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 flex-wrap mb-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <Tag className="w-4 h-4" /> Labels
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3" align="start">
                            <h4 className="font-medium mb-2 text-sm">Select Labels</h4>
                            <div className="flex flex-wrap gap-2">
                                {['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'].map(color => (
                                    <div 
                                        key={color} 
                                        onClick={() => toggleLabel(color)}
                                        className="w-8 h-8 rounded cursor-pointer hover:opacity-80 flex items-center justify-center border border-gray-200 transition-transform active:scale-95"
                                        style={{ backgroundColor: color }}
                                    >
                                        {localLabels.includes(color) && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                <CheckSquare className="w-4 h-4" /> Checklist
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-3" align="start">
                            <h3 className="font-medium mb-2">Checklist Title</h3>
                            <div className="flex gap-2">
                                <Input value={newChecklistTitle} onChange={(e) => setNewChecklistTitle(e.target.value)} />
                                <Button size="sm" onClick={handleCreateChecklist}><Plus className="w-4 h-4" /></Button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={handleAssignMe}
                    >
                        <UserPlus className="w-4 h-4" /> Join Card
                    </Button>

                    <div className="relative">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2"
                            onClick={handleDateClick}
                        >
                            <Calendar className="w-4 h-4" /> Due Date
                        </Button>
                        <input 
                            ref={dateInputRef}
                            type="date" 
                            className="absolute top-0 left-0 w-0 h-0 opacity-0"
                            onChange={onDueDateChange}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-1">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                            id="title" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            onBlur={() => handleUpdateCard({ title })}
                            className="text-lg font-bold"
                        />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {localLabels.length > 0 && (
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">Labels</Label>
                                <div className="flex gap-1">
                                    {localLabels.map((color, idx) => (
                                        <div key={idx} className="h-6 w-12 rounded" style={{ backgroundColor: color }} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {localDueDate && (
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">Due Date</Label>
                                <div 
                                    className="flex items-center gap-2 px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-sm w-fit font-medium cursor-pointer hover:bg-red-100"
                                    onClick={handleDateClick}
                                >
                                    <Clock className="w-3 h-3" />
                                    {localDueDate}
                                </div>
                            </div>
                        )}
                        
                        {card.cardMembers && card.cardMembers.length > 0 && (
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">Members</Label>
                                <div className="flex -space-x-2">
                                    {card.cardMembers.map((m: any) => (
                                        <div key={m.id} className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold overflow-hidden" title={m.user?.username || m.name}>
                                            {m.user?.avatar || m.avatar ? <img src={m.user?.avatar || m.avatar} alt="avatar" className="h-full w-full object-cover"/> : (m.user?.username || m.name)?.charAt(0)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            onBlur={() => handleUpdateCard({ description })}
                            placeholder="Add a description..."
                            className="w-full p-3 border rounded-md min-h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    <Separator />

                    {cardChecklistsData.map((checklist) => {
                        const items = (checklist.items || []).map((id) => checklistItems[id]).filter(Boolean);
                        const completed = items.filter(i => i.isChecked).length;
                        const percent = items.length ? Math.round((completed / items.length) * 100) : 0;

                        return (
                            <div key={checklist.id} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckSquare className="w-5 h-5 text-gray-600" />
                                        <h3 className="font-semibold">{checklist.title}</h3>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteChecklist(checklist.id)}>
                                        <Trash2 className="w-4 h-4 text-gray-400" />
                                    </Button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-gray-500 w-8">{percent}%</span>
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 transition-all" style={{ width: `${percent}%` }} />
                                    </div>
                                </div>
                                <div className="space-y-2 pl-0">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-2 group hover:bg-gray-50 p-1 rounded">
                                            <input 
                                                type="checkbox" 
                                                checked={item.isChecked} 
                                                onChange={() => handleToggleChecklistItem(item.id)}
                                                className="w-4 h-4 rounded border-gray-300"
                                            />
                                            <span className={`flex-1 text-sm ${item.isChecked ? 'line-through text-gray-400' : ''}`}>{item.content}</span>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteChecklistItem(item.id)} className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ))}
                                    <div className="flex gap-2 mt-2">
                                        <Input 
                                            placeholder="Add item..." 
                                            value={newItemContents[checklist.id] || ''} 
                                            onChange={(e) => setNewItemContents(p => ({...p, [checklist.id]: e.target.value}))}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem(checklist.id)}
                                            className="h-8 text-sm"
                                        />
                                        <Button size="sm" onClick={() => handleAddChecklistItem(checklist.id)}>Add</Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <Separator />

                    <div className="flex justify-between pt-2">
                        <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4" /> Delete Card
                        </Button>
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}