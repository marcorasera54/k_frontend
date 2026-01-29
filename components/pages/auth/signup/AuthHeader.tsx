"use client";

import Link from "next/link";

export function AuthHeader() {
  return (
    <header className="w-full px-6 py-8">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold text-gray-900">C</span>
        </div>
        <div className="text-xs sm:text-sm text-gray-600 text-right sm:text-left">
          Already have an account? <br className="sm:hidden" />
          <Link
            href="/login"
            className="ml-1 text-black hover:text-black/80 font-medium"
          >
            Log In
          </Link>
        </div>
      </div>
    </header>
  );
}
