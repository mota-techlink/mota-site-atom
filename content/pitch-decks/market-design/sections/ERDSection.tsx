"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { Collapsible } from "./_shared";

export function ERDSection() {
  const c = useContent();
  const d = c.erd;
  const t = useThemeTokens();

  return (
    <section id="s-erd" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className={`text-2xl sm:text-3xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-base ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* Table groups */}
        <div className="space-y-3">
          {d.groups.map((g: any, gi: number) => (
            <Collapsible
              key={gi}
              title={
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-lime-500/10 border border-lime-500/20 inline-flex items-center justify-center text-xs text-lime-400 font-mono">
                    {gi + 1}
                  </span>
                  {g.name}
                </span>
              }
              badge={<span className={`text-xs ${t.muted} font-mono`}>{g.tables.length} tables</span>}
            >
              <div className="overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className={`border-b ${t.cardBorder} ${t.thText}`}>
                      <th className="text-left px-4 py-2 font-medium">Table</th>
                      <th className="text-left px-4 py-2 font-medium">Key</th>
                      <th className="text-left px-4 py-2 font-medium hidden sm:table-cell">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.tables.map((tbl: any, ti: number) => (
                      <tr key={ti} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                        <td className="px-4 py-2 text-emerald-300/70 font-mono text-xs whitespace-nowrap">{tbl.table}</td>
                        <td className={`px-4 py-2 ${t.body} font-mono text-xs`}>{tbl.key}</td>
                        <td className={`px-4 py-2 ${t.muted} hidden sm:table-cell`}>{tbl.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Collapsible>
          ))}
        </div>


      </div>
    </section>
  );
}
