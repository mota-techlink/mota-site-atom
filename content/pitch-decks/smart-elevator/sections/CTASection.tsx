"use client";
import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function CTASection() {
  const c = useContent();
  const ct = c.cta;
  return (
    <section id="s-cta" className={`${SECTION} bg-d-bg relative`}>
      <DynamicBackground accent="indigo" brightness={2.0} count={20} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span className="mi-child inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-d-indigo text-xs sm:text-sm font-medium mb-4">
          {ct.badge}
        </span>
        <h2 className="mi-child text-d-fg font-bold mb-4 max-w-2xl mx-auto">{ct.title}</h2>
        <p className="mi-child text-d-fg/55 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">{ct.subtitle}</p>
        <div className="mi-child flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button className="px-8 py-3 rounded-full bg-d-indigo text-white font-semibold text-sm sm:text-base hover:opacity-90 transition-opacity">
            {ct.primary}
          </button>
          <button className="px-8 py-3 rounded-full bg-d-fg/8 border border-d-fg/15 text-d-fg font-semibold text-sm sm:text-base hover:bg-d-fg/12 transition-colors">
            {ct.secondary}
          </button>
        </div>
        <p className="mi-child text-d-fg/35 text-xs sm:text-sm">{ct.contact}</p>
      </div>
    </section>
  );
}
