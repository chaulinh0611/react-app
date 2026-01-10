import { WorkspaceProvider } from '../shared/WorkspaceProvider';

export const Dashboard = () => {
    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex flex-col flex-1">
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

                        <button className="bg-black text-white px-4 py-2 rounded-md text-sm hover:opacity-90 flex items-center gap-2">
                            <span className="text-lg font-semibold">＋</span> New Workspace
                        </button>
                    </div>

                    <div className="space-y-10"></div>
                </main>
            </div>
        </div>
    );
};
