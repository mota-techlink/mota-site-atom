"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { Collapsible } from "./_shared";

export function AnalysisSection() {
  const c = useContent();
  const d = c.analysis;
  const t = useThemeTokens();

  return (
    <section id="s-analysis" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className={`text-2xl sm:text-3xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-base ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* Prompt output fields */}
        <div className="mb-6">
          <Collapsible title={d.promptTitle} badge={<span className={`text-xs ${t.muted} font-mono`}>{d.promptFields.length} fields</span>}>
            <div className="overflow-hidden">
              <table className="w-full text-xs">
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
                      <td className="px-4 py-2 text-indigo-300 font-mono text-xs">{f.field}</td>
                      <td className={`px-4 py-2 ${t.muted} font-mono text-xs`}>{f.type}</td>
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
          <Collapsible title={d.taskTitle} badge={<span className={`text-xs ${t.muted} font-mono`}>{d.taskFields.length} fields</span>}>
            <div className="overflow-hidden">
              <table className="w-full text-xs">
                <tbody>
                  {d.taskFields.map((f: any, i: number) => (
                    <tr key={i} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                      <td className="px-4 py-2 text-emerald-300 font-mono text-xs whitespace-nowrap">{f.field}</td>
                      <td className={`px-4 py-2 ${t.body}`}>{f.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>
        </div>

        {/* Trigger note */}
        <div className="rounded-lg bg-amber-500/5 border border-amber-500/15 px-4 py-3">
          <p className="text-xs text-amber-300/70">⚡ {d.triggerNote}</p>
        </div>
      </div>
    </section>
  );
}
