"use client";
import React from "react";
import { useContent } from "../hooks";
import { SectionShell } from "./SectionShell";

export function SolutionSection() {
  const c = useContent();
  const s = c.solution;
  return (
    <SectionShell
      id="s-solution"
      accent="emerald"
      brightness={1.3}
      particleCount={14}
      maxWidth="max-w-5xl"
      badge={s.badge}
      title={s.title}
      subtitle={s.subtitle}
    >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {s.items.map((item: any, i: number) => (
                    <div key={i} className="mi-child rounded-xl bg-d-indigo-s/40 border border-d-indigo/20 p-5 sm:p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="text-2xl mb-3">{item.icon}</div>
                      <div className="text-d-fg font-semibold text-sm sm:text-base mb-1.5">{item.title}</div>
                      <div className="text-d-fg/55 text-xs sm:text-sm leading-relaxed">{item.desc}</div>
                    </div>
                  ))}
                </div>
    </SectionShell>
  );
}
