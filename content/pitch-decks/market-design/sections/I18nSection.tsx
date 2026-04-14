"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";
import { Collapsible } from "./_shared";

export function I18nSection() {
  const c = useContent();
  const d = c.i18n;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-i18n" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-teal-500/10 border border-teal-500/20 text-teal-400" : "bg-teal-100 border border-teal-400/30 text-teal-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* Language × Platform matrix */}
        <div className="mb-6">
          <Collapsible title={d.langTitle} badge={<span className={`text-base ${t.muted} font-mono`}>{d.languages.length} langs</span>}>
            <div className="overflow-hidden">
              <table className="w-full text-base">
                <thead>
                  <tr className={`border-b ${t.cardBorder} ${t.thText}`}>
                    <th className="text-left px-4 py-2.5 font-medium">Language</th>
                    <th className="text-left px-4 py-2.5 font-medium">Code</th>
                    <th className="text-left px-4 py-2.5 font-medium">Platforms</th>
                  </tr>
                </thead>
                <tbody>
                  {d.languages.map((l: any, i: number) => (
                    <tr key={i} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                      <td className={`px-4 py-2 ${t.body}`}>{l.lang}</td>
                      <td className={`px-4 py-2 ${isDark ? "text-teal-300/80" : "text-teal-700"} font-mono text-base`}>{l.code}</td>
                      <td className={`px-4 py-2 ${t.body}`}>{l.platforms}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>
        </div>

        {/* Ollama models */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.ollamaTitle}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
          {d.ollamaModels.map((m: any, i: number) => (
            <div key={i} className={`rounded-lg ${t.cardBg} border ${t.cardBorder} p-3`}>
              <div className={`text-base font-bold ${t.heading} mb-1`}>{m.lang}</div>
              <div className={`text-base ${isDark ? "text-teal-300/80" : "text-teal-700"} font-mono`}>{m.model}</div>
            </div>
          ))}
        </div>

        {/* Competitor report pipeline — visual stepper */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-5`}>{d.reportTitle}</h3>

        {/* Step connector line + circles */}
        <div className="flex items-center justify-between mb-3">
          {d.reportPipeline.map((p: any, i: number) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-teal-500/15 border-2 border-teal-500/30 flex items-center justify-center text-2xl">
                  {p.icon}
                </div>
              </div>
              {i < d.reportPipeline.length - 1 && (
                <div className="flex-1 h-0.5 bg-teal-500/20 mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {d.reportPipeline.map((p: any, i: number) => (
            <div key={i} className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 text-center`}>
              <div className={`text-base font-mono ${isDark ? "text-teal-400/70" : "text-teal-700"} mb-1`}>Step {i + 1}</div>
              <div className={`text-base font-bold ${t.heading} mb-1`}>{p.step}</div>
              <p className={`text-base ${t.muted} leading-relaxed`}>{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Report sections — badges with icons */}
        {d.reportSections && (
          <div className="flex flex-wrap gap-2 mb-8">
            {d.reportSections.map((s: any, i: number) => (
              <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${t.cardBg} border ${t.cardBorder} text-base ${t.body} font-medium`}>
                <span>{s.icon}</span>
                {s.label}
              </span>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
