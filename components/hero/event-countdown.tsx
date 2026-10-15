"use client";

import { useSyncExternalStore } from "react";
import { Sparkles, PartyPopper } from "lucide-react";

function subscribe(callback: () => void) {
  const timer = setInterval(callback, 1000);
  return () => clearInterval(timer);
}

export function EventCountdown({ targetDate }: { targetDate: string | Date }) {
  const targetTime = new Date(targetDate).getTime();

  const secondsLeft = useSyncExternalStore(
    subscribe,
    () => Math.max(0, Math.floor((targetTime - Date.now()) / 1000)),
    () => -1
  );

  if (secondsLeft === -1) {
    return (
      <div className="mx-auto mt-8 flex flex-col items-center" aria-hidden>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-[#4A3726]/70 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300 shadow-sm">
          <Sparkles className="size-3 text-amber-400" />
          <span>Cuenta regresiva para la peña</span>
        </div>
        <div className="mt-3.5 grid grid-cols-4 gap-2.5 sm:gap-4 max-w-xs sm:max-w-md w-full px-2">
          {["Días", "Horas", "Minutos", "Segundos"].map((label) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center rounded-xl border border-amber-400/25 bg-[#2B1D11]/80 backdrop-blur-xs px-2 py-3 shadow-md"
            >
              <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#FBF3E3] tabular-nums">
                --
              </span>
              <span className="mt-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-amber-300/80">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (secondsLeft === 0) {
    return (
      <div className="mx-auto mt-8 flex items-center justify-center gap-2.5 rounded-full border border-amber-400/40 bg-amber-500/15 px-5 py-2 text-sm font-semibold uppercase tracking-[0.15em] text-amber-300 shadow-md">
        <PartyPopper className="size-4 text-amber-300 animate-bounce" />
        <span>¡Llegó el día de la peña! Te esperamos</span>
      </div>
    );
  }

  const days = Math.floor(secondsLeft / (60 * 60 * 24));
  const hours = Math.floor((secondsLeft % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((secondsLeft % (60 * 60)) / 60);
  const seconds = secondsLeft % 60;

  const counters = [
    { label: "Días", value: days },
    { label: "Horas", value: hours },
    { label: "Minutos", value: minutes },
    { label: "Segundos", value: seconds },
  ];

  return (
    <div className="mx-auto mt-8 flex flex-col items-center">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-[#4A3726]/70 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-300 shadow-sm">
        <Sparkles className="size-3 text-amber-400" />
        <span>Cuenta regresiva para la peña</span>
      </div>

      <div className="mt-3.5 grid grid-cols-4 gap-2.5 sm:gap-4 max-w-xs sm:max-w-md w-full px-2">
        {counters.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center rounded-xl border border-amber-400/25 bg-[#2B1D11]/80 backdrop-blur-xs px-2 py-3 shadow-md transition-transform hover:scale-105"
          >
            <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[#FBF3E3] tabular-nums">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="mt-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-amber-300/80">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
