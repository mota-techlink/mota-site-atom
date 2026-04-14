"use client";

import React from "react";
import { useContent } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";

export function EdgeFunctionsSection() {
  const c = useContent();
  const d = c.edge;

  return (
    <section id="s-edge" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{d.title}</h2>
        <p className="text-base text-white/40 mb-8 max-w-2xl">{d.subtitle}</p>

        {/* Edge functions table */}
        <h3 className="text-base font-semibold text-white/60 mb-3">{d.functionsTitle}</h3>
        <div className="rounded-xl bg-white/5 border border-white/8 overflow-hidden mb-8">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8 text-white/30">
                <th className="text-left px-4 py-2.5 font-medium">#</th>
                <th className="text-left px-4 py-2.5 font-medium">Function</th>
                <th className="text-left px-4 py-2.5 font-medium">Trigger</th>
                <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {d.functions.map((f: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-2 text-white/20 font-mono text-xs">{i + 1}</td>
                  <td className="px-4 py-2 text-orange-300/70 font-mono text-xs whitespace-nowrap">{f.name}</td>
                  <td className="px-4 py-2 text-white/40 text-xs">{f.trigger}</td>
                  <td className="px-4 py-2 text-white/30 hidden sm:table-cell">{f.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RLS policy matrix */}
        <h3 className="text-base font-semibold text-white/60 mb-3">{d.rlsTitle}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
          {d.rlsGroups.map((p: any, i: number) => (
            <div key={i} className="rounded-lg bg-white/5 border border-white/8 p-3">
              <h4 className="text-sm font-bold text-white mb-1">{p.scope}</h4>
              <p className="text-xs text-white/35">{p.rule}</p>
              <p className="text-xs text-white/20 mt-1 font-mono">{p.tables}</p>
            </div>
          ))}
        </div>

        {/* Anti-fraud rules */}
        <h3 className="text-base font-semibold text-white/60 mb-3">{d.fraudTitle}</h3>
        <div className="rounded-xl bg-white/5 border border-white/8 overflow-hidden">
          <table className="w-full text-xs">
            <tbody>
              {d.fraudRules.map((r: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-2 text-white/60 font-medium">{r.rule}</td>
                  <td className="px-4 py-2 text-white/30">{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
