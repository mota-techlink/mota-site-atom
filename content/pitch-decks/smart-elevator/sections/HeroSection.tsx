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
    <section id="s-hero" className={`${SECTION} bg-d-bg relative`}>
      <DynamicBackground accent="indigo" brightness={1.5} count={18} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <div className="mi-child mb-4 sm:mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-d-indigo text-xs sm:text-sm font-medium">
            {h.badge}
          </span>
        </div>

        {/* Headline */}
        <h1 className="mi-child text-d-fg font-bold mb-3 sm:mb-5 leading-tight">
          {h.title}{" "}
          <span className="text-d-indigo">{h.titleHighlight}</span>
        </h1>

        {/* Subtitle */}
        <p className="mi-child text-d-fg/60 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base lg:text-lg mb-6 sm:mb-8">
          {h.subtitle}
        </p>

        {/* CTAs */}
        <div className="mi-child flex flex-col sm:flex-row gap-3 justify-center mb-8 sm:mb-12">
          <button
            onClick={() => goTo(SECTION_MAP["s-cta"])}
            className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-d-indigo text-white text-sm sm:text-base font-semibold hover:opacity-90 transition-opacity"
          >
            {h.cta}
          </button>
          <button
            onClick={() => goTo(SECTION_MAP["s-solution"])}
            className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-d-fg/8 border border-d-fg/15 text-d-fg text-sm sm:text-base font-semibold hover:bg-d-fg/12 transition-colors"
          >
            {h.ctaSecondary}
          </button>
        </div>

        {/* Stats */}
        <div className="mi-child grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto">
          {h.stats.map((s: any, i: number) => (
            <div key={i} className="rounded-xl bg-d-fg/5 border border-d-fg/10 px-3 py-3 sm:px-4 sm:py-4">
              <div className="text-d-indigo font-bold text-lg sm:text-2xl lg:text-3xl">{s.value}</div>
              <div className="text-d-fg/50 text-[10px] sm:text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
