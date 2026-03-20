"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LandingHeader() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-base font-bold">C</span>
          </div>
          <span className="text-lg font-semibold text-slate-900">Nome</span>
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
