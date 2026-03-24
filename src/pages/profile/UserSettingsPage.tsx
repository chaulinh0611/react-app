import { ArchivedWorkspaces } from '@/widgets/Workspace/ArchivedWorkspaceList';

export default function UserSettingsPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight mb-6">User Settings</h1>
            <ArchivedWorkspaces />
        </div>
    );
}
