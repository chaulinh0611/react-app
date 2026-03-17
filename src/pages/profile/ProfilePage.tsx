import { ProfileForm } from '@/features/auth/ui/ProfileForm';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Profile</h1>
            <ProfileForm />
        </div>
    );
}
