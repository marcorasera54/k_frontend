"use client";

import LoginForm from "@/components/pages/auth/login/loginForm";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-sm text-slate-900 hover:text-black font-medium cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna indietro
        </button>
      </div>
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
