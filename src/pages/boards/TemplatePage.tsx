import { useEffect } from "react";
import { useBoardStore } from "@/entities/board/model/board.store";
import { WorkspaceBoards } from "@/features/dashboard/ui/components/WorkspaceBoards";
import { Loader2, LayoutTemplate } from "lucide-react";

export default function TemplatePage() {
    const { templateBoards, fetchTemplates, isLoading } = useBoardStore();

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-3">
                <LayoutTemplate className="w-8 h-8 text-blue-600" />
                <div>
                    <h1 className="text-3xl font-bold">Templates</h1>
                    <p className="text-muted-foreground">Start your project faster with a pre-built layout.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {templateBoards.map((board) => (
                        <WorkspaceBoards key={board.id} board={board} viewMode="grid" />
                    ))}
                </div>
            )}
        </div>
    );
}