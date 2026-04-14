"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

export function BillingSection() {
  const c = useContent();
  const d = c.billing;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-billing" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-emerald-100 border border-emerald-400/30 text-emerald-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* Billing models */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.modelsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {d.models.map((m: any, i: number) => (
            <div key={i} className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 hover:border-emerald-500/25 transition-colors`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{m.icon}</span>
                <h4 className={`text-xl font-bold ${t.heading}`}>{m.name}</h4>
              </div>
              <p className={`text-base ${t.body} mb-2`}>{m.desc}</p>
              <p className={`text-base ${isDark ? "text-emerald-300/50" : "text-emerald-700"} font-mono`}>{m.formula}</p>
            </div>
          ))}
        </div>

        {/* Admin adjustments */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.adjustTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {d.adjustTypes.map((a: any, i: number) => (
            <div key={i} className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 flex items-start gap-3 hover:border-emerald-500/25 hover:bg-emerald-500/5 transition-all`}>
              <span className="text-2xl shrink-0">{a.icon}</span>
              <div>
                <div className={`text-base font-bold font-mono ${t.heading}`}>{a.type}</div>
                <p className={`text-base ${t.muted} mt-0.5`}>{a.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Crypto chains */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.cryptoTitle}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {d.cryptoChains.map((ch: any, i: number) => (
            <div key={i} className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 text-center hover:border-emerald-500/25 hover:bg-emerald-500/5 transition-all`}>
              <div className="text-3xl mb-2">{ch.icon}</div>
              <div className={`text-base font-bold ${t.heading}`}>{ch.chain}</div>
              <div className={`text-base ${t.muted} mt-1`}>{ch.token}</div>
              <div className={`text-base ${t.muted}`}>{ch.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
