"use client";
import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function SolutionSection() {
  const c = useContent();
  const s = c.solution;

  return (
    <section id="s-solution" className={`${SECTION} bg-d-bg relative`}>
      <DynamicBackground accent="indigo" brightness={1.3} count={14} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-d-indigo text-xs sm:text-sm font-medium mb-2">
            {s.badge}
          </span>
          <h2 className="mi-child text-d-fg font-bold mb-2">{s.title}</h2>
          <p className="mi-child text-d-fg/50 text-sm sm:text-base max-w-2xl mx-auto">{s.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {s.items.map((item: any, i: number) => (
            <div key={i} className="mi-child rounded-xl bg-d-indigo-s/40 border border-d-indigo/20 p-5 sm:p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="text-2xl mb-3">{item.icon}</div>
              <div className="text-d-fg font-semibold text-sm sm:text-base mb-1.5">{item.title}</div>
              <div className="text-d-fg/55 text-xs sm:text-sm leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
