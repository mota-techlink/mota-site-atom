"use client";

import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function PricingSection() {
  const c = useContent();
  const p = c.pricing;

  return (
    <section id="s-pricing" className={`${SECTION} bg-d-bg relative`}>
      <DynamicBackground accent="amber" brightness={1.8} count={18} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="inline-block px-3 py-1 sm:px-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-d-amber text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          {p.badge}
        </span>
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-d-fg mb-1 sm:mb-2">{p.title}</h2>
        <p className="text-d-fg/50 text-sm sm:text-lg max-w-2xl mx-auto mb-3 sm:mb-6 lg:mb-10 leading-relaxed">
          {p.subtitle}
        </p>

        {/* Price display */}
        <div className="inline-flex flex-col items-center rounded-2xl sm:rounded-3xl bg-linear-to-b from-d-indigo-s/80 to-d-bg border border-d-indigo/30 p-4 sm:p-7 lg:p-10 mb-3 sm:mb-5 lg:mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5 pointer-events-none" />
          <div className="text-3xl sm:text-5xl lg:text-7xl font-black text-d-fg mb-1 sm:mb-2 relative z-10">
            {p.currentRate}
          </div>
          <div className="text-d-fg/40 text-sm sm:text-lg mb-1 relative z-10">{p.perClick}</div>
          <div className="text-d-indigo text-xs sm:text-sm font-medium relative z-10">
            {p.currentRateLabel}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xl mx-auto mb-3 sm:mb-5 lg:mb-8">
          {p.features.map((f, i) => (
            <div
              key={i}
              className="mi-child flex items-center gap-2 sm:gap-3 text-d-fg/70 bg-d-fg/5 rounded-lg sm:rounded-xl px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-base"
            >
              <span className="text-d-emerald shrink-0">✓</span>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <p className="text-d-fg/30 text-xs sm:text-sm max-w-md mx-auto">{p.note}</p>
      </div>
    </section>
  );
}
