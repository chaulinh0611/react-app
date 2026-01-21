import { useEffect } from "react";
import { useWorkspaces } from "@/entities/workspace/model/workspace.selector";
// import { BoardCard } from "./BoardCard";

export const WorkspaceList = () => {
    const workspaces = useWorkspaces();

    useEffect(() => {
        console.log("Danh sách Workspace trong Store:", workspaces);
    }, [workspaces]);

    if (!workspaces || Object.keys(workspaces).length === 0) {
        return (
            <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg border-2 border-dashed">
                <p>Bạn chưa có Workspace nào. Hãy tạo mới nhé!</p>
            </div>
        );
    }

    const workspaceList = Object.values(workspaces);

    return (
        <div className="space-y-8">
            {workspaceList.map((workspace: any) => (
                <div key={workspace.id} className="space-y-4 border p-4 rounded-lg shadow-sm">
                    {/* Header của Workspace */}
                    <div className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-blue-600 rounded text-white flex items-center justify-center font-bold text-lg">
                                {workspace.title ? workspace.title.charAt(0).toUpperCase() : 'W'}
                            </div>
                            <h3 className="font-bold text-lg text-gray-800">
                                {workspace.title}
                            </h3>
                        </div>
                    </div>

                    {/* Placeholder cho danh sách Bảng */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="h-24 bg-gray-100 rounded hover:bg-gray-200 transition cursor-pointer flex items-center justify-center text-gray-500 text-sm">
                            Create new board (Coming soon)
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};