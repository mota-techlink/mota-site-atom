"use client";
import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function DisplaySection() {
  const c = useContent();
  const d = c.display;
  return (
    <section id="s-display" className={`${SECTION} bg-d-bg2 relative`}>
      <DynamicBackground accent="amber" brightness={1.3} count={14} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-d-amber text-xs sm:text-sm font-medium mb-2">{d.badge}</span>
          <h2 className="mi-child text-d-fg font-bold mb-2">{d.title}</h2>
          <p className="mi-child text-d-fg/50 text-sm sm:text-base max-w-2xl mx-auto">{d.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {d.items.map((item: any, i: number) => (
            <div key={i} className="mi-child rounded-xl bg-d-amber-s/30 border border-d-amber/20 p-4 sm:p-5">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-d-fg font-semibold text-xs sm:text-sm mb-1">{item.title}</div>
              <div className="text-d-fg/55 text-[10px] sm:text-xs leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
