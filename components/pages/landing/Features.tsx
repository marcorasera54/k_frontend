import Image from "next/image";
import {
  Bell,
  ShieldCheck,
  Clock,
  Smartphone,
  CalendarDays,
  MapPin,
} from "lucide-react";

const FEATURES = [
  {
    Icon: Bell,
    title: "Notifiche in tempo reale",
    description:
      "Ricevi conferme, promemoria e aggiornamenti istantanei direttamente sulla tua dashboard.",
  },
  {
    Icon: Clock,
    title: "Disponibilità live",
    description:
      "Controlla in tempo reale quali slot sono liberi senza dover chiamare il centro.",
  },
  {
    Icon: ShieldCheck,
    title: "Cancellazione gratuita",
    description:
      "Piani cambiano. Puoi annullare la tua prenotazione senza penali fino all'orario previsto.",
  },
  {
    Icon: Smartphone,
    title: "Sempre con te",
    description:
      "Accedi da qualsiasi dispositivo. La piattaforma è ottimizzata per mobile, tablet e desktop.",
  },
  {
    Icon: CalendarDays,
    title: "Storico prenotazioni",
    description:
      "Tieni traccia di tutte le tue prenotazioni passate e future in un unico posto.",
  },
  {
    Icon: MapPin,
    title: "Centri vicino a te",
    description:
      "Trova facilmente strutture nella tua zona filtrate per sport, disponibilità e prezzo.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-20">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Funzionalità
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Tutto quello che ti serve
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto text-base sm:text-lg">
            Abbiamo pensato a ogni dettaglio per rendere la tua esperienza
            semplice e piacevole.
          </p>
        </div>

        {/* Two-column layout: image left, features right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative w-full h-[460px] sm:h-[560px] rounded-2xl overflow-hidden flex-shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1530915365347-e35b749a0381?q=80&w=1170&auto=format&fit=crop"
              alt="Funzionalità della piattaforma"
              fill
              className="object-cover object-center"
            />
            {/* Bottom gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
          </div>

          <div className="flex flex-col gap-6">
            {FEATURES.map(({ Icon, title, description }, idx) => (
              <div key={title} className="group flex gap-4 items-start">
                {/* Left: number + line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white border border-slate-200 shadow-sm transition-all duration-200">
                    <Icon
                      className="h-5 w-5 text-slate-600"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <div className="flex-1 pb-1">
                  <h3 className="text-base font-semibold text-slate-900 mb-1 leading-snug group-hover:text-primary transition-colors duration-200">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
