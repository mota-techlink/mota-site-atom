"use client";
import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function AccessControlSection() {
  const c = useContent();
  const a = c.access_control;
  return (
    <section id="s-access-control" className={`${SECTION} bg-d-bg relative`}>
      <DynamicBackground accent="indigo" brightness={1.4} count={16} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-d-indigo text-xs sm:text-sm font-medium mb-2">{a.badge}</span>
          <h2 className="mi-child text-d-fg font-bold mb-2">{a.title}</h2>
          <p className="mi-child text-d-fg/50 text-sm sm:text-base max-w-2xl mx-auto">{a.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {a.steps.map((step: any, i: number) => (
            <div key={i} className="mi-child relative rounded-xl bg-d-indigo-s/40 border border-d-indigo/20 p-4 text-center">
              {i < a.steps.length - 1 && (
                <div className="hidden sm:block absolute top-1/2 -right-4 text-d-indigo/40 text-lg z-10">→</div>
              )}
              <div className="text-d-indigo font-bold text-lg sm:text-xl mb-1">{step.step}</div>
              <div className="text-d-fg font-semibold text-xs sm:text-sm mb-1">{step.title}</div>
              <div className="text-d-fg/50 text-[10px] sm:text-xs leading-snug">{step.desc}</div>
            </div>
          ))}
        </div>
        <p className="mi-child text-center text-d-fg/40 text-xs sm:text-sm mt-2 px-2">{a.note}</p>
      </div>
    </section>
  );
}
