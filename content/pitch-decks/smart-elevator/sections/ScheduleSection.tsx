"use client";
import React from "react";
import { useContent } from "../hooks";
import { SectionShell } from "./SectionShell";

const COLOR_MAP: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  teal:    { bg: "bg-d-amber-s/30",  border: "border-d-amber/25",  badge: "bg-teal-500/15 text-d-amber",  text: "text-d-amber" },
  emerald: { bg: "bg-d-indigo-s/40", border: "border-d-indigo/25", badge: "bg-emerald-500/15 text-d-indigo", text: "text-d-indigo" },
  amber:   { bg: "bg-d-amber-s/30",  border: "border-d-amber/25",  badge: "bg-teal-500/15 text-d-amber",  text: "text-d-amber" },
  indigo:  { bg: "bg-d-indigo-s/40", border: "border-d-indigo/25", badge: "bg-emerald-500/15 text-d-indigo", text: "text-d-indigo" },
};

export function ScheduleSection() {
  const c = useContent();
  const sc = c.schedule;
  return (
    <SectionShell
      id="s-schedule"
      accent="teal"
      brightness={1.3}
      particleCount={12}
      maxWidth="max-w-6xl"
      badge={sc.badge}
      title={sc.title}
      subtitle={sc.subtitle}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {sc.modes.map((mode: any, i: number) => {
          const col = COLOR_MAP[mode.color] ?? COLOR_MAP.emerald;
          return (
            <div key={i} className={`mi-child rounded-xl ${col.bg} ${col.border} border p-4 sm:p-5`}>
              <div className="text-xl mb-2">{mode.icon}</div>
              <div className="text-d-fg/50 text-[10px] sm:text-xs mb-1">{mode.time}</div>
              <div className="text-d-fg font-bold text-xs sm:text-sm mb-1">{mode.label}</div>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium ${col.badge} mb-3`}>{mode.strategy}</span>
              <ul className="space-y-1">
                {mode.items.map((item: string, j: number) => (
                  <li key={j} className={`text-[10px] sm:text-xs ${col.text}/80 flex items-start gap-1`}>
                    <span className="mt-0.5 shrink-0">·</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
