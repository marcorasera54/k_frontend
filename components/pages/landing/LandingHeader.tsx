"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LandingHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center cursor-pointer"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-lg overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-slate-900">Sportivo</span>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => router.push("/fields")}
            className="rounded border text-sm hidden sm:flex"
          >
            Accedi
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            className="rounded text-sm"
          >
            Registrati
          </Button>
        </div>
      </div>
    </header>
  );
}
