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
import { Textarea } from '@/shared/ui/textarea';
import { useCreateBoard, useUpdateBoard } from '@/entities/board/model/useBoard';
import { useAnimatedToast } from '@/shared/ui/animated-toast';

import type { Board } from '@/entities/board/model/board.type';

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
    const [loading, setLoading] = useState(false);
    const { addToast } = useAnimatedToast();

    // populate fields when editing
    useEffect(() => {
        if (boardToEdit) {
            setTitle(boardToEdit.title);
            setDescription(boardToEdit.description || '');
        } else {
            setTitle('');
            setDescription('');
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
                    payload: {
                        title: title.trim(),
                        description: description.trim() || undefined,
                    },
                });
                onOpenChange(false);
            } else {
                const board = await createBoardMutation.mutateAsync({
                    title: title.trim(),
                    description: description.trim(),
                    workspaceId,
                });

                onOpenChange(false);
                if (board?.id) {
                    navigate(`/board/${board.id}`);
                }
            }

            setTitle('');
            setDescription('');
        } catch (err: any) {
            const msg = err?.response?.data?.message
                || 'Could not save board. Please check your input and try again.';
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
