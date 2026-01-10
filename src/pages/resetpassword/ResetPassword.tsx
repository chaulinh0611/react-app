import { ResetPasswordForm } from "@/features/resetpassword/ui/ResetPasswordForm";

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
