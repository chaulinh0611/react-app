import { WorkspaceList } from './components/WorkspaceList';
import { Card } from '@/shared/ui/card';

export const Dashboard = () => {
    return (
        <Card className="flex min-h-full  w-full bg-transparent border-none shadow-none overflow-hidden">
            <div className="flex flex-col flex-1  transition-all duration-300 min-w-0">
                <main className="flex-1 px-8  min-w-0">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                            <p className="text-muted-foreground">
                                Manage your workspaces and boards
                            </p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <WorkspaceList />
                    </div>
                </main>
            </div>
        </Card>
    );
};
