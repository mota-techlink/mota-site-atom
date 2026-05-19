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
    <section id="s-howworks" className={`${SECTION} bg-white dark:bg-[#1a0f0a] relative`}>
      <DynamicBackground accent="amber" brightness={1.2} count={10} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-amber-600/15 border border-amber-400/50 dark:border-amber-600/30 text-amber-300 text-xs sm:text-sm font-medium mb-2">{h.badge}</span>
          <h2 className="mi-child text-stone-900 dark:text-white font-bold mb-2">{h.title}</h2>
          <p className="mi-child text-stone-300/70 text-sm sm:text-base max-w-2xl mx-auto">{h.subtitle}</p>
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:flex items-start gap-0">
          {h.steps.map((step: any, i: number) => (
            <React.Fragment key={i}>
              {/* Step card */}
              <div className="mi-child flex-1 flex flex-col items-center text-center px-2">
                {/* Number bubble */}
                <div className="w-11 h-11 rounded-full bg-amber-500/20 border-2 border-amber-500/60 flex items-center justify-center text-amber-300 font-bold text-base mb-3 ring-4 ring-amber-500/10">
                  {step.step}
                </div>
                {/* Card body */}
                <div className="w-full rounded-xl bg-stone-100 dark:bg-stone-900/70 border border-amber-600/25 px-4 py-4">
                  <div className="text-stone-900 dark:text-white font-semibold text-sm mb-1.5">{step.title}</div>
                  <div className="text-stone-300/65 text-xs leading-relaxed">{step.desc}</div>
                </div>
              </div>
              {/* Connector arrow (between steps) */}
              {i < h.steps.length - 1 && (
                <div className="flex items-center justify-center pt-5 shrink-0 w-6">
                  <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="text-amber-600/50">
                    <path d="M0 6h16M12 1l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile: vertical list */}
        <div className="flex flex-col gap-3 md:hidden">
          {h.steps.map((step: any, i: number) => (
            <div
              key={i}
              onClick={() => setOpenIdx(i)}
              role="button"
              tabIndex={0}
              className="mi-child flex items-start gap-4 rounded-xl bg-stone-100 dark:bg-stone-900/60 border border-amber-600/25 p-4 cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 font-bold text-sm shrink-0">
                {step.step}
              </div>
              <div>
                <div className="text-stone-900 dark:text-white font-semibold text-sm mb-0.5">{step.title}</div>
                <div className="text-stone-200/60 text-xs leading-relaxed">{step.desc}</div>
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
