"use client";
import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function EnergySection() {
  const c = useContent();
  const e = c.energy;
  return (
    <section id="s-energy" className={`${SECTION} bg-d-bg2 relative`}>
      <DynamicBackground accent="emerald" brightness={1.4} count={16} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium mb-2">{e.badge}</span>
          <h2 className="mi-child text-d-fg font-bold mb-2">{e.title}</h2>
          <p className="mi-child text-d-fg/50 text-sm sm:text-base max-w-2xl mx-auto">{e.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {e.stats.map((stat: any, i: number) => (
            <div key={i} className="mi-child rounded-xl bg-d-fg/5 border border-emerald-500/15 p-4 sm:p-5 text-center">
              <div className="text-emerald-400 font-bold text-xl sm:text-2xl lg:text-3xl mb-1">{stat.value}</div>
              <div className="text-d-fg text-xs sm:text-sm font-medium mb-1">{stat.label}</div>
              <div className="text-d-fg/35 text-[9px] sm:text-[10px] leading-snug">{stat.note}</div>
            </div>
          ))}
        </div>
        <p className="mi-child text-center text-d-fg/35 text-[10px] sm:text-xs mt-2">{e.note}</p>
      </div>
    </section>
  );
}
