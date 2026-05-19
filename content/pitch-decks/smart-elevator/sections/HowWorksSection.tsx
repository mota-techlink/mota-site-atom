"use client";
import React, { useState } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";
import { DetailModal, useIsMobile } from "./DetailModal";

export function HowWorksSection() {
  const c = useContent();
  const h = c.howworks;
  const isMobile = useIsMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? h.steps[openIdx] : null;

  return (
    <section id="s-howworks" className={`${SECTION} bg-blue-950 relative`}>
      <DynamicBackground accent="indigo" brightness={1.3} count={12} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-medium mb-2">{h.badge}</span>
          <h2 className="mi-child text-white font-bold mb-2">{h.title}</h2>
          <p className="mi-child text-blue-200/70 text-sm sm:text-base max-w-2xl mx-auto">{h.subtitle}</p>
        </div>
        <div className="space-y-3">
          {h.steps.map((step: any, i: number) => (
            <div
              key={i}
              onClick={isMobile ? () => setOpenIdx(i) : undefined}
              role={isMobile ? "button" : undefined}
              tabIndex={isMobile ? 0 : undefined}
              className={`mi-child flex items-start gap-4 rounded-xl bg-slate-900/60 border border-indigo-400/20 p-4 sm:p-5 ${isMobile ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-500/25 border border-indigo-400/40 flex items-center justify-center text-indigo-200 font-bold text-sm shrink-0">
                {step.step}
              </div>
              <div>
                <div className="text-white font-semibold text-sm sm:text-base mb-0.5">{step.title}</div>
                <div className="text-blue-200/65 text-xs sm:text-sm leading-relaxed">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DetailModal
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        title={active?.title ?? ""}
        eyebrow={active ? `${h.badge} · Step ${active.step}` : h.badge}
      >
        <p>{active?.desc}</p>
      </DetailModal>
    </section>
  );
}
