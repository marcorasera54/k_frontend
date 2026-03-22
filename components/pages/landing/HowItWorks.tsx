import { Search, CalendarCheck, Trophy } from "lucide-react";

const STEPS = [
  {
    step: "01",
    Icon: Search,
    title: "Cerca il tuo sport",
    description:
      "Inserisci la tua posizione e lo sport che vuoi praticare. Trova i centri sportivi disponibili vicino a te in pochi secondi.",
  },
  {
    step: "02",
    Icon: CalendarCheck,
    title: "Scegli orario e campo",
    description:
      "Consulta la disponibilità in tempo reale, scegli l'orario che preferisci e prenota il campo con un semplice click.",
  },
  {
    step: "03",
    Icon: Trophy,
    title: "Gioca e divertiti",
    description:
      "Ricevi la conferma immediata via notifica, presentati al centro e gioca. È tutto semplice, veloce e senza sorprese.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-20">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Come funziona
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Prenota in tre semplici passi
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto text-base sm:text-lg">
            Niente più telefonate o attese. Tutto online, in pochi secondi.
          </p>
        </div>

        {/* Horizontal timeline */}
        <div className="relative flex flex-col md:flex-row gap-0">
          {STEPS.map(({ step, Icon, title, description }, idx) => {
            const isLast = idx === STEPS.length - 1;
            return (
              <div
                key={step}
                className="relative flex flex-1 flex-col md:flex-row items-stretch"
              >
                {/* Step block */}
                <div className="flex flex-col items-center text-center flex-1 px-6 sm:px-8">
                  <div className="flex items-center w-full mb-6">
                    <div
                      className={`flex-1 h-px ${idx === 0 ? "opacity-0" : "bg-slate-200"}`}
                    />

                    {/* Circle */}
                    <div className="relative flex-shrink-0 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 ring-4 ring-white border border-slate-200 z-10">
                      <Icon
                        className="h-8 w-8 text-slate-600"
                        strokeWidth={1.5}
                      />
                    </div>

                    <div
                      className={`flex-1 h-px ${isLast ? "opacity-0" : "bg-slate-200"}`}
                    />
                  </div>

                  {/* Text */}
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Passo {step}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
