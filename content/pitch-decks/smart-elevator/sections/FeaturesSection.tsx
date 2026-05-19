"use client";
import React from "react";
import { useContent } from "../hooks";
import { SectionShell } from "./SectionShell";

export function FeaturesSection() {
  const c = useContent();
  const f = c.features;
  return (
    <SectionShell
      id="s-features"
      accent="emerald"
      brightness={1.3}
      particleCount={14}
      maxWidth="max-w-5xl"
      badge={f.badge}
      title={f.title}
      subtitle={f.subtitle}
    >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {f.items.map((item: any, i: number) => (
                    <div key={i} className="mi-child flex gap-4 rounded-xl bg-d-fg/5 border border-emerald-500/10 p-5">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-lg shrink-0">{item.icon}</div>
                      <div>
                        <div className="text-d-fg font-semibold text-sm sm:text-base mb-1">{item.title}</div>
                        <div className="text-d-fg/55 text-xs sm:text-sm leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
    </SectionShell>
  );
}
