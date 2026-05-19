"use client";
import React, { useState } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";
import { DetailModal, useIsMobile } from "./DetailModal";

export function ProblemSection() {
  const c = useContent();
  const p = c.problem;
  const isMobile = useIsMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? p.items[openIdx] : null;

  return (
    <section id="s-problem" className={`${SECTION} bg-violet-50 dark:bg-[#1a0f0a] relative`}>
      <DynamicBackground accent="rose" brightness={1.4} count={16} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-600/40 text-amber-400 text-xs sm:text-sm font-medium mb-2">
            {p.badge}
          </span>
          <h2 className="mi-child text-stone-900 dark:text-white font-bold mb-2 max-w-3xl mx-auto">{p.title}</h2>
          <p className="mi-child text-stone-600/70 dark:text-stone-300/70 text-sm sm:text-base max-w-2xl mx-auto">{p.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {p.items.map((item: any, i: number) => (
            <div
              key={i}
              onClick={isMobile ? () => setOpenIdx(i) : undefined}
              role={isMobile ? "button" : undefined}
              tabIndex={isMobile ? 0 : undefined}
              className={`mi-child flex gap-4 rounded-xl bg-violet-100/70 dark:bg-stone-900/60 border border-cyan-400/15 p-4 sm:p-5 ${isMobile ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
            >
              <div className="text-2xl sm:text-3xl shrink-0 mt-0.5">{item.icon}</div>
              <div>
                <div className="text-stone-900 dark:text-white font-semibold text-sm sm:text-base mb-1">{item.title}</div>
                <div className="text-stone-600/60 dark:text-stone-300/60 text-xs sm:text-sm leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DetailModal
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        title={active?.title ?? ""}
        icon={active?.icon}
        eyebrow={p.badge}
      >
        <p>{active?.desc}</p>
      </DetailModal>
    </section>
  );
}
