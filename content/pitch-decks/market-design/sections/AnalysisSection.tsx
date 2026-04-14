"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";
import { Collapsible } from "./_shared";

export function AnalysisSection() {
  const c = useContent();
  const d = c.analysis;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-analysis" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-violet-500/10 border border-violet-500/20 text-violet-400" : "bg-violet-100 border border-violet-400/30 text-violet-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* Prompt output fields */}
        <div className="mb-6">
          <Collapsible title={d.promptTitle} badge={<span className={`text-base ${t.muted} font-mono`}>{d.promptFields.length} fields</span>}>
            <div className="overflow-hidden">
              <table className="w-full text-base">
                <thead>
                  <tr className={`border-b ${t.cardBorder} ${t.thText}`}>
                    <th className="text-left px-4 py-2.5 font-medium">Field</th>
                    <th className="text-left px-4 py-2.5 font-medium">Type</th>
                    <th className="text-left px-4 py-2.5 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {d.promptFields.map((f: any, i: number) => (
                    <tr key={i} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                      <td className={`px-4 py-2 ${isDark ? "text-indigo-300" : "text-indigo-700"} font-mono text-base`}>{f.field}</td>
                      <td className={`px-4 py-2 ${t.muted} font-mono text-base`}>{f.type}</td>
                      <td className={`px-4 py-2 ${t.body}`}>{f.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>
        </div>

        {/* Task fields */}
        <div className="mb-6">
          <Collapsible title={d.taskTitle} badge={<span className={`text-base ${t.muted} font-mono`}>{d.taskFields.length} fields</span>}>
            <div className="overflow-hidden">
              <table className="w-full text-base">
                <tbody>
                  {d.taskFields.map((f: any, i: number) => (
                    <tr key={i} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                      <td className={`px-4 py-2 ${isDark ? "text-emerald-300" : "text-emerald-700"} font-mono text-base whitespace-nowrap`}>{f.field}</td>
                      <td className={`px-4 py-2 ${t.body}`}>{f.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>
        </div>

        {/* Trigger note */}
        <div className={`rounded-lg ${isDark ? "bg-amber-500/5 border border-amber-500/15" : "bg-amber-100 border border-amber-400/30"} px-4 py-3`}>
          <p className={`text-base ${isDark ? "text-amber-300/70" : "text-amber-700"}`}>⚡ {d.triggerNote}</p>
        </div>
      </div>
    </section>
  );
}
