import { ProfileForm } from '@/features/auth/ui/ProfileForm';
import { ArchivedWorkspaces } from '@/features/workspace/ui/ArchivedWorkspaces';
import { ArchivedBoards } from '@/features/board/ui/ArchivedBoards';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Settings</h1>
            <ProfileForm />
            <ArchivedWorkspaces />
            <ArchivedBoards />
        </div>
    );
}
