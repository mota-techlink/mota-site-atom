"use client";
import React from "react";
import { useContent } from "../hooks";
import { SectionShell } from "./SectionShell";

export function HowWorksSection() {
  const c = useContent();
  const h = c.howworks;
  return (
    <SectionShell
      id="s-howworks"
      accent="emerald"
      brightness={1.3}
      particleCount={12}
      maxWidth="max-w-5xl"
      badge={h.badge}
      title={h.title}
      subtitle={h.subtitle}
    >
        <div className="space-y-3">
                  {h.steps.map((step: any, i: number) => (
                    <div key={i} className="mi-child flex items-start gap-4 rounded-xl bg-d-fg/5 border border-d-indigo/15 p-4 sm:p-5">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500/20 border border-d-indigo/30 flex items-center justify-center text-d-indigo font-bold text-sm shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <div className="text-d-fg font-semibold text-sm sm:text-base mb-0.5">{step.title}</div>
                        <div className="text-d-fg/55 text-xs sm:text-sm leading-relaxed">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
    </SectionShell>
  );
}
