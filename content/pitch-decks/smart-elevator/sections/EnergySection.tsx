"use client";
import React from "react";
import { useContent } from "../hooks";
import { SectionShell } from "./SectionShell";

export function EnergySection() {
  const c = useContent();
  const e = c.energy;
  return (
    <SectionShell
      id="s-energy"
      accent="emerald"
      brightness={1.4}
      particleCount={16}
      maxWidth="max-w-5xl"
      badge={e.badge}
      title={e.title}
      subtitle={e.subtitle}
    >
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
    </SectionShell>
  );
}
