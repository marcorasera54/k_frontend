import { AuthHeader } from "@/components/pages/auth/forgot-password/AuthHeader";
import ForgotPasswordForm from "@/components/pages/auth/forgot-password/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md mt-[-50px]">
          <ForgotPasswordForm />
        </div>
      </main>
    </div>
  );
}
