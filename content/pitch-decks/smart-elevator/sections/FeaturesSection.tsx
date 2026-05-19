"use client";
import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function FeaturesSection() {
  const c = useContent();
  const f = c.features;
  return (
    <section id="s-features" className={`${SECTION} bg-d-bg2 relative`}>
      <DynamicBackground accent="emerald" brightness={1.3} count={14} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium mb-2">{f.badge}</span>
          <h2 className="mi-child text-d-fg font-bold mb-2">{f.title}</h2>
          <p className="mi-child text-d-fg/50 text-sm sm:text-base max-w-2xl mx-auto">{f.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {f.items.map((item: any, i: number) => (
            <div key={i} className="mi-child flex gap-4 rounded-xl bg-d-fg/5 border border-emerald-500/10 p-5">
              <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-lg shrink-0">{item.icon}</div>
              <div>
                <div className="text-d-fg font-semibold text-sm sm:text-base mb-1">{item.title}</div>
                <div className="text-d-fg/55 text-xs sm:text-sm leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
