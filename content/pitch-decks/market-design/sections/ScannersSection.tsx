"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";
import { Collapsible } from "./_shared";

export function ScannersSection() {
  const c = useContent();
  const d = c.scanners;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-scanners" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-emerald-100 border border-emerald-400/30 text-emerald-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* Scanner matrix */}
        <div className="mb-4">
        <Collapsible title={d.scannersTitle} badge={<span className={`text-base ${t.muted}`}>{d.scanners.length}</span>}>
          <div className="overflow-x-auto">
            <table className="w-full text-base min-w-[600px]">
              <thead>
                <tr className={`border-b ${t.cardBorder} ${t.thText}`}>
                  <th className="text-left px-4 py-2.5 font-medium">Platform</th>
                  <th className="text-left px-4 py-2.5 font-medium">Method</th>
                  <th className="text-left px-4 py-2.5 font-medium">Frequency</th>
                  <th className="text-left px-4 py-2.5 font-medium">Rate Limit</th>
                </tr>
              </thead>
              <tbody>
                {d.scanners.map((s: any, i: number) => (
                  <tr key={i} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                    <td className={`px-4 py-2 ${t.heading} font-medium`}>{s.platform}</td>
                    <td className={`px-4 py-2 ${isDark ? "text-cyan-300/70" : "text-cyan-700"} font-mono text-base`}>{s.method}</td>
                    <td className={`px-4 py-2 ${t.body}`}>{s.freq}</td>
                    <td className={`px-4 py-2 ${t.muted} text-base`}>{s.rateLimit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Collapsible>
        </div>

        {/* Skills */}
        <div className="mb-4">
        <Collapsible title={d.skillsTitle} badge={<span className={`text-base ${t.muted}`}>{d.skills.length}</span>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-4">
            {d.skills.map((s: any, i: number) => (
              <div key={i} className={`rounded-lg ${t.cardBg} border ${t.cardBorder} px-3 py-2.5`}>
                <div className={`text-base font-mono ${isDark ? "text-indigo-300" : "text-indigo-700"} mb-1`}>{s.skill}</div>
                <div className="flex gap-4 text-base">
                  <span className={t.muted}>IN: <span className={t.body}>{s.input}</span></span>
                  <span className={t.muted}>OUT: <span className={isDark ? "text-emerald-300/60" : "text-emerald-700"}>{s.output}</span></span>
                </div>
              </div>
            ))}
          </div>
        </Collapsible>
        </div>

        {/* Filter keywords */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.filterTitle}</h3>
        <div className="flex flex-wrap gap-1.5">
          {d.filterKeywords.map((kw: string, i: number) => (
            <span key={i} className={`px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/15 ${isDark ? "text-rose-300/70" : "text-rose-700"} text-base font-mono`}>
              {kw}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
