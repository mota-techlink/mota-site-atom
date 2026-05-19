"use client";
import React from "react";
import { useContent } from "../hooks";
import { SectionShell } from "./SectionShell";

export function BizModelSection() {
  const c = useContent();
  const b = c.bizmodel;
  return (
    <SectionShell
      id="s-bizmodel"
      accent="teal"
      brightness={1.3}
      particleCount={14}
      maxWidth="max-w-5xl"
      badge={b.badge}
      title={b.title}
      subtitle={b.subtitle}
    >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {b.phases.map((phase: any, i: number) => (
                    <div key={i} className="mi-child rounded-xl bg-d-amber-s/30 border border-d-amber/20 p-5 sm:p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{phase.icon}</span>
                        <div>
                          <div className="text-d-amber text-xs font-medium">{phase.phase}</div>
                          <div className="text-d-fg font-bold text-sm sm:text-base">{phase.title}</div>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {phase.items.map((li: string, j: number) => (
                          <li key={j} className="flex items-start gap-2 text-d-fg/65 text-xs sm:text-sm">
                            <span className="text-d-amber mt-0.5 shrink-0">·</span>{li}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <p className="mi-child text-center text-d-fg/50 text-xs sm:text-sm px-4">{b.note}</p>
    </SectionShell>
  );
}
