"use client";
import React from "react";
import { useContent } from "../hooks";
import { SectionShell } from "./SectionShell";

export function DisplaySection() {
  const c = useContent();
  const d = c.display;
  return (
    <SectionShell
      id="s-display"
      accent="teal"
      brightness={1.3}
      particleCount={14}
      maxWidth="max-w-5xl"
      badge={d.badge}
      title={d.title}
      subtitle={d.subtitle}
    >
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {d.items.map((item: any, i: number) => (
                    <div key={i} className="mi-child rounded-xl bg-d-amber-s/30 border border-d-amber/20 p-4 sm:p-5">
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <div className="text-d-fg font-semibold text-xs sm:text-sm mb-1">{item.title}</div>
                      <div className="text-d-fg/55 text-[10px] sm:text-xs leading-relaxed">{item.desc}</div>
                    </div>
                  ))}
                </div>
    </SectionShell>
  );
}
