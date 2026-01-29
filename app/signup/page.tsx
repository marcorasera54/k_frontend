import { AuthHeader } from "@/components/pages/auth/signup/AuthHeader";
import SignupForm from "@/components/pages/auth/signup/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg mt-[-50px]">
          <SignupForm />
        </div>
      </main>
    </div>
  );
}
