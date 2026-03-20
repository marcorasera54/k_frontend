"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1661745797825-a51072638bc5?q=80&w=1170&auto=format&fit=crop"
          alt="Campo sportivo"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-slate-900/70" />
      </div>
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-3xl opacity-40" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Badge */}
          <Badge className="bg-white/10 text-white border-white/20 hover:bg-white/10 px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-center">
            <Star className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
            <span className="hidden sm:inline">
              La piattaforma n°1 per prenotare campi sportivi
            </span>
            <span className="sm:hidden">
              La piattaforma n°1 per campi sportivi
            </span>
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
            Prenota il tuo campo sportivo in{" "}
            <span className="italic text-yellow-400">pochi secondi</span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl leading-relaxed">
            Trova centri sportivi vicino a te, controlla la disponibilità in
            tempo reale e prenota con un click. Calcio, tennis, padel e molto
            altro.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
            <Button
              size="lg"
              onClick={() => router.push("/signup")}
              className="rounded px-8 gap-2 text-base"
            >
              Inizia ora{" "}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/login")}
              className="rounded px-8 text-base bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
            >
              Accedi
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
