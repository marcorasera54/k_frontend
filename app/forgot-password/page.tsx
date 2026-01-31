import ForgotPasswordForm from "@/components/pages/auth/forgot-password/forgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="p-6 sm:p-6 lg:p-10 flex items-center justify-center">
          <div className="w-full max-w-md">
            <ForgotPasswordForm />
          </div>
        </div>
      </main>
    </div>
  );
}
