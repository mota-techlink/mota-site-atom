"use client";

import React, { useEffect, useRef, useState } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

/* ── colour palettes per card ── */
const CARD_ACCENT = [
  {
    gradient: "from-indigo-500/20 via-indigo-600/10 to-transparent",
    ring: "ring-indigo-500/30 hover:ring-indigo-400/50",
    metric: "text-indigo-400",
    glow: "group-hover:shadow-indigo-500/20",
    bar: "bg-indigo-500",
  },
  {
    gradient: "from-violet-500/20 via-violet-600/10 to-transparent",
    ring: "ring-violet-500/30 hover:ring-violet-400/50",
    metric: "text-violet-400",
    glow: "group-hover:shadow-violet-500/20",
    bar: "bg-violet-500",
  },
  {
    gradient: "from-emerald-500/20 via-emerald-600/10 to-transparent",
    ring: "ring-emerald-500/30 hover:ring-emerald-400/50",
    metric: "text-emerald-400",
    glow: "group-hover:shadow-emerald-500/20",
    bar: "bg-emerald-500",
  },
] as const;

/* ── animated counter hook ── */
function useCounter(target: string, duration = 1200) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        ob.disconnect();
        // extract numeric portion
        const num = parseFloat(target.replace(/[^0-9.]/g, ""));
        const prefix = target.match(/^[^0-9]*/)?.[0] ?? "";
        const suffix = target.match(/[^0-9]*$/)?.[0] ?? "";
        const isInt = !target.includes(".");
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
          const v = num * ease;
          setDisplay(prefix + (isInt ? Math.round(v).toString() : v.toFixed(1)) + suffix);
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [target, duration]);

  return { ref, display };
}

function MetricCounter({ value, label, accent }: { value: string; label: string; accent: string }) {
  const { ref, display } = useCounter(value);
  return (
    <div ref={ref} className="mb-1 sm:mb-3">
      <span className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight ${accent}`}>
        {display}
      </span>
      {label && (
        <div className="text-[9px] sm:text-xs text-white/35 mt-0.5 font-semibold uppercase tracking-widest">
          {label}
        </div>
      )}
    </div>
  );
}

export function WhyMotaSection() {
  const c = useContent();
  const w = c.whymota;

  return (
    <section id="s-whymota" className={`${SECTION} bg-zinc-950 relative overflow-hidden`}>
      {/* radial glow behind cards */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px]" />
      </div>

      <DynamicBackground accent="indigo" brightness={1.6} count={22} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── header ── */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-10">
          <span className="inline-block px-3 py-1 sm:px-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs sm:text-sm font-medium mb-2 sm:mb-3 animate-pulse">
            {w.badge}
          </span>

          <h2 className="text-xl sm:text-3xl lg:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-white via-indigo-200 to-indigo-400 leading-tight">
            {w.title}
          </h2>

          {w.subtitle && (
            <p className="mt-2 sm:mt-3 text-xs sm:text-base lg:text-lg text-white/45 max-w-2xl mx-auto leading-relaxed">
              {w.subtitle}
            </p>
          )}
        </div>

        {/* ── cards ── */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          {w.cards.map((card: any, i: number) => {
            const a = CARD_ACCENT[i];
            return (
              <div
                key={i}
                className={`group mi-child relative rounded-xl sm:rounded-2xl bg-linear-to-br ${a.gradient} ring-1 ${a.ring} p-3 sm:p-5 lg:p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl ${a.glow} text-center overflow-hidden`}
              >
                {/* decorative top bar */}
                <div className={`absolute top-0 inset-x-0 h-0.5 ${a.bar} opacity-60 group-hover:opacity-100 transition-opacity`} />

                {/* icon with glow */}
                {card.icon && (
                  <div className="text-2xl sm:text-4xl lg:text-5xl mb-1.5 sm:mb-3 drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
                    {card.icon}
                  </div>
                )}

                {/* animated metric */}
                {card.metric && (
                  <MetricCounter value={card.metric} label={card.metricLabel ?? ""} accent={a.metric} />
                )}

                <h3 className="text-white font-bold text-[11px] sm:text-base lg:text-lg mb-1 sm:mb-2">
                  {card.title}
                </h3>
                <p className="text-white/45 leading-relaxed text-[9px] sm:text-sm lg:text-base">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
