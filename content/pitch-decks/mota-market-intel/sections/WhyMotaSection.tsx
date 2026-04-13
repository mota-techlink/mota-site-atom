"use client";

import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

const ACCENTS = ["indigo", "violet", "emerald"] as const;

export function WhyMotaSection() {
  const c = useContent();
  const w = c.whymota;

  return (
    <section id="s-whymota" className={`${SECTION} bg-zinc-950`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-8 lg:mb-12">
          <span className="inline-block px-3 py-1 sm:px-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs sm:text-sm font-medium mb-2 sm:mb-3">
            {w.badge}
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white">{w.title}</h2>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          {w.cards.map((card, i) => {
            const accent = ACCENTS[i];
            return (
              <div
                key={i}
                className={`mi-child rounded-xl sm:rounded-2xl border p-3 sm:p-5 lg:p-8 transition-all duration-200 hover:-translate-y-1 group border-${accent}-500/20 bg-${accent}-950/10 hover:border-${accent}-500/40`}
              >
                <div className={`w-6 sm:w-10 h-1 sm:h-1.5 rounded-full bg-${accent}-500 mb-2 sm:mb-4 lg:mb-6`} />
                <h3 className="text-white font-bold text-xs sm:text-base lg:text-lg mb-1.5 sm:mb-3 lg:mb-4">{card.title}</h3>
                <p className="text-white/50 leading-relaxed text-[10px] sm:text-sm lg:text-base">{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
