import { WorkspaceList } from './components/WorkspaceList';
import { CreateWorkspaceDialog } from './components/CreateWorkspaceDialog';

export const Dashboard = () => {
    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex flex-col flex-1 transition-all duration-300">
                <main className="flex-1 p-8 space-y-6">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                            <p className="text-muted-foreground">
                                Manage your workspaces and boards
                            </p>
                        </div>
                        <CreateWorkspaceDialog />
                    </div>

                    <div className="space-y-10">
                        <WorkspaceList />
                    </div>
                </main>
            </div>
        </div>
    );
};
