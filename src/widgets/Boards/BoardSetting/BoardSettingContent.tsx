import {
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
} from '@/shared/ui/dropdown-menu';
import { Archive, Trash, User2, Activity, LayoutTemplate } from 'lucide-react';
import { ArchivedItemsSubMenu } from '@/widgets/Boards/BoardSetting/ArchivedItemsSubMenu';
import { ChangeBackgroundSubMenu } from '@/widgets/Boards/BoardSetting/ChangeBackgroundSubMenu';
import { VisibilitySubMenu } from '@/widgets/Boards/BoardSetting/VisibilitySubMenu';
import { useDeleteBoard, useArchiveBoard, useCreateBoardTemplate } from '@/entities/board';
import { useParams, useNavigate } from 'react-router-dom';
import { useAnimatedToast } from '@/shared/ui/animated-toast';
import { BoardActivity } from '@/widgets/Boards/BoardSetting/BoardActivity';
import { useState } from 'react';
import {
    Dialog,
    DialogDescription,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Label } from '@/shared/ui/label';
import { Switch } from '@/shared/ui/switch';
import { Button } from '@/shared/ui/button';
import { InvitePopover } from '@/widgets/Boards/Invite/InviteContent';

const TEMPLATE_CATEGORIES = [
    'Business',
    'Design',
    'Education',
    'Engineering',
    'Marketing',
    'HR',
    'Personal',
    'Productivity',
    'Project Management',
    'Remote Work',
    'Sales & CRM',
];

export const BoardSettingContent = () => {
    const { mutate: deleteBoard } = useDeleteBoard();
    const { mutate: archiveBoard } = useArchiveBoard();
    const { mutate: createBoardTemplate, isPending: isCreatingTemplate } = useCreateBoardTemplate();
    const { boardId = '' } = useParams();
    const navigate = useNavigate();
    const { addToast } = useAnimatedToast();
    const [openActivity, setOpenActivity] = useState(false);
    const [openMembers, setOpenMembers] = useState(false);
    const [openTemplateDialog, setOpenTemplateDialog] = useState(false);
    const [templateCategory, setTemplateCategory] = useState('Business');
    const [copyCards, setCopyCards] = useState(true);

    const deleteBoardHandler = () => {
        deleteBoard(
            { boardId },
            {
                onSuccess: () => {
                    navigate('/dashboard');
                    addToast({
                        title: 'Success',
                        message: 'Board deleted successfully.',
                        type: 'success',
                    });
                },
            },
        );
    };

    const archiveBoardHandler = () => {
        archiveBoard(
            { boardId },
            {
                onSuccess: () => {
                    navigate('/dashboard');
                    addToast({
                        title: 'Success',
                        message: 'Board archived successfully.',
                        type: 'success',
                    });
                },
            },
        );
    };

    const createBoardTemplateHandler = () => {
        createBoardTemplate(
            {
                boardId,
                category: templateCategory,
                copyCard: copyCards,
            },
            {
                onSuccess: () => {
                    setOpenTemplateDialog(false);
                    addToast({
                        title: 'Success',
                        message: 'Board template created successfully.',
                        type: 'success',
                    });
                },
            },
        );
    };

    return (
        <>
            {/* MENU */}
            <div className="flex flex-col gap-2">
                <DropdownMenuLabel>Board Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuSub>
                    <ArchivedItemsSubMenu />
                </DropdownMenuSub>

                <DropdownMenuSub>
                    <VisibilitySubMenu />
                </DropdownMenuSub>

                <DropdownMenuSub>
                    <ChangeBackgroundSubMenu />
                </DropdownMenuSub>

                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        setOpenMembers(true);
                    }}
                >
                    <User2 />
                    Members
                </DropdownMenuItem>

                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        setOpenActivity(true);
                    }}
                >
                    <Activity />
                    Activity
                </DropdownMenuItem>

                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        setOpenTemplateDialog(true);
                    }}
                    disabled={isCreatingTemplate}
                >
                    <LayoutTemplate />
                    {isCreatingTemplate ? 'Creating template...' : 'Make Board Template'}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={archiveBoardHandler}>
                    <Archive /> Archive Board
                </DropdownMenuItem>

                <DropdownMenuItem variant="destructive" onClick={deleteBoardHandler}>
                    <Trash />
                    Delete Board
                </DropdownMenuItem>
            </div>

            {/* DIALOG */}
            <Dialog open={openActivity} onOpenChange={setOpenActivity}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Board Activity</DialogTitle>
                    </DialogHeader>

                    <div className="max-h-96 overflow-y-auto">
                        <BoardActivity />
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={openMembers} onOpenChange={setOpenMembers}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Board Members</DialogTitle>
                        <DialogDescription>
                            Invite members to the board and change their role.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[70vh] overflow-y-auto pr-1">
                        <InvitePopover />
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={openTemplateDialog} onOpenChange={setOpenTemplateDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Board Template</DialogTitle>
                        <DialogDescription>
                            Save this board as a reusable template and choose its category.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="template-category">Category</Label>
                            <Select value={templateCategory} onValueChange={setTemplateCategory}>
                                <SelectTrigger id="template-category">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TEMPLATE_CATEGORIES.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between rounded-md border px-3 py-2">
                            <div>
                                <p className="text-sm font-medium">Copy cards</p>
                                <p className="text-xs text-muted-foreground">
                                    Include all cards from each list in this template.
                                </p>
                            </div>
                            <Switch checked={copyCards} onCheckedChange={setCopyCards} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenTemplateDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={createBoardTemplateHandler} disabled={isCreatingTemplate}>
                            {isCreatingTemplate ? 'Creating...' : 'Create Template'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};
