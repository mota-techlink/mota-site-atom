"use client";

import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

export function EarlyBirdSection() {
  const c = useContent();
  const e = c.earlybird;

  return (
    <section id="s-earlybird" className={`${SECTION} bg-black relative`}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4">
            {e.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{e.title}</h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            {e.subtitle}
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {e.benefits.map((b, i) => (
            <div
              key={i}
              className="mi-child rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/30 hover:bg-violet-950/20 p-5 transition-all duration-200"
            >
              <div className="text-2xl mb-3">{b.icon}</div>
              <h3 className="text-white font-bold text-lg mb-1">{b.title}</h3>
              <p className="text-white/50 leading-relaxed text-sm">{b.description}</p>
            </div>
          ))}
        </div>

        {/* Urgency banner */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 px-8 py-5 text-center">
          <p className="text-amber-300 font-medium">{e.urgency}</p>
        </div>
      </div>
    </section>
  );
}
