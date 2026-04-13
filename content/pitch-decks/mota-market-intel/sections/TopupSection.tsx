"use client";

import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

export function TopupSection() {
  const c = useContent();
  const t = c.topup;

  return (
    <section id="s-topup" className={`${SECTION} bg-zinc-950`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4">
          {t.badge}
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">{t.title}</h2>
        <p className="text-white/50 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          {t.subtitle}
        </p>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden border border-white/10">
          {/* Header */}
          <div className="grid grid-cols-3 bg-white/8 px-6 py-4 text-sm font-semibold text-white/50 uppercase tracking-wider">
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
                className={`mi-child grid grid-cols-3 px-6 py-5 border-t border-white/5 items-center transition-colors ${
                  isTop
                    ? "bg-indigo-950/40 border-indigo-500/20"
                    : "hover:bg-white/3"
                }`}
              >
                <div className="text-left">
                  <span
                    className={`font-bold ${
                      isTop ? "text-indigo-400 text-lg" : "text-white"
                    }`}
                  >
                    {tier.amount}
                  </span>
                  {isTop && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      Best
                    </span>
                  )}
                </div>
                <div
                  className={`text-center font-medium ${
                    isTop ? "text-indigo-300" : "text-white/70"
                  }`}
                >
                  {tier.discount}
                </div>
                <div
                  className={`text-right font-mono text-sm ${
                    isTop ? "text-white font-bold" : "text-white/60"
                  }`}
                >
                  {tier.rate}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-white/30 text-sm mt-6">{t.note}</p>
      </div>
    </section>
  );
}
