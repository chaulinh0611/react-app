import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { useUpdateCard } from '@/entities/card';

interface CardActionDueDateProps {
    cardId: string;
    dueDate?: string | null;
}

function toDateInputValue(value?: string | null) {
    return value ? new Date(value).toISOString().split('T')[0] : '';
}

function formatDueDate(value?: string | null) {
    if (!value) return 'No due date';

    return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function CardActionDueDate({ cardId, dueDate }: CardActionDueDateProps) {
    const { mutate: updateCard } = useUpdateCard();
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(toDateInputValue(dueDate));

    useEffect(() => {
        if (open) {
            setSelectedDate(toDateInputValue(dueDate));
        }
    }, [open, dueDate]);

    const handleSave = () => {
        updateCard(
            {
                id: cardId,
                payload: {
                    dueDate: selectedDate ? new Date(selectedDate).toISOString() : null,
                },
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    toast.success(selectedDate ? 'Due date updated' : 'Due date removed', {
                        position: 'top-center',
                    });
                },
                onError: (error: any) => {
                    toast.error(error?.message || 'Failed to update due date', {
                        position: 'top-center',
                    });
                },
            },
        );
    };

    const handleClear = () => {
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
                    setOpen(false);
                    toast.success('Due date removed', { position: 'top-center' });
                },
                onError: (error: any) => {
                    toast.error(error?.message || 'Failed to remove due date', {
                        position: 'top-center',
                    });
                },
            },
        );
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-sm text-[12px] gap-2">
                    <Calendar className="h-4 w-4" />
                    Due Date
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 space-y-3 p-3">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Due date</p>
                    <p className="text-xs text-muted-foreground">
                        Current: {formatDueDate(dueDate)}
                    </p>
                </div>

                <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-sm"
                />

                <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={handleSave}>
                        Save
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                            setSelectedDate(toDateInputValue(dueDate));
                            setOpen(false);
                        }}
                    >
                        Cancel
                    </Button>
                    {dueDate ? (
                        <Button size="sm" variant="ghost" onClick={handleClear} className="px-2">
                            Clear
                        </Button>
                    ) : null}
                </div>
            </PopoverContent>
        </Popover>
    );
}
