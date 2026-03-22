"use client";

import { useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  CalendarDays,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const MANAGER_FEATURES = [
  {
    Icon: CalendarDays,
    text: "Gestione prenotazioni con filtri e paginazione",
  },
  { Icon: Bell, text: "Notifiche automatiche ai clienti" },
  {
    Icon: BarChart3,
    text: "Dashboard con statistiche e ricavi in tempo reale",
  },
  { Icon: Settings2, text: "Gestione campi, orari e disponibilità" },
];

const STATS = [
  {
    label: "Prenotazioni oggi",
    value: "12",
    color: "text-emerald-600",
    bar: "bg-emerald-500",
    pct: "75%",
  },
  {
    label: "Ricavi del mese",
    value: "€1.240",
    color: "text-blue-600",
    bar: "bg-blue-500",
    pct: "60%",
  },
  {
    label: "Campi attivi",
    value: "4",
    color: "text-violet-600",
    bar: "bg-violet-500",
    pct: "40%",
  },
];

const IMAGES = [
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&auto=format&fit=crop",
];

export default function ForManagersSection() {
  const router = useRouter();

  return (
    <section className="bg-white py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Per i gestori
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Gestisci il tuo centro sportivo
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto text-base sm:text-lg">
            Uno strumento completo per prenotazioni, campi e clienti, tutto da
            un'unica dashboard.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
        <div className="flex flex-col justify-center gap-8 px-8 sm:px-16 xl:px-24">
          <div className="space-y-4">
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
              Tutto sotto controllo,{" "}
              <span className="text-primary">sempre</span>
            </h3>
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-md">
              Dalla prima prenotazione ai ricavi mensili, gestisci ogni aspetto
              del tuo centro sportivo in un unico posto.
            </p>
          </div>

          {/* Features */}
          <ul className="space-y-3">
            {MANAGER_FEATURES.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <Icon className="h-4 w-4 text-slate-600" />
                </div>
                <span className="text-slate-600 text-sm">{text}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-2">
            <Button
              onClick={() => router.push("/signup")}
              className="rounded gap-2"
            >
              Registra il tuo centro
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="rounded"
            >
              Accedi alla dashboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 min-h-[400px] lg:min-h-full gap-2">
          {IMAGES.map((src, i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl">
              <Image
                src={src}
                alt="Centro sportivo"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
