import { ListTodo } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { useCreateChecklist } from '@/entities/checklist/model/useChecklist';

interface CardActionChecklistProps {
    cardId: string;
}

export default function CardActionChecklist({ cardId }: CardActionChecklistProps) {
    const { mutate: createChecklist } = useCreateChecklist();
    const [title, setTitle] = useState('');

    function handleAddChecklist() {
        createChecklist(
            { title, cardId },
            {
                onSuccess: () => {
                    setTitle('');
                },
            },
        );
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={'outline'} className="text-[12px] rounded-sm ">
                    <ListTodo />
                    Checklist
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className="flex gap-2">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter checklist title..."
                        onKeyDown={(e) => e.key === 'Enter' && handleAddChecklist()}
                    />
                    <Button onClick={handleAddChecklist}>Add</Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
