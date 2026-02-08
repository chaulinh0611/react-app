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

export const CreateWorkspaceDialog = () => {
    const [files, setFiles] = useState<File[]>();
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
                    <div className="grid items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Background
                        </Label>
                        <Dropzone
                            src={files}
                            onDrop={(acceptedFiles) => setFiles(acceptedFiles)}
                            accept={{
                                'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
                            }}
                            maxSize={5 * 1024 * 1024}
                            className="w-full max-w-md"
                        >
                            <DropzoneContent />
                            <DropzoneEmptyState />
                        </Dropzone>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Title
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input id="name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Description
                        </Label>
                        <Input id="username" className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
