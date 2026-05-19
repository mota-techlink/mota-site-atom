"use client";
import React, { useState } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";
import { DetailModal, useIsMobile } from "./DetailModal";

export function EnergySection() {
  const c = useContent();
  const e = c.energy;
  const isMobile = useIsMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? e.stats[openIdx] : null;

  return (
    <section id="s-energy" className={`${SECTION} bg-violet-50 dark:bg-[#1a0f0a] relative`}>
      <DynamicBackground accent="emerald" brightness={1.4} count={16} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-600/40 text-amber-400 text-xs sm:text-sm font-medium mb-2">{e.badge}</span>
          <h2 className="mi-child text-stone-900 dark:text-white font-bold mb-2">{e.title}</h2>
          <p className="mi-child text-stone-600/70 dark:text-stone-300/70 text-sm sm:text-base max-w-2xl mx-auto">{e.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {e.stats.map((stat: any, i: number) => (
            <div
              key={i}
              onClick={isMobile ? () => setOpenIdx(i) : undefined}
              role={isMobile ? "button" : undefined}
              tabIndex={isMobile ? 0 : undefined}
              className={`mi-child rounded-xl bg-violet-100/70 dark:bg-stone-900/60 border border-amber-400/50 dark:border-amber-600/30 p-4 sm:p-5 text-center ${isMobile ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
            >
              <div className="text-amber-400 font-bold text-xl sm:text-2xl lg:text-3xl mb-1">{stat.value}</div>
              <div className="text-stone-900 dark:text-white text-xs sm:text-sm font-medium mb-1">{stat.label}</div>
              <div className="text-stone-200/45 text-[9px] sm:text-[10px] leading-snug">{stat.note}</div>
            </div>
          ))}
        </div>
        <p className="mi-child text-center text-stone-200/45 text-[10px] sm:text-xs mt-2">{e.note}</p>
      </div>

      <DetailModal
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        title={active?.label ?? ""}
        eyebrow={e.badge}
      >
        {active ? (
          <>
            <div className="text-amber-400 font-bold text-2xl">{active.value}</div>
            <p className="text-blue-100/85">{active.note}</p>
          </>
        ) : null}
      </DetailModal>
    </section>
  );
}
