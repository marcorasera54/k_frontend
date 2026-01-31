import ResetPasswordForm from "@/components/pages/auth/reset-password/resetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="p-6 sm:p-6 lg:p-10 flex items-center justify-center">
          <div className="w-full max-w-md">
            <ResetPasswordForm />
          </div>
        </div>
      </main>
    </div>
  );
}
