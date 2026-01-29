import { AuthHeader } from "@/components/pages/auth/login/authHeader";
import LoginForm from "@/components/pages/auth/login/loginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AuthHeader />
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md -mt-12.5">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
