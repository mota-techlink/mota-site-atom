"use client";
import React from "react";
import { useContent } from "../hooks";
import { SectionShell } from "./SectionShell";

export function RoadmapSection() {
  const c = useContent();
  const r = c.roadmap;
  return (
    <SectionShell
      id="s-roadmap"
      accent="emerald"
      brightness={1.2}
      particleCount={12}
      maxWidth="max-w-4xl"
      badge={r.badge}
      title={r.title}
    >
        <div className="space-y-3">
                  {r.items.map((item: any, i: number) => (
                    <div key={i} className="mi-child flex items-start gap-4 rounded-xl bg-d-fg/5 border border-d-indigo/15 p-4 sm:p-5">
                      <div className="min-w-[4rem] text-d-indigo font-bold text-xs sm:text-sm shrink-0 pt-0.5">{item.week}</div>
                      <div>
                        <div className="text-d-fg font-semibold text-sm sm:text-base mb-0.5">{item.title}</div>
                        <div className="text-d-fg/55 text-xs sm:text-sm">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
    </SectionShell>
  );
}
