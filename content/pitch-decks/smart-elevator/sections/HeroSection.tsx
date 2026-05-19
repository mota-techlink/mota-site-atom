"use client";
import React from "react";
import { useContent, useNav } from "../hooks";
import { SECTION, SECTION_MAP } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function HeroSection() {
  const c = useContent();
  const goTo = useNav();
  const h = c.hero;

  return (
    <section id="s-hero" className={`${SECTION} bg-[#1a0f0a] relative`}>
      <DynamicBackground accent="indigo" brightness={1.5} count={18} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div className="mi-child mb-4 sm:mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-600/40 text-amber-400 text-xs sm:text-sm font-medium">
            {h.badge}
          </span>
        </div>

        {/* Headline */}
        <h1 className="mi-child text-white font-bold mb-3 sm:mb-5 leading-tight">
          {h.title}{" "}
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{h.titleHighlight}</span>
        </h1>

        {/* Subtitle */}
        <p className="mi-child text-stone-300/90 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
          {h.subtitle}
        </p>

        {/* CTAs */}
        <div className="mi-child flex flex-col sm:flex-row gap-3 justify-center mb-8 sm:mb-12">
          <button
            onClick={() => goTo(SECTION_MAP["s-cta"])}
            className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 text-white text-sm sm:text-base font-semibold hover:opacity-90 transition-opacity"
          >
            {h.cta}
          </button>
          <button
            onClick={() => goTo(SECTION_MAP["s-solution"])}
            className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-white/5 border border-amber-600/40 text-white text-sm sm:text-base font-semibold hover:bg-white/10 transition-colors"
          >
            {h.ctaSecondary}
          </button>
        </div>

        {/* Stats */}
        <div className="mi-child grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto">
          {h.stats.map((s: any, i: number) => (
            <div key={i} className="rounded-xl bg-stone-900/60 border border-amber-600/30 px-3 py-3 sm:px-4 sm:py-4">
              <div className="text-amber-400 font-bold text-lg sm:text-2xl lg:text-3xl">{s.value}</div>
              <div className="text-stone-300/60 text-[10px] sm:text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
