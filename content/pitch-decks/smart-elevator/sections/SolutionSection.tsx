"use client";
import React, { useState } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";
import { DetailModal, useIsMobile } from "./DetailModal";

export function SolutionSection() {
  const c = useContent();
  const s = c.solution;
  const isMobile = useIsMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? s.items[openIdx] : null;

  return (
    <section id="s-solution" className={`${SECTION} bg-white dark:bg-[#1a0f0a] relative`}>
      <DynamicBackground accent="indigo" brightness={1.3} count={14} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-amber-600/15 border border-amber-400/50 dark:border-amber-600/30 text-amber-300 text-xs sm:text-sm font-medium mb-2">
            {s.badge}
          </span>
          <h2 className="mi-child text-stone-900 dark:text-white font-bold mb-2">{s.title}</h2>
          <p className="mi-child text-stone-300/70 text-sm sm:text-base max-w-2xl mx-auto">{s.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {s.items.map((item: any, i: number) => (
            <div
              key={i}
              onClick={isMobile ? () => setOpenIdx(i) : undefined}
              role={isMobile ? "button" : undefined}
              tabIndex={isMobile ? 0 : undefined}
              className={`mi-child rounded-xl bg-stone-100 dark:bg-[#1a0f0a]/60 border border-indigo-300/40 dark:border-indigo-400/25 p-5 sm:p-6 relative overflow-hidden ${isMobile ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="text-2xl mb-3">{item.icon}</div>
              <div className="text-stone-900 dark:text-white font-semibold text-sm sm:text-base mb-1.5">{item.title}</div>
              <div className="text-stone-200/65 text-xs sm:text-sm leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <DetailModal
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        title={active?.title ?? ""}
        icon={active?.icon}
        eyebrow={s.badge}
      >
        <p>{active?.desc}</p>
      </DetailModal>
    </section>
  );
}
