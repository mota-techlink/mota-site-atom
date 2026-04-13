"use client";

import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

export function ProblemSection() {
  const c = useContent();
  const p = c.problem;

  return (
    <section id="s-problem" className={`${SECTION} bg-zinc-950`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-medium mb-5">
            {p.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 max-w-3xl mx-auto">
            {p.title}
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            {p.subtitle}
          </p>
        </div>

        {/* Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Traditional */}
          <div className="mi-child rounded-2xl bg-white/5 border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 text-sm">
                ✕
              </div>
              <h3 className="text-white font-semibold text-lg">
                {p.comparison.traditional.label}
              </h3>
            </div>
            <ul className="space-y-4">
              {p.comparison.traditional.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/50">
                  <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500/50" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mota */}
          <div className="mi-child rounded-2xl bg-indigo-950/60 border border-indigo-500/30 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none" />
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-sm">
                ✓
              </div>
              <h3 className="text-white font-semibold text-lg">
                {p.comparison.mota.label}
              </h3>
            </div>
            <ul className="space-y-4 relative z-10">
              {p.comparison.mota.items.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white/80">
                  <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
