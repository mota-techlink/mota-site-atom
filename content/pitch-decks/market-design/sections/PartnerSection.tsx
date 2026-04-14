"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";

export function PartnerSection() {
  const c = useContent();
  const d = c.partner;
  const t = useThemeTokens();

  return (
    <section id="s-partner" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className={`text-2xl sm:text-3xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-base ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* Dual-track comparison */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-3`}>{d.programsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {d.programs.map((p: any, i: number) => (
            <div key={i} className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4`}>
              <h4 className={`text-sm font-bold ${t.heading} mb-2`}>{p.name}</h4>
              <div className="space-y-1.5 text-xs">
                <div><span className={t.muted}>Target:</span> <span className={t.body}>{p.target}</span></div>
                <div><span className={t.muted}>Flow:</span> <span className={t.body}>{p.flow}</span></div>
                <div><span className={t.muted}>Tiers:</span> <span className="text-emerald-300/70 font-mono text-xs">{p.tiers}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* AI 7-stage — 2-row pipeline grid */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-3`}>{d.aiTitle}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {d.aiStages.map((s: any, i: number) => (
            <div key={i} className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-3 text-center hover:border-fuchsia-500/30 hover:bg-fuchsia-500/5 transition-all duration-200`}>
              <div className="w-7 h-7 mx-auto rounded-full bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-500/25 flex items-center justify-center text-xs font-bold text-fuchsia-300 mb-1.5">
                {s.stage}
              </div>
              <div className={`text-xs font-bold ${t.heading} mb-0.5`}>{s.label}</div>
              <div className={`text-xs ${t.body} leading-relaxed`}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Payments */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-3`}>{d.paymentTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {d.payments.map((p: any, i: number) => (
            <div key={i} className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4`}>
              <h4 className={`text-sm font-bold ${t.heading} mb-1`}>
                {i === 0 ? "💳" : "₿"} {p.method}
              </h4>
              <p className={`text-xs ${t.body} mb-1`}>{p.desc}</p>
              {p.chains && (
                <p className="text-xs text-cyan-300/50 font-mono">{p.chains}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
