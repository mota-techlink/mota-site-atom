"use client";
import React, { useState } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";
import { DetailModal, useIsMobile } from "./DetailModal";

export function FeaturesSection() {
  const c = useContent();
  const f = c.features;
  const isMobile = useIsMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? f.items[openIdx] : null;

  return (
    <section id="s-features" className={`${SECTION} bg-violet-50 dark:bg-[#1a0f0a] relative`}>
      <DynamicBackground accent="emerald" brightness={1.3} count={14} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-600/40 text-amber-400 text-xs sm:text-sm font-medium mb-2">{f.badge}</span>
          <h2 className="mi-child text-stone-900 dark:text-white font-bold mb-2">{f.title}</h2>
          <p className="mi-child text-stone-600/70 dark:text-stone-300/70 text-sm sm:text-base max-w-2xl mx-auto">{f.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {f.items.map((item: any, i: number) => (
            <div
              key={i}
              onClick={isMobile ? () => setOpenIdx(i) : undefined}
              role={isMobile ? "button" : undefined}
              tabIndex={isMobile ? 0 : undefined}
              className={`mi-child flex gap-4 rounded-xl bg-violet-100/70 dark:bg-stone-900/60 border border-cyan-400/15 p-5 ${isMobile ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
            >
              <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-600/40 flex items-center justify-center text-lg shrink-0">{item.icon}</div>
              <div>
                <div className="text-stone-900 dark:text-white font-semibold text-sm sm:text-base mb-1">{item.title}</div>
                <div className="text-stone-600 dark:text-stone-200/65 text-xs sm:text-sm leading-relaxed">{item.desc}</div>
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
        eyebrow={f.badge}
      >
        <p>{active?.desc}</p>
      </DetailModal>
    </section>
  );
}
