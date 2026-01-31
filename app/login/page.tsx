import LoginForm from "@/components/pages/auth/login/loginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-6xl">
          <div className="sm:bg-white sm:rounded-xl sm:shadow-sm sm:overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left */}
              <div className="p-6 sm:p-6 lg:p-10 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <LoginForm />
                </div>
              </div>

              {/* Right */}
              <div className="hidden lg:block relative min-h-full">
                <Image
                  src="/images/grass.jpg"
                  alt="Authentication"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
