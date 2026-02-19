import { WorkspaceList } from './components/WorkspaceList';
import { CreateWorkspaceDialog } from './components/CreateWorkspaceDialog';

export const Dashboard = () => {
    return (
        <div className="flex min-h-screen bg-[#f8f9fa]">
            <div className="flex flex-col flex-1 transition-all duration-300">
                <main className="flex-1 p-4 md:p-8 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h2>
                            <p className="text-muted-foreground">
                                Manage your workspaces and track your team boards.
                            </p>
                        </div>
                        <CreateWorkspaceDialog />
                    </div>

                    <div className="space-y-10">
                        {/* Component WorkspaceList này sẽ gọi các entities/workspace/api */}
                        <WorkspaceList />
                    </div>
                </main>
            </div>
        </div>
    );
};