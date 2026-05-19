"use client";
import React, { useState } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";
import { DetailModal, useIsMobile } from "./DetailModal";

export function DisplaySection() {
  const c = useContent();
  const d = c.display;
  const isMobile = useIsMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? d.items[openIdx] : null;

  return (
    <section id="s-display" className={`${SECTION} bg-[#1a0f0a] relative`}>
      <DynamicBackground accent="amber" brightness={1.3} count={14} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-amber-500/15 border border-amber-600/40 text-amber-400 text-xs sm:text-sm font-medium mb-2">{d.badge}</span>
          <h2 className="mi-child text-white font-bold mb-2">{d.title}</h2>
          <p className="mi-child text-stone-300/70 text-sm sm:text-base max-w-2xl mx-auto">{d.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {d.items.map((item: any, i: number) => (
            <div
              key={i}
              onClick={isMobile ? () => setOpenIdx(i) : undefined}
              role={isMobile ? "button" : undefined}
              tabIndex={isMobile ? 0 : undefined}
              className={`mi-child rounded-xl bg-stone-900/60 border border-amber-600/30 p-4 sm:p-5 ${isMobile ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-white font-semibold text-xs sm:text-sm mb-1">{item.title}</div>
              <div className="text-stone-300/60 text-[10px] sm:text-xs leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <DetailModal
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        title={active?.title ?? ""}
        icon={active?.icon}
        eyebrow={d.badge}
      >
        <p>{active?.desc}</p>
      </DetailModal>
    </section>
  );
}
