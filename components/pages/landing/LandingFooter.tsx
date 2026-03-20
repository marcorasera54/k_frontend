"use client";

import { useRouter } from "next/navigation";
import { Mail, MapPin } from "lucide-react";

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const LINKS: Record<string, { label: string; action: () => void }[]> = {
  Prodotto: [
    { label: "Come funziona", action: () => scrollTo("come-funziona") },
    { label: "Sport disponibili", action: () => scrollTo("sport") },
    { label: "Recensioni", action: () => scrollTo("recensioni") },
  ],
  Gestori: [
    { label: "Dashboard", action: () => {} },
    { label: "Gestione campi", action: () => {} },
    { label: "Prenotazioni", action: () => {} },
  ],
};

export default function LandingFooter() {
  const router = useRouter();

  const allLinks = {
    Prodotto: LINKS.Prodotto,
    Gestori: LINKS.Gestori.map((item) => ({
      ...item,
      action: () => router.push("/dashboard"),
    })),
  };

  return (
    <footer className="relative bg-slate-800 text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-16 -left-16 h-64 w-64 rounded-2xl border border-white/5 rotate-12" />
        <div className="absolute -top-8  -left-8  h-64 w-64 rounded-2xl border border-white/5 rotate-12" />
        <div className="absolute top-10  right-10  h-40 w-40 rounded-2xl border border-white/5 -rotate-6" />
        <div className="absolute top-20  right-20  h-40 w-40 rounded-2xl border border-white/5 -rotate-6" />
        <div className="absolute -bottom-10 left-1/3 h-52 w-52 rounded-2xl border border-white/5 rotate-45" />
        <div className="absolute -bottom-4  left-1/3 h-52 w-52 rounded-2xl border border-white/[0.03] rotate-45" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-2xl border border-white/5 rotate-12" />
        <div className="absolute bottom-8 right-8 h-72 w-72 rounded-2xl border border-white/[0.03] rotate-12" />
        <div className="absolute top-6   left-1/2  h-8  w-8  rounded-lg bg-white/[0.03] rotate-45" />
        <div className="absolute bottom-12 left-16  h-5  w-5  rounded-md bg-white/[0.04] rotate-12" />
        <div className="absolute top-1/2  right-32  h-6  w-6  rounded-md bg-white/[0.03] -rotate-12" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand col */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <div
              onClick={() => router.push("/")}
              className="flex items-center gap-2.5 cursor-pointer w-fit"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0">
                <span className="text-sm font-bold">C</span>
              </div>
              <span className="text-white font-semibold text-lg">Nome</span>
            </div>

            <p className="text-sm leading-relaxed max-w-sm text-white">
              La piattaforma più semplice per prenotare campi sportivi in
              Italia. Semplice, veloce e gratuito.
            </p>

            <div className="flex flex-col gap-2 text-sm text-white">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-white" />
                <span>admin@nome.it</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 text-white" />
                <span>Aprilia, Italia</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(allLinks).map(([heading, items]) => (
            <div key={heading} className="flex flex-col gap-4">
              <p className="text-white font-semibold text-sm">{heading}</p>
              <ul className="flex flex-col gap-2.5">
                {items.map(({ label, action }) => (
                  <li key={label}>
                    <button
                      onClick={action}
                      className="text-sm text-white/70 hover:text-white transition-colors duration-150 text-left cursor-pointer"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
        <p>© {new Date().getFullYear()} Nome. Tutti i diritti riservati.</p>
        <p>Fatto con ❤️</p>
      </div>
    </footer>
  );
}
