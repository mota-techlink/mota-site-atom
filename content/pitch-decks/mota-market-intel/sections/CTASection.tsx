"use client";

import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function CTASection() {
  const c = useContent();
  const cta = c.cta;
  const footer = c.footer;

  return (
    <section id="s-cta" className={`${SECTION} bg-d-bg relative overflow-hidden`}>
      {/* Multi-layer gradient backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-t from-indigo-950/50 via-transparent to-transparent" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/12 rounded-full blur-[140px]" />
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-violet-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] bg-cyan-600/6 rounded-full blur-[80px]" />
      </div>

      {/* Dynamic particles */}
      <DynamicBackground accent="indigo" count={18} brightness={1.4} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* ── Urgency headline ── */}
        {cta.headline && (
          <p className="text-sm sm:text-lg lg:text-xl text-d-fg/50 mb-1 sm:mb-2 font-medium tracking-wide">
            {cta.headline}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-400 to-amber-400 font-bold">
              {cta.headlineHighlight}
            </span>
          </p>
        )}

        {/* ── Main title ── */}
        <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-[length:200%_auto] animate-[gradient-flow_4s_ease-in-out_infinite] mb-3 sm:mb-5 leading-tight"
            style={{ backgroundImage: "linear-gradient(90deg, #818cf8, #c084fc, #f472b6, #fb923c, #facc15, #34d399, #818cf8)" }}>
          {cta.title}
        </h2>

        <p className="text-xs sm:text-lg lg:text-xl text-d-fg/45 mb-5 sm:mb-8 leading-relaxed max-w-2xl mx-auto">
          {cta.subtitle}
        </p>

        {/* ── Stats row ── */}
        {cta.stats && (
          <div className="flex justify-center gap-4 sm:gap-8 lg:gap-12 mb-5 sm:mb-8">
            {cta.stats.map((s: any, i: number) => (
              <div key={i} className="text-center">
                <div className="text-xl sm:text-3xl lg:text-4xl font-black text-d-fg">
                  {s.value}
                </div>
                <div className="text-[9px] sm:text-xs text-d-fg/35 mt-0.5 font-medium uppercase tracking-wider">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CTA buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-3 sm:mb-5">
          {/* Primary — animated glow ring */}
          <a
            href="/products/market-intel"
            className="group relative px-7 py-3 sm:px-10 sm:py-4 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm sm:text-lg transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-400/50"
          >
            {/* pulse ring */}
            <span className="absolute inset-0 rounded-full border-2 border-d-indigo/40 animate-ping pointer-events-none" />
            <span className="relative">{cta.primary}</span>
          </a>
          <a
            href="/contact"
            className="px-7 py-3 sm:px-10 sm:py-4 rounded-full border border-d-fg/20 hover:border-d-fg/40 text-d-fg/80 hover:text-d-fg font-semibold text-sm sm:text-lg transition-all duration-300 backdrop-blur-sm"
          >
            {cta.secondary}
          </a>
        </div>

        {/* ── Urgency banner ── */}
        {cta.urgency && (
          <p className="text-xs sm:text-sm text-amber-400/80 font-medium mb-3 sm:mb-4 animate-pulse">
            {cta.urgency}
          </p>
        )}

        <p className="text-d-fg/25 text-[10px] sm:text-sm">{cta.footnote}</p>
      </div>

      {/* Footer — pinned to bottom */}
      <div className="absolute bottom-0 inset-x-0 border-t border-d-fg/10 py-3 sm:py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <p className="text-d-fg/25 text-xs sm:text-sm">{footer.copyright}</p>
          <div className="flex gap-4 sm:gap-6">
            {footer.links.map((link: any, i: number) => (
              <a
                key={i}
                href={link.href}
                className="text-d-fg/30 hover:text-d-fg/60 text-xs sm:text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
