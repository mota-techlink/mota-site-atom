"use client";
import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function HowWorksSection() {
  const c = useContent();
  const h = c.howworks;
  return (
    <section id="s-howworks" className={`${SECTION} bg-d-bg relative`}>
      <DynamicBackground accent="indigo" brightness={1.3} count={12} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-d-indigo text-xs sm:text-sm font-medium mb-2">{h.badge}</span>
          <h2 className="mi-child text-d-fg font-bold mb-2">{h.title}</h2>
          <p className="mi-child text-d-fg/50 text-sm sm:text-base max-w-2xl mx-auto">{h.subtitle}</p>
        </div>
        <div className="space-y-3">
          {h.steps.map((step: any, i: number) => (
            <div key={i} className="mi-child flex items-start gap-4 rounded-xl bg-d-fg/5 border border-d-indigo/15 p-4 sm:p-5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-500/20 border border-d-indigo/30 flex items-center justify-center text-d-indigo font-bold text-sm shrink-0">
                {step.step}
              </div>
              <div>
                <div className="text-d-fg font-semibold text-sm sm:text-base mb-0.5">{step.title}</div>
                <div className="text-d-fg/55 text-xs sm:text-sm leading-relaxed">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
