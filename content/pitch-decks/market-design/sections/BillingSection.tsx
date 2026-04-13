"use client";

import React from "react";
import { useContent } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";

export function BillingSection() {
  const c = useContent();
  const d = c.billing;

  return (
    <section id="s-billing" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{d.title}</h2>
        <p className="text-sm text-white/40 mb-8 max-w-2xl">{d.subtitle}</p>

        {/* Billing models */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.modelsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {d.models.map((m: any, i: number) => (
            <div key={i} className="rounded-xl bg-gradient-to-br from-white/5 to-white/2 border border-white/8 p-4 hover:border-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{m.icon}</span>
                <h4 className="text-sm font-bold text-white">{m.name}</h4>
              </div>
              <p className="text-[11px] text-white/40 mb-2">{m.desc}</p>
              <p className="text-[10px] text-emerald-300/50 font-mono">{m.formula}</p>
            </div>
          ))}
        </div>

        {/* Admin adjustments */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.adjustTitle}</h3>
        <div className="rounded-xl bg-white/5 border border-white/8 overflow-hidden mb-8">
          <table className="w-full text-xs">
            <tbody>
              {d.adjustTypes.map((a: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-2 text-white/60 font-medium">{a.type}</td>
                  <td className="px-4 py-2 text-white/35">{a.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Crypto chains */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.cryptoTitle}</h3>
        <div className="flex flex-wrap gap-2">
          {d.cryptoChains.map((ch: any, i: number) => (
            <div key={i} className="px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-center">
              <div className="text-[11px] font-bold text-white">{ch.chain}</div>
              <div className="text-[10px] text-white/30">{ch.token}</div>
              <div className="text-[9px] text-white/20">{ch.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
