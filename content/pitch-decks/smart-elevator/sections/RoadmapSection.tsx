"use client";
import React, { useState } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";
import { DetailModal, useIsMobile } from "./DetailModal";

export function RoadmapSection() {
  const c = useContent();
  const r = c.roadmap;
  const isMobile = useIsMobile();
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? r.items[openIdx] : null;

  return (
    <section id="s-roadmap" className={`${SECTION} bg-slate-950 relative`}>
      <DynamicBackground accent="indigo" brightness={1.2} count={12} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs sm:text-sm font-medium mb-2">{r.badge}</span>
          <h2 className="mi-child text-white font-bold mb-2">{r.title}</h2>
        </div>
        <div className="space-y-3">
          {r.items.map((item: any, i: number) => (
            <div
              key={i}
              onClick={isMobile ? () => setOpenIdx(i) : undefined}
              role={isMobile ? "button" : undefined}
              tabIndex={isMobile ? 0 : undefined}
              className={`mi-child flex items-start gap-4 rounded-xl bg-slate-900/60 border border-indigo-400/20 p-4 sm:p-5 ${isMobile ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
            >
              <div className="min-w-[4rem] text-cyan-300 font-bold text-xs sm:text-sm shrink-0 pt-0.5">{item.week}</div>
              <div>
                <div className="text-white font-semibold text-sm sm:text-base mb-0.5">{item.title}</div>
                <div className="text-blue-200/65 text-xs sm:text-sm">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DetailModal
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        title={active?.title ?? ""}
        eyebrow={active ? `${r.badge} · ${active.week}` : r.badge}
      >
        <p>{active?.desc}</p>
      </DetailModal>
    </section>
  );
}
