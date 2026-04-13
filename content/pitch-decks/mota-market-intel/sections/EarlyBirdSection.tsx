"use client";

import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function EarlyBirdSection() {
  const c = useContent();
  const e = c.earlybird;

  return (
    <section id="s-earlybird" className={`${SECTION} bg-black relative`}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-violet-600/10 rounded-full blur-[100px]" />
      </div>
      <DynamicBackground accent="violet" brightness={1.8} count={18} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-3 sm:mb-5 lg:mb-8">
          <span className="inline-block px-3 py-1 sm:px-4 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs sm:text-sm font-medium mb-2 sm:mb-3">
            {e.badge}
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">{e.title}</h2>
          <p className="text-white/50 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {e.subtitle}
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-5 lg:mb-8">
          {e.benefits.map((b, i) => (
            <div
              key={i}
              className="mi-child rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 hover:bg-violet-950/20 p-2.5 sm:p-4 lg:p-5 transition-all duration-200"
            >
              <div className="text-lg sm:text-xl lg:text-2xl mb-1 sm:mb-2">{b.icon}</div>
              <h3 className="text-white font-bold text-xs sm:text-base lg:text-lg mb-0.5 sm:mb-1">{b.title}</h3>
              <p className="text-white/50 leading-relaxed text-[10px] sm:text-xs lg:text-sm">{b.description}</p>
            </div>
          ))}
        </div>

        {/* Urgency banner */}
        <div className="rounded-xl sm:rounded-2xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 sm:px-8 sm:py-5 text-center">
          <p className="text-amber-300 font-medium text-xs sm:text-base">{e.urgency}</p>
        </div>
      </div>
    </section>
  );
}
