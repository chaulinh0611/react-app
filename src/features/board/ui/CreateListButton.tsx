import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';

interface CreateListButtonProps {
    boardId: string;
}

export function CreateListButton({ boardId }: CreateListButtonProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');

    const handleCreate = () => {
        if (title.trim()) {
            // createList(boardId, title.trim());
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
            <Card className="w-72 bg-white">
                <CardContent className="p-3">
                    <div className="space-y-2">
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreate();
                                if (e.key === 'Escape') handleCancel();
                            }}
                            placeholder="Enter list title..."
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <Button size="sm" onClick={handleCreate}>
                                Add List
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-72 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
            <CardContent className="p-4">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-600 hover:text-gray-800"
                    onClick={() => setIsAdding(true)}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add a list
                </Button>
            </CardContent>
        </Card>
    );
}
