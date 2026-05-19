"use client";
import React, { useState } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";
import { DetailModal, useIsMobile } from "./DetailModal";

export function AccessControlSection() {
  const c = useContent();
  const a = c.access_control;
  const isMobile = useIsMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? a.steps[openIdx] : null;

  return (
    <section id="s-access-control" className={`${SECTION} bg-[#1a0f0a] relative`}>
      <DynamicBackground accent="indigo" brightness={1.4} count={16} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-amber-600/15 border border-amber-600/30 text-amber-300 text-xs sm:text-sm font-medium mb-2">{a.badge}</span>
          <h2 className="mi-child text-white font-bold mb-2">{a.title}</h2>
          <p className="mi-child text-stone-300/70 text-sm sm:text-base max-w-2xl mx-auto">{a.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {a.steps.map((step: any, i: number) => (
            <div
              key={i}
              onClick={isMobile ? () => setOpenIdx(i) : undefined}
              role={isMobile ? "button" : undefined}
              tabIndex={isMobile ? 0 : undefined}
              className={`mi-child relative rounded-xl bg-[#1a0f0a]/60 border border-indigo-400/25 p-4 text-center ${isMobile ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
            >
              {i < a.steps.length - 1 && (
                <div className="hidden sm:block absolute top-1/2 -right-4 text-amber-300/50 text-lg z-10">→</div>
              )}
              <div className="text-amber-400 font-bold text-lg sm:text-xl mb-1">{step.step}</div>
              <div className="text-white font-semibold text-xs sm:text-sm mb-1">{step.title}</div>
              <div className="text-stone-300/60 text-[10px] sm:text-xs leading-snug">{step.desc}</div>
            </div>
          ))}
        </div>
        <p className="mi-child text-center text-stone-200/50 text-xs sm:text-sm mt-2 px-2">{a.note}</p>
      </div>

      <DetailModal
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        title={active?.title ?? ""}
        eyebrow={active ? `${a.badge} · ${active.step}` : a.badge}
      >
        <p>{active?.desc}</p>
      </DetailModal>
    </section>
  );
}
