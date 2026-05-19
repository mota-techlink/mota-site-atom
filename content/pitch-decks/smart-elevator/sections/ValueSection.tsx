"use client";
import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function ValueSection() {
  const c = useContent();
  const v = c.value;
  return (
    <section id="s-value" className={`${SECTION} bg-d-bg2 relative`}>
      <DynamicBackground accent="indigo" brightness={1.3} count={14} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-d-indigo text-xs sm:text-sm font-medium mb-2">{v.badge}</span>
          <h2 className="mi-child text-d-fg font-bold mb-2">{v.title}</h2>
          <p className="mi-child text-d-fg/50 text-sm sm:text-base max-w-2xl mx-auto">{v.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {v.items.map((item: any, i: number) => (
            <div key={i} className="mi-child rounded-xl bg-d-indigo-s/40 border border-d-indigo/20 p-5 sm:p-6">
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="text-d-fg font-bold text-sm sm:text-base mb-3">{item.title}</div>
              <ul className="space-y-1.5">
                {item.items.map((li: string, j: number) => (
                  <li key={j} className="flex items-start gap-2 text-d-fg/60 text-xs sm:text-sm">
                    <span className="text-d-indigo mt-0.5 shrink-0">✓</span>{li}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
