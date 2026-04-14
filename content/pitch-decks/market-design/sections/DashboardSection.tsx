"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";

export function DashboardSection() {
  const c = useContent();
  const d = c.dashboard;
  const t = useThemeTokens();

  return (
    <section id="s-dashboard" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className={`text-2xl sm:text-3xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-base ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* 3 panel cards */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-3`}>{d.panelsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {d.panels.map((p: any, i: number) => (
            <div key={i} className={`rounded-xl bg-gradient-to-br from-white/5 to-white/2 border ${t.cardBorder} p-4 hover:border-white/15 transition-colors`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{p.icon}</span>
                <h4 className={`text-sm font-bold ${t.heading}`}>{p.name}</h4>
              </div>
              <ul className="space-y-1">
                {p.modules.map((m: string, mi: number) => (
                  <li key={mi} className={`text-xs ${t.body} flex items-start gap-1.5`}>
                    <span className="text-indigo-400 mt-1 text-xs">●</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Data source mapping */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-3`}>{d.dataTitle}</h3>
        <div className={`rounded-xl ${t.cardBg} border ${t.cardBorder} overflow-hidden`}>
          <table className="w-full text-xs">
            <thead>
              <tr className={`border-b ${t.cardBorder} ${t.thText}`}>
                <th className="text-left px-4 py-2.5 font-medium">Panel</th>
                <th className="text-left px-4 py-2.5 font-medium">Tables</th>
              </tr>
            </thead>
            <tbody>
              {d.dataSources.map((s: any, i: number) => (
                <tr key={i} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                  <td className={`px-4 py-2 ${t.body} font-medium`}>{s.panel}</td>
                  <td className="px-4 py-2 text-cyan-300/70 font-mono text-xs">{s.tables}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
