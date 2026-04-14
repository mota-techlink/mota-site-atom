"use client";

import React from "react";
import { useContent } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";

export function PartnerSection() {
  const c = useContent();
  const d = c.partner;

  return (
    <section id="s-partner" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{d.title}</h2>
        <p className="text-base text-white/40 mb-8 max-w-2xl">{d.subtitle}</p>

        {/* Dual-track comparison */}
        <h3 className="text-base font-semibold text-white/60 mb-3">{d.programsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {d.programs.map((p: any, i: number) => (
            <div key={i} className="rounded-xl bg-white/5 border border-white/8 p-4">
              <h4 className="text-sm font-bold text-white mb-2">{p.name}</h4>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-white/30">Target:</span> <span className="text-white/60">{p.target}</span></div>
                <div><span className="text-white/30">Flow:</span> <span className="text-white/50">{p.flow}</span></div>
                <div><span className="text-white/30">Tiers:</span> <span className="text-emerald-300/70 font-mono text-xs">{p.tiers}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* AI 7-stage */}
        <h3 className="text-base font-semibold text-white/60 mb-3">{d.aiTitle}</h3>
        <div className="space-y-2 mb-8">
          {d.aiStages.map((s: any, i: number) => (
            <div key={i} className="flex items-start gap-3 group">
              <div className="w-7 h-7 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-500/25 flex items-center justify-center text-xs font-bold text-fuchsia-300">
                {s.stage}
              </div>
              <div className="flex-1 pt-0.5">
                <span className="text-xs font-bold text-white">{s.label}</span>
                <span className="text-xs text-white/35 ml-2">{s.desc}</span>
              </div>
              {i < d.aiStages.length - 1 && (
                <div className="hidden" />
              )}
            </div>
          ))}
        </div>

        {/* Payments */}
        <h3 className="text-base font-semibold text-white/60 mb-3">{d.paymentTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {d.payments.map((p: any, i: number) => (
            <div key={i} className="rounded-xl bg-white/5 border border-white/8 p-4">
              <h4 className="text-sm font-bold text-white mb-1">
                {i === 0 ? "💳" : "₿"} {p.method}
              </h4>
              <p className="text-xs text-white/40 mb-1">{p.desc}</p>
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
