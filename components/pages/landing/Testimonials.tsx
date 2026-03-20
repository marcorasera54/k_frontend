"use client";

import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Marco B.",
    role: "Giocatore amatoriale",
    text: "Finalmente posso prenotare il campo di calcetto senza chiamare! In 30 secondi ho il mio slot confermato. Lo uso ogni settimana.",
    stars: 5,
    avatar: "MB",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Giulia R.",
    role: "Tennista",
    text: "Ho trovato un campo di tennis vicino casa che non conoscevo. La disponibilità in tempo reale è un'ottima funzionalità.",
    stars: 5,
    avatar: "GR",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    name: "Luca M.",
    role: "Gestore Centro Sportivo",
    text: "Da quando uso questa piattaforma ho ridotto le telefonate del 90%. La dashboard è chiara e le notifiche ai clienti sono automatiche.",
    stars: 5,
    avatar: "LM",
    color: "bg-violet-100 text-violet-600",
  },
  {
    name: "Sara T.",
    role: "Giocatrice di padel",
    text: "Cercare un campo di padel era un'impresa. Ora in due click trovo disponibilità e prenoto. Semplicemente perfetto.",
    stars: 5,
    avatar: "ST",
    color: "bg-rose-100 text-rose-600",
  },
  {
    name: "Andrea F.",
    role: "Allenatore di basket",
    text: "Gestisco le prenotazioni per tutta la squadra. La piattaforma è intuitiva e non ho mai avuto problemi. Consigliatissima.",
    stars: 5,
    avatar: "AF",
    color: "bg-amber-100 text-amber-600",
  },
];

const ALL = [...TESTIMONIALS, ...TESTIMONIALS];

function TestimonialCard({
  name,
  role,
  text,
  stars,
  avatar,
  color,
}: (typeof TESTIMONIALS)[0]) {
  return (
    <div className="w-80 flex-shrink-0 bg-white rounded-md border border-gray-200 p-6 flex flex-col gap-4 hover:shadow-sm transition-shadow duration-300">
      {/* Quote icon */}
      <Quote className="h-6 w-6 text-slate-200 fill-slate-200 flex-shrink-0" />

      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Text */}
      <p className="text-slate-600 text-sm leading-relaxed flex-1">{text}</p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
        <div
          className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs ${color}`}
        >
          {avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-slate-400">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const track1 = useRef<HTMLDivElement>(null);

  // Pause on hover
  const pause = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) ref.current.style.animationPlayState = "paused";
  };
  const play = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) ref.current.style.animationPlayState = "running";
  };

  return (
    <section className="bg-slate-50 py-16 sm:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Recensioni
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Cosa dicono i nostri utenti
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto text-base sm:text-lg">
            Migliaia di sportivi e gestori ci scelgono ogni giorno.
          </p>
        </div>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-4">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div
          ref={track1}
          className="flex gap-4 w-max animate-scroll-left"
          onMouseEnter={() => pause(track1)}
          onMouseLeave={() => play(track1)}
        >
          {ALL.map((t, i) => (
            <TestimonialCard key={`r1-${i}`} {...t} />
          ))}
        </div>
      </div>

      {/* Keyframes injected via style tag */}
      <style>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
