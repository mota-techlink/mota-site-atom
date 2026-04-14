"use client";

import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function ProblemSection() {
  const c = useContent();
  const p = c.problem;
  // items are now { icon, text } objects
  const tradItems = p.comparison.traditional.items as any[];
  const motaItems = p.comparison.mota.items as any[];

  return (
    <section id="s-problem" className={`${SECTION} bg-d-bg2 relative`}>
      <DynamicBackground accent="rose" brightness={1.6} count={20} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-3 sm:mb-5 lg:mb-8">
          <span className="inline-block px-3 py-1 sm:px-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-d-rose text-xs sm:text-sm font-medium mb-2 sm:mb-3">
            {p.badge}
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-d-fg mb-1 sm:mb-2 max-w-3xl mx-auto">
            {p.title}
          </h2>
          <p className="text-xs sm:text-base lg:text-lg text-d-fg/50 max-w-2xl mx-auto leading-relaxed">
            {p.subtitle}
          </p>
        </div>

        {/* Comparison — icon block cards */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-6">
          {/* Traditional */}
          <div className="mi-child rounded-xl sm:rounded-2xl bg-d-fg/5 border border-d-fg/10 p-3 sm:p-5 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-rose-500/20 border border-d-rose/30 flex items-center justify-center text-d-rose text-xs sm:text-sm">
                ✕
              </div>
              <h3 className="text-d-fg font-semibold text-xs sm:text-base lg:text-lg">
                {p.comparison.traditional.label}
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
              {tradItems.map((item: any, i: number) => {
                const icon = typeof item === "object" ? item.icon : null;
                const text = typeof item === "object" ? item.text : item;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 sm:gap-3 rounded-lg bg-rose-500/5 border border-d-rose/10 px-2.5 py-1.5 sm:px-3 sm:py-2"
                  >
                    {icon && <span className="text-sm sm:text-lg shrink-0">{icon}</span>}
                    <span className="text-d-fg/55 text-[10px] sm:text-sm leading-snug">{text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mota */}
          <div className="mi-child rounded-xl sm:rounded-2xl bg-d-indigo-s/60 border border-d-indigo/30 p-3 sm:p-5 lg:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 relative z-10">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-500/20 border border-d-indigo/40 flex items-center justify-center text-d-indigo text-xs sm:text-sm">
                ✓
              </div>
              <h3 className="text-d-fg font-semibold text-xs sm:text-base lg:text-lg">
                {p.comparison.mota.label}
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-1.5 sm:gap-2 relative z-10">
              {motaItems.map((item: any, i: number) => {
                const icon = typeof item === "object" ? item.icon : null;
                const text = typeof item === "object" ? item.text : item;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 sm:gap-3 rounded-lg bg-indigo-500/5 border border-d-indigo/10 px-2.5 py-1.5 sm:px-3 sm:py-2"
                  >
                    {icon && <span className="text-sm sm:text-lg shrink-0">{icon}</span>}
                    <span className="text-d-fg/75 text-[10px] sm:text-sm leading-snug">{text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
