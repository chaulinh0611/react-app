import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useUpdateCard } from '@/entities/card';
import { toast } from 'sonner';

interface CardDueDateProps {
    cardId: string;
    dueDate?: string | null;
}

export default function CardDueDate({ cardId, dueDate }: CardDueDateProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(
        dueDate ? new Date(dueDate).toISOString().split('T')[0] : '',
    );
    const { mutate: updateCard } = useUpdateCard();

    const handleSaveDueDate = () => {
        updateCard(
            {
                id: cardId,
                payload: {
                    dueDate: selectedDate ? new Date(selectedDate).toISOString() : null,
                },
            },
            {
                onSuccess: () => {
                    setIsEditing(false);
                    toast.success('Due date updated', { position: 'top-center' });
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to update due date', {
                        position: 'top-center',
                    });
                },
            },
        );
    };

    const handleClearDueDate = () => {
        updateCard(
            {
                id: cardId,
                payload: {
                    dueDate: null,
                },
            },
            {
                onSuccess: () => {
                    setSelectedDate('');
                    setIsEditing(false);
                    toast.success('Due date removed', { position: 'top-center' });
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to remove due date', {
                        position: 'top-center',
                    });
                },
            },
        );
    };

    const isOverdue =
        dueDate &&
        new Date(dueDate) < new Date() &&
        new Date(dueDate).toDateString() !== new Date().toDateString();
    const isToday = dueDate && new Date(dueDate).toDateString() === new Date().toDateString();

    return (
        <div className="mt-4">
            {!isEditing ? (
                <div
                    className="flex items-center gap-2 p-2 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50"
                    onClick={() => setIsEditing(true)}
                >
                    <Calendar className="h-4 w-4 text-gray-600 shrink-0" />
                    <div className="flex-1">
                        {dueDate ? (
                            <div className="flex flex-col">
                                <Label className="text-xs text-gray-500">Due date</Label>
                                <p
                                    className={`text-sm font-medium ${
                                        isOverdue
                                            ? 'text-red-600'
                                            : isToday
                                              ? 'text-orange-600'
                                              : 'text-gray-700'
                                    }`}
                                >
                                    {new Date(dueDate).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Add due date</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-2 p-2 rounded-md border border-gray-200 bg-gray-50">
                    <Label className="text-xs text-gray-600">Select due date</Label>
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="text-sm"
                    />
                    <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveDueDate} className="flex-1">
                            Save
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setIsEditing(false);
                                setSelectedDate(
                                    dueDate ? new Date(dueDate).toISOString().split('T')[0] : '',
                                );
                            }}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        {dueDate && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleClearDueDate}
                                className="px-2"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
