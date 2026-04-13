"use client";

import React from "react";
import { useContent, useNav } from "../hooks";
import { SECTION, SECTION_MAP } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function HeroSection() {
  const c = useContent();
  const h = c.hero;
  const goTo = useNav();

  return (
    <section
      id="s-hero"
      className={`${SECTION} relative items-center justify-center bg-black`}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-950 via-black to-black" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-200 h-200 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-violet-600/15 rounded-full blur-[80px]" />
      </div>

      {/* Dynamic floating particles */}
      <DynamicBackground accent="indigo" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-16 text-center">
        {/* Badge */}
        <div className="mi-child inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-medium mb-3 sm:mb-5 lg:mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          {h.badge}
        </div>

        {/* Title */}
        <h1 className="mi-child text-2xl sm:text-4xl lg:text-6xl font-bold text-white leading-tight mb-1 sm:mb-3">
          {h.title}
        </h1>

        {/* Title highlight */}
        <p className="mi-child text-xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-5 lg:mb-8">
          <span className="bg-linear-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            {h.titleHighlight}
          </span>
        </p>

        {/* Subtitle */}
        <p className="mi-child text-sm sm:text-lg lg:text-xl text-white/60 max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-8 lg:mb-12">
          {h.subtitle}
        </p>

        {/* CTAs */}
        <div className="mi-child flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-12 lg:mb-20">
          <button
            onClick={() => goTo(SECTION_MAP["s-cta"])}
            className="px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
          >
            {h.cta}
          </button>
          <button
            onClick={() => goTo(SECTION_MAP["s-howitworks"])}
            className="px-6 py-3 sm:px-8 sm:py-4 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 font-semibold text-base sm:text-lg transition-all duration-200"
          >
            {h.ctaSecondary}
          </button>
        </div>

        {/* Stats */}
        <div className="mi-child grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
          {h.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Page indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
        <div className="w-px h-8 bg-linear-to-b from-transparent to-white/30" />
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}
