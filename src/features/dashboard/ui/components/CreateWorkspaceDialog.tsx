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
import { useAnimatedToast } from '@/shared/ui/animated-toast';

import { Button } from '@/shared/ui/button';
import { useCreateWorkspaceMutation } from '@/entities/workspace/model/workspace.queries';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useState } from 'react';

export const CreateWorkspaceDialog = () => {
    const { addToast } = useAnimatedToast();
    const createWorkspace = useCreateWorkspaceMutation();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleCreate = async () => {
        if (!title.trim()) {
            addToast({ message: 'Title is required', type: 'error' });
            return;
        }

        try {
            await createWorkspace.mutateAsync({
                title,
                description,
            });

            addToast({
                title: 'Workspace Created',
                message: 'Workspace created successfully!',
                type: 'success',
            });

            setTitle('');
            setDescription('');
            setOpen(false);
        } catch (err) {
            addToast({
                title: 'Create Workspace Failed',
                message: 'Failed to create workspace.',
                type: 'error',
            });
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
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
                            maxLength={100}
                            placeholder="Enter workspace name..."
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            className="col-span-3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={512}
                            placeholder="Enter workspace description (optional)..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleCreate} disabled={createWorkspace.isPending}>
                        {createWorkspace.isPending ? 'Creating...' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
