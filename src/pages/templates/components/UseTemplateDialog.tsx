import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkspaceApi } from "@/entities/workspace/api/workspace.api";
import { TemplateApi } from "@/entities/board/api/template.api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UseTemplateDialogProps {
    template: any;
    onClose: () => void;
}

export function UseTemplateDialog({ template, onClose }: UseTemplateDialogProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [title, setTitle] = useState(template.title);
    const [workspaceId, setWorkspaceId] = useState("");

    const { data: workspacesResponse } = useQuery({
        queryKey: ['workspaces'],
        queryFn: async () => {
            const res = await WorkspaceApi.getWorkspaces();
            return res.data;
        }
    });

    const workspaces = workspacesResponse || [];

    const createFromTemplateMutation = useMutation({
        mutationFn: (payload: any) => TemplateApi.createBoardFromTemplate(template.id, payload),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['workspaces'] });
            queryClient.invalidateQueries({ queryKey: ['boards'] });
            navigate(`/board/${res.data.id || res.data.data.id}`);
            onClose();
        }
    });

    const handleCreate = () => {
        if (!title || !workspaceId) return;
        createFromTemplateMutation.mutate({
            title,
            workspaceId,
            visibility: 'public'
        });
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Create board from template</DialogTitle>
                    </div>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Board title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter board title"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="workspace">Workspace</Label>
                        <Select onValueChange={setWorkspaceId} value={workspaceId}>
                            <SelectTrigger id="workspace">
                                <SelectValue placeholder="Select a workspace" />
                            </SelectTrigger>
                            <SelectContent>
                                {workspaces.map((ws: any) => (
                                    <SelectItem key={ws.id} value={ws.id}>
                                        {ws.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border border-dashed text-xs text-gray-500">
                        This board will be created with all lists and cards from the <strong>{template.title}</strong> template.
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button 
                        onClick={handleCreate} 
                        disabled={!title || !workspaceId || createFromTemplateMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {createFromTemplateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
