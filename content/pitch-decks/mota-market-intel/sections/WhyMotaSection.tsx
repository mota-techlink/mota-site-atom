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
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
            {w.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">{w.title}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {w.cards.map((card, i) => {
            const accent = ACCENTS[i];
            return (
              <div
                key={i}
                className={`mi-child rounded-2xl border p-8 transition-all duration-200 hover:-translate-y-1 group border-${accent}-500/20 bg-${accent}-950/10 hover:border-${accent}-500/40`}
              >
                <div className={`w-10 h-1.5 rounded-full bg-${accent}-500 mb-6`} />
                <h3 className="text-white font-bold text-lg mb-4">{card.title}</h3>
                <p className="text-white/50 leading-relaxed">{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
