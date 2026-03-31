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
import { useCreateWorkspaceMutation } from '@/entities/workspace/model/workspace.queries';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnimatedToast } from '@/shared/ui/animated-toast';

export const CreateWorkspaceDialog = () => {
    const createWorkspace = useCreateWorkspaceMutation();
    const { addToast } = useAnimatedToast();
    const navigate = useNavigate();

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

            addToast({ message: 'Workspace created successfully!', type: 'success' });

            setTitle('');
            setDescription('');
            setOpen(false);
            navigate('/dashboard');
        } catch (err: any) {
            const msg = err?.response?.data?.message
                || err?.message
                || 'Create workspace failed!';
            addToast({ message: msg, type: 'error' });
        }
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                    <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
