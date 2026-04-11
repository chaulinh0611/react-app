import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Textarea } from '@/shared/ui/textarea';
import { useCreateBoard, useUpdateBoard } from '@/entities/board';
import { useAnimatedToast } from '@/shared/ui/animated-toast';

import type { Board, BoardVisibility } from '@/entities/board';

const visibilityOptions: Array<{
    value: BoardVisibility;
    label: string;
    description: string;
}> = [
    {
        value: 'private',
        label: 'Private',
        description: 'Only people with access can view this board.',
    },
    {
        value: 'workspace',
        label: 'Workspace',
        description: 'Visible to members of the workspace.',
    },
    {
        value: 'public',
        label: 'Public',
        description: 'Anyone with the link or access can discover it.',
    },
];

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
    boardToEdit?: Board | null; // if present convert dialog to edit mode
};

export function CreateBoardDialog({ open, onOpenChange, workspaceId, boardToEdit }: Props) {
    const navigate = useNavigate();
    const createBoardMutation = useCreateBoard();
    const updateBoardMutation = useUpdateBoard();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [permissionLevel, setPermissionLevel] = useState<BoardVisibility>('workspace');
    const [loading, setLoading] = useState(false);
    const { addToast } = useAnimatedToast();

    // populate fields when editing
    useEffect(() => {
        if (boardToEdit) {
            setTitle(boardToEdit.title);
            setDescription(boardToEdit.description || '');
            setPermissionLevel(boardToEdit.permissionLevel);
        } else {
            setTitle('');
            setDescription('');
            setPermissionLevel('workspace');
        }
    }, [boardToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            setLoading(true);

            if (boardToEdit) {
                // update existing (include workspace id for correct route)
                await updateBoardMutation.mutateAsync({
                    boardId: boardToEdit.id,
                    workspaceId,
                    payload: {
                        title: title.trim(),
                        description: description.trim() || undefined,
                        permissionLevel,
                    },
                });
                onOpenChange(false);
            } else {
                const board = await createBoardMutation.mutateAsync({
                    title: title.trim(),
                    description: description.trim(),
                    workspaceId,
                    permissionLevel,
                });

                onOpenChange(false);
                if (board?.id) {
                    navigate(`/board/${board.id}`);
                }
            }

            setTitle('');
            setDescription('');
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                'Could not save board. Please check your input and try again.';
            addToast({ message: msg, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{boardToEdit ? 'Edit board' : 'Create new board'}</DialogTitle>
                    <DialogDescription>
                        {boardToEdit
                            ? 'Update board details.'
                            : 'Create a board to organize your tasks and collaborate with your team.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 overflow-hidden">
                    <div className="space-y-2 min-w-0">
                        <Label htmlFor="title">Board title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Project Alpha"
                            autoFocus
                            required
                            maxLength={255}
                        />
                    </div>

                    <div className="space-y-2 min-w-0">
                        <Label htmlFor="description">
                            Description <span className="text-muted-foreground">(optional)</span>
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Short description of your board"
                            rows={3}
                            className="max-h-32 overflow-y-auto resize-none"
                        />
                    </div>

                    <div className="space-y-2 min-w-0">
                        <Label htmlFor="visibility">Visibility</Label>
                        <Select
                            value={permissionLevel}
                            onValueChange={(value) => setPermissionLevel(value as BoardVisibility)}
                        >
                            <SelectTrigger id="visibility" className="w-full">
                                <SelectValue placeholder="Select board visibility" />
                            </SelectTrigger>
                            <SelectContent>
                                {visibilityOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        <div className="flex flex-col items-start gap-0.5 py-1">
                                            <span className="font-medium">{option.label}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {option.description}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>

                        <Button type="submit" disabled={!title.trim() || loading}>
                            {boardToEdit ? 'Save changes' : 'Create board'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
