import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/shared/ui/dialog';

import { Button } from '@/shared/ui/button';
import { useWorkspaceStore } from '@/entities/workspace/model/workspace.store';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useState } from 'react';

export const CreateWorkspaceDialog = () => {
    const { createWorkspace } = useWorkspaceStore();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = async () => {
        if (!title.trim()) {
            alert('Title is required');
            return;
        }

        try {
            await createWorkspace({
                title,
                description,
            });

            alert('Workspace created successfully!');

            setTitle('');
            setDescription('');
        } catch (err) {
            alert('Create workspace failed!');
        }
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <span className="text-lg font-semibold">＋</span> New Workspace
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                    <DialogDescription>Enter a name for your new workspace.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Title
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            className="col-span-3"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="username"
                            className="col-span-3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
