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
    <section id="s-cta" className={`${SECTION} bg-black relative`}>
      {/* Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-t from-indigo-950/40 to-transparent" />
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-175 h-175 bg-indigo-600/15 rounded-full blur-[120px]" />
      </div>

      {/* Dynamic particles */}
      <DynamicBackground accent="indigo" count={14} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-6 leading-tight">
          {cta.title}
        </h2>
        <p className="text-sm sm:text-xl text-white/50 mb-6 sm:mb-12 leading-relaxed">{cta.subtitle}</p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-4 sm:mb-8">
          <a
            href="mailto:market@motaiot.com?subject=Market Intelligence — Get Started"
            className="px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-base sm:text-lg transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
          >
            {cta.primary}
          </a>
          <a
            href="mailto:market@motaiot.com?subject=Market Intelligence — Enterprise"
            className="px-6 py-3 sm:px-8 sm:py-4 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white/40 font-semibold text-base sm:text-lg transition-all duration-200"
          >
            {cta.secondary}
          </a>
        </div>

        <p className="text-white/30 text-xs sm:text-sm">{cta.footnote}</p>
      </div>

      {/* Footer — pinned to bottom of the slide */}
      <div className="absolute bottom-0 inset-x-0 border-t border-white/10 py-3 sm:py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <p className="text-white/25 text-xs sm:text-sm">{footer.copyright}</p>
          <div className="flex gap-4 sm:gap-6">
            {footer.links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-white/30 hover:text-white/60 text-xs sm:text-sm transition-colors"
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
