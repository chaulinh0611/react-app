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
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/dropzone';
import { useState } from 'react';
import { useWorkspaceStore } from '@/entities/workspace/model/workspace.store'; // Import Store
import { Loader2 } from 'lucide-react'; // Icon loading

export const CreateWorkspaceDialog = () => {
    const [files, setFiles] = useState<File[]>();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [open, setOpen] = useState(false);

    const { createWorkspace, isLoading } = useWorkspaceStore();

    const handleCreate = async () => {
        if (!title.trim()) return;

        try {
            await createWorkspace({ 
                title: title.trim(), 
                description: description.trim() 
            });

            setTitle('');
            setDescription('');
            setFiles([]);
            setOpen(false);
        } catch (error) {
            console.error("Create workspace failed:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <span className="text-lg font-semibold">＋</span> New Workspace
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                    <DialogDescription>
                        Cung cấp tên và mô tả cho không gian làm việc mới của bạn.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Phần Background (Dropzone) */}
                    <div className="grid items-center gap-2">
                        <Label className="text-sm font-medium">Background</Label>
                        <Dropzone
                            src={files}
                            onDrop={(acceptedFiles) => setFiles(acceptedFiles)}
                            accept={{
                                'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
                            }}
                            maxSize={5 * 1024 * 1024}
                            className="w-full"
                        >
                            <DropzoneContent />
                            <DropzoneEmptyState />
                        </Dropzone>
                    </div>

                    {/* Phần Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Title <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                            id="title" 
                            placeholder="Tên workspace..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Phần Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input 
                            id="description" 
                            placeholder="Mô tả ngắn gọn..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isLoading}>Cancel</Button>
                    </DialogClose>
                    <Button 
                        onClick={handleCreate} 
                        disabled={isLoading || !title.trim()}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            "Create"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};