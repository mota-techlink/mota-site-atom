"use client";
import React, { useState } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";
import { DetailModal, useIsMobile } from "./DetailModal";

export function PricingSection() {
  const c = useContent();
  const p = (c as any).pricing;
  const isMobile = useIsMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? p.cards[openIdx] : null;

  return (
    <section id="s-pricing" className={`${SECTION} bg-violet-50 dark:bg-[#1a0f0a] relative`}>
      <DynamicBackground accent="indigo" brightness={1.3} count={14} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-600/40 text-indigo-400 text-xs sm:text-sm font-medium mb-2">{p.badge}</span>
          <h2 className="mi-child text-stone-900 dark:text-white font-bold mb-2">{p.title}</h2>
          <p className="mi-child text-stone-600/70 dark:text-stone-300/70 text-sm sm:text-base max-w-2xl mx-auto">{p.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {p.cards.map((card: any, i: number) => (
            <div
              key={i}
              onClick={isMobile ? () => setOpenIdx(i) : undefined}
              role={isMobile ? "button" : undefined}
              tabIndex={isMobile ? 0 : undefined}
              className={`mi-child rounded-xl bg-violet-100/70 dark:bg-stone-900/60 border border-indigo-400/40 dark:border-indigo-400/25 p-5 sm:p-6 flex flex-col ${isMobile ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{card.icon}</span>
                <div className="text-stone-900 dark:text-white font-bold text-sm sm:text-base">{card.category}</div>
              </div>
              <ul className="space-y-2 flex-1">
                {card.items.map((li: string, j: number) => (
                  <li key={j} className="flex items-start gap-2 text-stone-600/70 dark:text-stone-300/70 text-xs sm:text-sm">
                    <span className="text-indigo-400 mt-0.5 shrink-0">·</span>{li}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-t border-indigo-400/20 dark:border-indigo-400/15 text-right">
                <span className="text-indigo-500 dark:text-indigo-300 font-semibold text-sm sm:text-base">{card.range}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mi-child text-center text-stone-600/60 dark:text-stone-300/60 text-xs sm:text-sm px-4">{p.note}</p>
      </div>

      <DetailModal
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        title={active?.category ?? ""}
        icon={active?.icon}
        eyebrow={p.badge}
      >
        <ul className="space-y-2">
          {active?.items.map((li: string, j: number) => (
            <li key={j} className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5 shrink-0">·</span>
              <span>{li}</span>
            </li>
          ))}
        </ul>
        {active?.range && (
          <div className="mt-4 pt-3 border-t border-indigo-400/20 text-right">
            <span className="text-indigo-300 font-semibold">{active.range}</span>
          </div>
        )}
      </DetailModal>
    </section>
  );
}
