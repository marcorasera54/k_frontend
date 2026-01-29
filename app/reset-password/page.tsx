import { AuthHeader } from "@/components/pages/auth/forgot-password/AuthHeader";
import ResetPasswordForm from "@/components/pages/auth/reset-password/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md mt-[-50px]">
          <ResetPasswordForm />
        </div>
      </main>
    </div>
  );
}
