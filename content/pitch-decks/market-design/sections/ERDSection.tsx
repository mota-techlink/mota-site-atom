"use client";

import React from "react";
import { useContent } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";

export function ERDSection() {
  const c = useContent();
  const d = c.erd;

  return (
    <section id="s-erd" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{d.title}</h2>
        <p className="text-sm text-white/40 mb-8 max-w-2xl">{d.subtitle}</p>

        {/* Table groups */}
        <div className="space-y-6">
          {d.groups.map((g: any, gi: number) => (
            <div key={gi}>
              <h3 className="text-xs font-bold text-white/50 mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-lime-500/10 border border-lime-500/20 inline-flex items-center justify-center text-[10px] text-lime-400 font-mono">
                  {gi + 1}
                </span>
                {g.name}
                <span className="text-[10px] text-white/20 font-mono ml-auto">{g.tables.length} tables</span>
              </h3>
              <div className="rounded-xl bg-white/5 border border-white/8 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/8 text-white/30">
                      <th className="text-left px-4 py-2 font-medium">Table</th>
                      <th className="text-left px-4 py-2 font-medium">Key</th>
                      <th className="text-left px-4 py-2 font-medium hidden sm:table-cell">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.tables.map((t: any, ti: number) => (
                      <tr key={ti} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                        <td className="px-4 py-2 text-emerald-300/70 font-mono text-[11px] whitespace-nowrap">{t.table}</td>
                        <td className="px-4 py-2 text-white/40 font-mono text-[10px]">{t.key}</td>
                        <td className="px-4 py-2 text-white/30 hidden sm:table-cell">{t.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
