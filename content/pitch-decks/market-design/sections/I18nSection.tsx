"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { Collapsible } from "./_shared";

export function I18nSection() {
  const c = useContent();
  const d = c.i18n;
  const t = useThemeTokens();

  return (
    <section id="s-i18n" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className={`text-2xl sm:text-3xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-base ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* Language × Platform matrix */}
        <div className="mb-6">
          <Collapsible title={d.langTitle} badge={<span className={`text-xs ${t.muted} font-mono`}>{d.languages.length} langs</span>}>
            <div className="overflow-hidden">
              <table className="w-full text-xs">
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
                      <td className="px-4 py-2 text-teal-300/80 font-mono text-xs">{l.code}</td>
                      <td className={`px-4 py-2 ${t.body}`}>{l.platforms}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>
        </div>

        {/* Ollama models */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-3`}>{d.ollamaTitle}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
          {d.ollamaModels.map((m: any, i: number) => (
            <div key={i} className={`rounded-lg ${t.cardBg} border ${t.cardBorder} p-3`}>
              <div className={`text-xs font-bold ${t.heading} mb-1`}>{m.lang}</div>
              <div className="text-xs text-teal-300/80 font-mono">{m.model}</div>
            </div>
          ))}
        </div>

        {/* Competitor report pipeline */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-3`}>{d.reportTitle}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {d.reportPipeline.map((p: any, i: number) => (
            <div key={i} className={`rounded-lg bg-gradient-to-br from-white/5 to-white/2 border ${t.cardBorder} p-3 text-center`}>
              <div className={`text-xs ${t.muted} font-mono mb-1`}>Step {p.step}</div>
              <div className={`text-xs font-bold ${t.heading}`}>{p.label}</div>
            </div>
          ))}
        </div>
        {d.reportSections && (
          <div className="flex flex-wrap gap-1.5 mb-8">
            {d.reportSections.map((s: string, i: number) => (
              <span key={i} className={`px-2 py-1 rounded ${t.cardBg} border ${t.cardBorder} text-xs ${t.body}`}>
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Tech stack */}
        <div className="mt-6">
          <Collapsible title={d.stackTitle} badge={<span className={`text-xs ${t.muted} font-mono`}>{d.stack.length} layers</span>}>
            <div className="overflow-hidden">
              <table className="w-full text-xs">
                <tbody>
                  {d.stack.map((s: any, i: number) => (
                    <tr key={i} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                      <td className={`px-4 py-2 ${t.body} font-medium w-32`}>{s.layer}</td>
                      <td className="px-4 py-2 text-cyan-300/80 font-mono text-xs">{s.tech}</td>
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
