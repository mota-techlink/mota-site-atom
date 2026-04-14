"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

export function DashboardSection() {
  const c = useContent();
  const d = c.dashboard;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-dashboard" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" : "bg-blue-100 border border-blue-400/30 text-blue-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* 3 panel cards */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.panelsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {d.panels.map((p: any, i: number) => (
            <div key={i} className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 hover:border-blue-500/25 transition-colors`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{p.icon}</span>
                <h4 className={`text-xl font-bold ${t.heading}`}>{p.name}</h4>
              </div>
              <ul className="space-y-1.5">
                {p.modules.map((m: string, mi: number) => (
                  <li key={mi} className={`text-base ${t.body} leading-relaxed`}>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Data source mapping */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.dataTitle}</h3>
        <div className={`rounded-xl ${t.cardBg} border ${t.cardBorder} overflow-hidden`}>
          <table className="w-full text-base">
            <thead>
              <tr className={`border-b ${t.cardBorder} ${t.thText}`}>
                <th className="text-left px-4 py-2.5 font-medium">Panel</th>
                <th className="text-left px-4 py-2.5 font-medium">Tables</th>
              </tr>
            </thead>
            <tbody>
              {d.dataSources.map((s: any, i: number) => (
                <tr key={i} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                  <td className={`px-4 py-2 ${t.body} font-medium`}>
                    <span className="mr-2">{s.icon}</span>{s.panel}
                  </td>
                  <td className={`px-4 py-2 ${isDark ? "text-cyan-300/70" : "text-cyan-700"} font-mono text-base`}>{s.tables}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
