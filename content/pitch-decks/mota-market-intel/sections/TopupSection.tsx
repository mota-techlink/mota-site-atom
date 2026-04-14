"use client";

import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function TopupSection() {
  const c = useContent();
  const t = c.topup;

  return (
    <section id="s-topup" className={`${SECTION} bg-d-bg2 relative`}>
      <DynamicBackground accent="violet" brightness={1.4} count={16} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="inline-block px-3 py-1 sm:px-4 rounded-full bg-violet-500/10 border border-violet-500/20 text-d-violet text-xs sm:text-sm font-medium mb-3 sm:mb-4">
          {t.badge}
        </span>
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-d-fg mb-1 sm:mb-2">{t.title}</h2>
        <p className="text-d-fg/50 text-sm sm:text-lg max-w-xl mx-auto mb-3 sm:mb-5 lg:mb-8 leading-relaxed">
          {t.subtitle}
        </p>

        {/* Table */}
        <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-d-fg/10">
          {/* Header */}
          <div className="grid grid-cols-3 bg-d-fg/8 px-3 py-2 sm:px-6 sm:py-4 text-[10px] sm:text-sm font-semibold text-d-fg/50 uppercase tracking-wider">
            {t.tableHeaders.map((h, i) => (
              <div
                key={i}
                className={i === 0 ? "text-left" : i === 1 ? "text-center" : "text-right"}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Rows */}
          {t.tiers.map((tier, i) => {
            const isTop = i === t.tiers.length - 1;
            return (
              <div
                key={i}
                className={`mi-child grid grid-cols-3 px-3 py-3 sm:px-6 sm:py-5 border-t border-d-fg/5 items-center transition-colors ${
                  isTop
                    ? "bg-d-indigo-s/40 border-d-indigo/20"
                    : "hover:bg-d-fg/3"
                }`}
              >
                <div className="text-left">
                  <span
                    className={`font-bold text-xs sm:text-base ${
                      isTop ? "text-d-indigo sm:text-lg" : "text-d-fg"
                    }`}
                  >
                    {tier.amount}
                  </span>
                  {isTop && (
                    <span className="ml-1 sm:ml-2 text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-500/20 text-d-indigo border border-d-indigo/30">
                      Best
                    </span>
                  )}
                </div>
                <div
                  className={`text-center font-medium text-xs sm:text-base ${
                    isTop ? "text-d-indigo/75" : "text-d-fg/70"
                  }`}
                >
                  {tier.discount}
                </div>
                <div
                  className={`text-right font-mono text-[10px] sm:text-sm ${
                    isTop ? "text-d-fg font-bold" : "text-d-fg/60"
                  }`}
                >
                  {tier.rate}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-d-fg/30 text-xs sm:text-sm mt-2 sm:mt-4 lg:mt-6">{t.note}</p>
      </div>
    </section>
  );
}
