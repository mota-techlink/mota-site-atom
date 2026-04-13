"use client";

import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

export function HowItWorksSection() {
  const c = useContent();
  const h = c.howitworks;

  const gradients = [
    "from-indigo-500 to-indigo-600",
    "from-violet-500 to-violet-600",
    "from-pink-500 to-pink-600",
    "from-emerald-500 to-emerald-600",
    "from-amber-500 to-amber-600",
  ];

  return (
    <section id="s-howitworks" className={`${SECTION} bg-black`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
            {h.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">{h.title}</h2>
        </div>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-8 top-10 bottom-10 w-px bg-linear-to-b from-indigo-500/50 via-violet-500/50 to-pink-500/50 hidden sm:block" />

          <div className="space-y-12">
            {h.steps.map((step, i) => (
              <div key={i} className="mi-child relative flex gap-8 items-start">
                {/* Step number bubble */}
                <div
                  className={`shrink-0 w-16 h-16 rounded-2xl bg-linear-to-br ${gradients[i]} flex items-center justify-center text-white font-mono font-bold text-lg shadow-lg z-10`}
                >
                  {step.number}
                </div>

                {/* Content */}
                <div className="pt-3 pb-2">
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed max-w-xl">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
