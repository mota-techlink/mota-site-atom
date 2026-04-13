"use client";

import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

export function PricingSection() {
  const c = useContent();
  const p = c.pricing;

  return (
    <section id="s-pricing" className={`${SECTION} bg-black`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-4">
          {p.badge}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{p.title}</h2>
        <p className="text-white/50 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {p.subtitle}
        </p>

        {/* Price display */}
        <div className="inline-flex flex-col items-center rounded-3xl bg-linear-to-b from-indigo-950/80 to-black border border-indigo-500/30 p-10 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
          <div className="text-7xl font-black text-white mb-2 relative z-10">
            {p.currentRate}
          </div>
          <div className="text-white/40 text-lg mb-1 relative z-10">{p.perClick}</div>
          <div className="text-indigo-400 text-sm font-medium relative z-10">
            {p.currentRateLabel}
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-2 gap-3 max-w-xl mx-auto mb-8">
          {p.features.map((f, i) => (
            <div
              key={i}
              className="mi-child flex items-center gap-3 text-white/70 bg-white/5 rounded-xl px-5 py-3"
            >
              <span className="text-emerald-400 shrink-0">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <p className="text-white/30 text-sm max-w-md mx-auto">{p.note}</p>
      </div>
    </section>
  );
}
