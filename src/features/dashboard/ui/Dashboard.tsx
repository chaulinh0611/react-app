import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { WorkspaceList } from "../shared/components/WorkspaceList";
import { CreateWorkspaceModal } from "../shared/components/CreateWorkspaceModal";
import {
    useWorkspaceActions,
    useWorkspaceStatus
} from "@/entities/workspace/model/workspace.selector";

export const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { createWorkspace, getWorkspaces } = useWorkspaceActions();
    const { isLoading } = useWorkspaceStatus();

    useEffect(() => {
        getWorkspaces();
    }, []);

    const handleCreateWorkspace = async (name: string) => {
        try {
            console.log("Creating workspace:", name);
            await createWorkspace({ title: name });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Lỗi:", error);
            alert("Tạo thất bại!");
        }
    };

    return (
        <div className="flex min-h-screen bg-white">

            <div className="flex flex-col flex-1 transition-all duration-300">
                <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
                    </div>
                </header>

                <main className="flex-1 p-8 space-y-6">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                            <p className="text-muted-foreground">
                                Manage your workspaces and boards
                            </p>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-black text-white px-4 py-2 rounded-md text-sm hover:opacity-90 flex items-center gap-2"
                            disabled={isLoading}
                        >
                            <span className="text-lg font-semibold">＋</span> New Workspace
                        </button>
                    </div>

                    <div className="space-y-10">
                        <WorkspaceList />
                    </div>
                </main>
            </div>

            <CreateWorkspaceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateWorkspace}
            />
        </div>
    );
};