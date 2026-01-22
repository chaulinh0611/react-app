import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { useListStore } from '@/entities/list/models/list.store';

interface CreateListButtonProps {
    boardId: string;
}

export function CreateListButton({ boardId }: CreateListButtonProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const { createList } = useListStore();

    const handleCreate = async () => {
        if (title.trim()) {
            await createList({ boardId, title: title.trim() });
            setTitle('');
            setIsAdding(false);
        }
    };

    const handleCancel = () => {
        setTitle('');
        setIsAdding(false);
    };

    if (isAdding) {
        return (
            <Card className="w-72 min-h-[120px] border-2 border-dashed border-blue-300 bg-blue-50/50 shadow-sm">
                <CardContent className="p-4!">
                    <div className="space-y-3">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreate();
                                if (e.key === 'Escape') handleCancel();
                            }}
                            placeholder="Enter list title..."
                            className="border-2 border-blue-200 focus:border-blue-400 bg-white"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={handleCreate}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Add List
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                                className="border-gray-300 hover:bg-gray-50"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-72 min-h-[120px] border-2 border-dashed border-gray-300 bg-gray-50/50 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md">
            <CardContent className="p-4! h-full flex items-center justify-center">
                <Button
                    variant="ghost"
                    className="w-full h-full justify-center text-gray-600 hover:text-blue-600 hover:bg-transparent flex-col gap-2"
                    onClick={() => setIsAdding(true)}
                >
                    <Plus className="w-5 h-5" />
                    <span className="text-sm font-medium">Add a list</span>
                </Button>
            </CardContent>
        </Card>
    );
}
