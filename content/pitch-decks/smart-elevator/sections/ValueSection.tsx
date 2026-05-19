"use client";
import React from "react";
import { useContent } from "../hooks";
import { SectionShell } from "./SectionShell";

export function ValueSection() {
  const c = useContent();
  const v = c.value;
  return (
    <SectionShell
      id="s-value"
      accent="emerald"
      brightness={1.3}
      particleCount={14}
      maxWidth="max-w-5xl"
      badge={v.badge}
      title={v.title}
      subtitle={v.subtitle}
    >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {v.items.map((item: any, i: number) => (
                    <div key={i} className="mi-child rounded-xl bg-d-indigo-s/40 border border-d-indigo/20 p-5 sm:p-6">
                      <div className="text-3xl mb-3">{item.icon}</div>
                      <div className="text-d-fg font-bold text-sm sm:text-base mb-3">{item.title}</div>
                      <ul className="space-y-1.5">
                        {item.items.map((li: string, j: number) => (
                          <li key={j} className="flex items-start gap-2 text-d-fg/60 text-xs sm:text-sm">
                            <span className="text-d-indigo mt-0.5 shrink-0">✓</span>{li}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
    </SectionShell>
  );
}
