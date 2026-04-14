"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";
import { Collapsible } from "./_shared";

export function EdgeFunctionsSection() {
  const c = useContent();
  const d = c.edge;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-edge" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-orange-500/10 border border-orange-500/20 text-orange-400" : "bg-orange-100 border border-orange-400/30 text-orange-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* Edge functions table */}
        <div className="mb-6">
          <Collapsible title={d.functionsTitle} badge={<span className={`text-base ${t.muted} font-mono`}>{d.functions.length} fns</span>}>
            <div className="overflow-hidden">
              <table className="w-full text-base">
                <thead>
                  <tr className={`border-b ${t.cardBorder} ${t.thText}`}>
                    <th className="text-left px-4 py-2.5 font-medium">#</th>
                    <th className="text-left px-4 py-2.5 font-medium">Function</th>
                    <th className="text-left px-4 py-2.5 font-medium">Trigger</th>
                    <th className="text-left px-4 py-2.5 font-medium hidden sm:table-cell">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {d.functions.map((f: any, i: number) => (
                    <tr key={i} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                      <td className={`px-4 py-2 ${t.muted} font-mono text-base`}>{i + 1}</td>
                      <td className={`px-4 py-2 ${isDark ? "text-orange-300/70" : "text-orange-700"} font-mono text-base whitespace-nowrap`}>{f.name}</td>
                      <td className={`px-4 py-2 ${t.body} text-base`}>{f.trigger}</td>
                      <td className={`px-4 py-2 ${t.muted} hidden sm:table-cell`}>{f.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>
        </div>

        {/* RLS policy matrix */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.rlsTitle}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
          {d.rlsGroups.map((p: any, i: number) => (
            <div key={i} className={`rounded-lg ${t.cardBg} border ${t.cardBorder} p-3`}>
              <h4 className={`text-xl font-bold ${t.heading} mb-1`}>{p.scope}</h4>
              <p className={`text-base ${t.muted}`}>{p.rule}</p>
              <p className={`text-base ${t.muted} mt-1 font-mono`}>{p.tables}</p>
            </div>
          ))}
        </div>

        {/* Anti-fraud rules */}
        <div className="mt-6">
          <Collapsible title={d.fraudTitle} badge={<span className={`text-base ${t.muted} font-mono`}>{d.fraudRules.length} rules</span>}>
            <div className="overflow-hidden">
              <table className="w-full text-base">
                <tbody>
                  {d.fraudRules.map((r: any, i: number) => (
                    <tr key={i} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                      <td className={`px-4 py-2 ${t.body} font-medium`}>{r.rule}</td>
                      <td className={`px-4 py-2 ${t.muted}`}>{r.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>
        </div>
      </div>
    </section>
  );
}
