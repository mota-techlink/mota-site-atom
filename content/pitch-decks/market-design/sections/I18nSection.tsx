"use client";

import React from "react";
import { useContent } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";

export function I18nSection() {
  const c = useContent();
  const d = c.i18n;

  return (
    <section id="s-i18n" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{d.title}</h2>
        <p className="text-base text-white/40 mb-8 max-w-2xl">{d.subtitle}</p>

        {/* Language × Platform matrix */}
        <h3 className="text-base font-semibold text-white/60 mb-3">{d.langTitle}</h3>
        <div className="rounded-xl bg-white/5 border border-white/8 overflow-hidden mb-8">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8 text-white/30">
                <th className="text-left px-4 py-2.5 font-medium">Language</th>
                <th className="text-left px-4 py-2.5 font-medium">Code</th>
                <th className="text-left px-4 py-2.5 font-medium">Platforms</th>
              </tr>
            </thead>
            <tbody>
              {d.languages.map((l: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-2 text-white/60">{l.lang}</td>
                  <td className="px-4 py-2 text-teal-300/70 font-mono text-xs">{l.code}</td>
                  <td className="px-4 py-2 text-white/35">{l.platforms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ollama models */}
        <h3 className="text-base font-semibold text-white/60 mb-3">{d.ollamaTitle}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
          {d.ollamaModels.map((m: any, i: number) => (
            <div key={i} className="rounded-lg bg-white/5 border border-white/8 p-3">
              <div className="text-xs font-bold text-white mb-1">{m.lang}</div>
              <div className="text-xs text-teal-300/50 font-mono">{m.model}</div>
            </div>
          ))}
        </div>

        {/* Competitor report pipeline */}
        <h3 className="text-base font-semibold text-white/60 mb-3">{d.reportTitle}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {d.reportPipeline.map((p: any, i: number) => (
            <div key={i} className="rounded-lg bg-gradient-to-br from-white/5 to-white/2 border border-white/8 p-3 text-center">
              <div className="text-xs text-white/20 font-mono mb-1">Step {p.step}</div>
              <div className="text-xs font-bold text-white">{p.label}</div>
            </div>
          ))}
        </div>
        {d.reportSections && (
          <div className="flex flex-wrap gap-1.5 mb-8">
            {d.reportSections.map((s: string, i: number) => (
              <span key={i} className="px-2 py-1 rounded bg-white/5 border border-white/8 text-xs text-white/40">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Tech stack */}
        <h3 className="text-base font-semibold text-white/60 mb-3">{d.stackTitle}</h3>
        <div className="rounded-xl bg-white/5 border border-white/8 overflow-hidden">
          <table className="w-full text-xs">
            <tbody>
              {d.stack.map((s: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-2 text-white/50 font-medium w-32">{s.layer}</td>
                  <td className="px-4 py-2 text-cyan-300/60 font-mono text-xs">{s.tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
