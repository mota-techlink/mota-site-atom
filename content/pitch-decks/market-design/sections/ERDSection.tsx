"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";
import { Collapsible } from "./_shared";

export function ERDSection() {
  const c = useContent();
  const d = c.erd;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-erd" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-lime-500/10 border border-lime-500/20 text-lime-400" : "bg-lime-100 border border-lime-400/30 text-lime-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* Table groups */}
        <div className="space-y-3">
          {d.groups.map((g: any, gi: number) => (
            <Collapsible
              key={gi}
              title={
                <span className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded inline-flex items-center justify-center text-base font-mono ${isDark ? "bg-lime-500/10 border border-lime-500/20 text-lime-400" : "bg-lime-200 border border-lime-500/40 text-lime-800"}`}>
                    {gi + 1}
                  </span>
                  {g.name}
                </span>
              }
              badge={<span className={`text-base ${t.muted} font-mono`}>{g.tables.length} tables</span>}
            >
              <div className="overflow-hidden">
                <table className="w-full text-base">
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
                        <td className={`px-4 py-2 ${isDark ? "text-emerald-300/70" : "text-emerald-700"} font-mono text-base whitespace-nowrap`}>{tbl.table}</td>
                        <td className={`px-4 py-2 ${t.body} font-mono text-base`}>{tbl.key}</td>
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
