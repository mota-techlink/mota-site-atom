"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";

export function BillingSection() {
  const c = useContent();
  const d = c.billing;
  const t = useThemeTokens();

  return (
    <section id="s-billing" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className={`text-2xl sm:text-3xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-base ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* Billing models */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-3`}>{d.modelsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {d.models.map((m: any, i: number) => (
            <div key={i} className={`rounded-xl bg-gradient-to-br from-white/5 to-white/2 border ${t.cardBorder} p-4 hover:border-white/15 transition-colors`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{m.icon}</span>
                <h4 className={`text-sm font-bold ${t.heading}`}>{m.name}</h4>
              </div>
              <p className={`text-xs ${t.body} mb-2`}>{m.desc}</p>
              <p className="text-xs text-emerald-300/50 font-mono">{m.formula}</p>
            </div>
          ))}
        </div>

        {/* Admin adjustments */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-3`}>{d.adjustTitle}</h3>
        <div className={`rounded-xl ${t.cardBg} border ${t.cardBorder} overflow-hidden mb-8`}>
          <table className="w-full text-xs">
            <tbody>
              {d.adjustTypes.map((a: any, i: number) => (
                <tr key={i} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                  <td className={`px-4 py-2 ${t.body} font-medium`}>{a.type}</td>
                  <td className={`px-4 py-2 ${t.muted}`}>{a.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Crypto chains */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-3`}>{d.cryptoTitle}</h3>
        <div className="flex flex-wrap gap-2">
          {d.cryptoChains.map((ch: any, i: number) => (
            <div key={i} className={`px-3 py-2 rounded-lg ${t.cardBg} border ${t.cardBorder} text-center`}>
              <div className={`text-xs font-bold ${t.heading}`}>{ch.chain}</div>
              <div className={`text-xs ${t.muted}`}>{ch.token}</div>
              <div className={`text-xs ${t.muted}`}>{ch.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
