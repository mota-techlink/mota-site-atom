"use client";
import React from "react";
import { useContent } from "../hooks";
import { SectionShell } from "./SectionShell";

export function AccessControlSection() {
  const c = useContent();
  const a = c.access_control;
  return (
    <SectionShell
      id="s-access-control"
      accent="emerald"
      brightness={1.4}
      particleCount={16}
      maxWidth="max-w-5xl"
      badge={a.badge}
      title={a.title}
      subtitle={a.subtitle}
    >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                  {a.steps.map((step: any, i: number) => (
                    <div key={i} className="mi-child relative rounded-xl bg-d-indigo-s/40 border border-d-indigo/20 p-4 text-center">
                      {i < a.steps.length - 1 && (
                        <div className="hidden sm:block absolute top-1/2 -right-4 text-d-indigo/40 text-lg z-10">→</div>
                      )}
                      <div className="text-d-indigo font-bold text-lg sm:text-xl mb-1">{step.step}</div>
                      <div className="text-d-fg font-semibold text-xs sm:text-sm mb-1">{step.title}</div>
                      <div className="text-d-fg/50 text-[10px] sm:text-xs leading-snug">{step.desc}</div>
                    </div>
                  ))}
                </div>
                <p className="mi-child text-center text-d-fg/40 text-xs sm:text-sm mt-2 px-2">{a.note}</p>
    </SectionShell>
  );
}
