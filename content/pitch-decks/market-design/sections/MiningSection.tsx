"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";
import { Collapsible } from "./_shared";

export function MiningSection() {
  const c = useContent();
  const d = c.mining;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-mining" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-purple-500/10 border border-purple-500/20 text-purple-400" : "bg-purple-100 border border-purple-400/30 text-purple-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* LLM strategy */}
        <div className="mb-4">
        <Collapsible title={d.llmTitle} badge={<span className={`text-base ${t.muted}`}>{d.llmStrategy.length}</span>}>
          <table className="w-full text-base">
            <thead>
              <tr className={`border-b ${t.cardBorder} ${t.thText}`}>
                <th className="text-left px-4 py-2.5 font-medium">Task</th>
                <th className="text-left px-4 py-2.5 font-medium">Model</th>
                <th className="text-left px-4 py-2.5 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody>
              {d.llmStrategy.map((s: any, i: number) => (
                <tr key={i} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                  <td className={`px-4 py-2 ${t.body}`}>{s.task}</td>
                  <td className={`px-4 py-2 ${isDark ? "text-cyan-300/70" : "text-cyan-700"} font-mono text-base`}>{s.model}</td>
                  <td className={`px-4 py-2 ${t.muted}`}>{s.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Collapsible>
        </div>

        {/* Pipeline */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.pipelineTitle}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {d.pipeline.map((p: any, i: number) => (
            <div key={i} className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4`}>
              <div className={`w-7 h-7 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-base ${isDark ? "text-purple-300" : "text-purple-700"} font-bold mb-2`}>
                {p.step}
              </div>
              <h4 className={`text-xl font-bold ${t.heading} mb-1`}>{p.label}</h4>
              <p className={`text-base ${t.muted} leading-relaxed`}>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* 5-axis validation */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.validationTitle}</h3>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {d.axes.map((a: any, i: number) => (
            <div key={i} className={`rounded-lg ${t.cardBg} border ${t.cardBorder} p-3 text-center`}>
              <div className={`text-2xl font-bold ${isDark ? "text-indigo-300" : "text-indigo-700"} mb-1`}>{a.axis}</div>
              <div className={`text-base ${t.body}`}>{a.name}</div>
              <div className={`text-base ${t.muted} mt-1`}>max {a.max}</div>
            </div>
          ))}
        </div>

        {/* Verdicts */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.verdictTitle}</h3>
        <div className="flex gap-3 mb-8">
          {d.verdicts.map((v: any, i: number) => (
            <div key={i} className={`flex-1 rounded-lg ${t.cardBg} border ${t.cardBorder} p-3 text-center`}>
              <div className="text-2xl mb-1">{v.icon}</div>
              <div className={`text-xl font-bold ${t.heading}`}>{v.range}</div>
              <div className={`text-base ${t.body}`}>{v.verdict}</div>
              <div className={`text-base ${t.muted} mt-1`}>{v.action}</div>
            </div>
          ))}
        </div>

        {/* Output fields */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.outputTitle}</h3>
        <div className="flex flex-wrap gap-1.5">
          {d.outputFields.map((f: string, i: number) => (
            <span key={i} className={`px-2 py-1 rounded ${t.cardBg} border ${t.cardBorder} text-base font-mono ${t.body}`}>
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
