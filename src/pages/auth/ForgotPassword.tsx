import { ForgotPasswordForm } from '@/features/auth/ui/ForgotPasswordForm';

export default function Page() {
    return (
        <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <ForgotPasswordForm />
            </div>
        </div>
    );
}
