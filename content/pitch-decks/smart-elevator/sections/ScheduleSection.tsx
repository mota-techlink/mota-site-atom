"use client";
import React, { useState } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";
import { DetailModal, useIsMobile } from "./DetailModal";

const COLOR_MAP: Record<string, { bg: string; border: string; badge: string; text: string }> = {
  // Re-themed to blue family: amber → cyan, indigo → indigo (both kept distinct).
  amber:  { bg: "bg-cyan-950/40",  border: "border-amber-600/40",  badge: "bg-cyan-500/20 text-cyan-200",  text: "text-cyan-200" },
  indigo: { bg: "bg-indigo-950/50", border: "border-amber-600/30", badge: "bg-indigo-500/20 text-indigo-200", text: "text-indigo-200" },
};

export function ScheduleSection() {
  const c = useContent();
  const sc = c.schedule;
  const isMobile = useIsMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? sc.modes[openIdx] : null;

  return (
    <section id="s-schedule" className={`${SECTION} bg-[#1a0f0a] relative`}>
      <DynamicBackground accent="amber" brightness={1.3} count={12} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-5 sm:mb-8">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-600/40 text-amber-400 text-xs sm:text-sm font-medium mb-2">{sc.badge}</span>
          <h2 className="mi-child text-white font-bold mb-2">{sc.title}</h2>
          <p className="mi-child text-stone-300/70 text-sm sm:text-base max-w-2xl mx-auto">{sc.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sc.modes.map((mode: any, i: number) => {
            const col = COLOR_MAP[mode.color] ?? COLOR_MAP.indigo;
            return (
              <div
                key={i}
                onClick={isMobile ? () => setOpenIdx(i) : undefined}
                role={isMobile ? "button" : undefined}
                tabIndex={isMobile ? 0 : undefined}
                className={`mi-child rounded-xl ${col.bg} ${col.border} border p-4 sm:p-5 ${isMobile ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
              >
                <div className="text-xl mb-2">{mode.icon}</div>
                <div className="text-stone-300/60 text-[10px] sm:text-xs mb-1">{mode.time}</div>
                <div className="text-white font-bold text-xs sm:text-sm mb-1">{mode.label}</div>
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
      </div>

      <DetailModal
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        title={active?.label ?? ""}
        icon={active?.icon}
        eyebrow={active ? `${sc.badge} · ${active.time}` : sc.badge}
      >
        {active ? (
          <>
            <div className="text-amber-400 text-xs font-medium">{active.strategy}</div>
            <ul className="space-y-1.5 pt-1">
              {active.items.map((it: string, j: number) => (
                <li key={j} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5 shrink-0">·</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </DetailModal>
    </section>
  );
}
