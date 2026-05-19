"use client";
import React from "react";
import { useContent } from "../hooks";
import { SectionShell } from "./SectionShell";

export function ProblemSection() {
  const c = useContent();
  const p = c.problem;
  return (
    <SectionShell
      id="s-problem"
      accent="lime"
      brightness={1.4}
      particleCount={16}
      maxWidth="max-w-5xl"
      badge={p.badge}
      title={p.title}
      subtitle={p.subtitle}
    >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {p.items.map((item: any, i: number) => (
                    <div key={i} className="mi-child flex gap-4 rounded-xl bg-d-fg/5 border border-lime-500/10 p-4 sm:p-5">
                      <div className="text-2xl sm:text-3xl shrink-0 mt-0.5">{item.icon}</div>
                      <div>
                        <div className="text-d-fg font-semibold text-sm sm:text-base mb-1">{item.title}</div>
                        <div className="text-d-fg/50 text-xs sm:text-sm leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
    </SectionShell>
  );
}
