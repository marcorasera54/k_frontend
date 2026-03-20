"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CtaSection() {
  const router = useRouter();

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl min-h-[420px] sm:min-h-[480px] flex items-center">
          {/* Background image */}
          <Image
            src="https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1170&auto=format&fit=crop"
            alt="Campo sportivo"
            fill
            className="object-cover object-center"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

          {/* Soft radial glow */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl opacity-40 pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 w-full px-8 sm:px-14 py-14 sm:py-20">
            <div className="max-w-xl flex flex-col gap-6">
              {/* Eyebrow */}
              <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-primary" />
                <span className="text-sm font-semibold text-primary uppercase tracking-widest">
                  Inizia oggi
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Pronto a prenotare il tuo prossimo campo?
              </h2>

              {/* Subtext */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Unisciti a migliaia di sportivi che usano la nostra piattaforma
                ogni giorno. È gratuito e ci vogliono meno di 2 minuti.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <Button
                  size="lg"
                  onClick={() => router.push("/signup")}
                  className="rounded-md px-8 gap-2 text-base"
                >
                  Crea il tuo account
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/login")}
                  className="rounded-md px-8 text-base bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  Accedi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
