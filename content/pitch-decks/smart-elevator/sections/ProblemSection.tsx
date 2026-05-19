"use client";
import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function ProblemSection() {
  const c = useContent();
  const p = c.problem;

  return (
    <section id="s-problem" className={`${SECTION} bg-d-bg2 relative`}>
      <DynamicBackground accent="rose" brightness={1.4} count={16} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-d-rose text-xs sm:text-sm font-medium mb-2">
            {p.badge}
          </span>
          <h2 className="mi-child text-d-fg font-bold mb-2 max-w-3xl mx-auto">{p.title}</h2>
          <p className="mi-child text-d-fg/50 text-sm sm:text-base max-w-2xl mx-auto">{p.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {p.items.map((item: any, i: number) => (
            <div key={i} className="mi-child flex gap-4 rounded-xl bg-d-fg/5 border border-rose-500/10 p-4 sm:p-5">
              <div className="text-2xl sm:text-3xl shrink-0 mt-0.5">{item.icon}</div>
              <div>
                <div className="text-d-fg font-semibold text-sm sm:text-base mb-1">{item.title}</div>
                <div className="text-d-fg/50 text-xs sm:text-sm leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
