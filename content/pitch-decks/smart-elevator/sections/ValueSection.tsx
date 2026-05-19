"use client";
import React, { useState } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";
import { DetailModal, useIsMobile } from "./DetailModal";

export function ValueSection() {
  const c = useContent();
  const v = c.value;
  const isMobile = useIsMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? v.items[openIdx] : null;

  return (
    <section id="s-value" className={`${SECTION} bg-violet-50 dark:bg-[#1a0f0a] relative`}>
      <DynamicBackground accent="indigo" brightness={1.3} count={14} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-amber-600/15 border border-amber-400/50 dark:border-amber-600/30 text-amber-300 text-xs sm:text-sm font-medium mb-2">{v.badge}</span>
          <h2 className="mi-child text-stone-900 dark:text-white font-bold mb-2">{v.title}</h2>
          <p className="mi-child text-stone-600/70 dark:text-stone-300/70 text-sm sm:text-base max-w-2xl mx-auto">{v.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {v.items.map((item: any, i: number) => (
            <div
              key={i}
              onClick={isMobile ? () => setOpenIdx(i) : undefined}
              role={isMobile ? "button" : undefined}
              tabIndex={isMobile ? 0 : undefined}
              className={`mi-child rounded-xl bg-violet-100/70 dark:bg-[#1a0f0a]/60 border border-indigo-300/40 dark:border-indigo-400/25 p-5 sm:p-6 ${isMobile ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="text-stone-900 dark:text-white font-bold text-sm sm:text-base mb-3">{item.title}</div>
              <ul className="space-y-1.5">
                {item.items.map((li: string, j: number) => (
                  <li key={j} className="flex items-start gap-2 text-stone-600/70 dark:text-stone-300/70 text-xs sm:text-sm">
                    <span className="text-amber-400 mt-0.5 shrink-0">✓</span>{li}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <DetailModal
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        title={active?.title ?? ""}
        icon={active?.icon}
        eyebrow={v.badge}
      >
        <ul className="space-y-2">
          {active?.items.map((li: string, j: number) => (
            <li key={j} className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5 shrink-0">✓</span>
              <span>{li}</span>
            </li>
          ))}
        </ul>
      </DetailModal>
    </section>
  );
}
