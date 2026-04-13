"use client";

import React from "react";
import { useContent } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";

export function AnalysisSection() {
  const c = useContent();
  const d = c.analysis;

  return (
    <section id="s-analysis" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{d.title}</h2>
        <p className="text-sm text-white/40 mb-8 max-w-2xl">{d.subtitle}</p>

        {/* Prompt output fields */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.promptTitle}</h3>
        <div className="rounded-xl bg-white/5 border border-white/8 overflow-hidden mb-8">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8 text-white/30">
                <th className="text-left px-4 py-2.5 font-medium">Field</th>
                <th className="text-left px-4 py-2.5 font-medium">Type</th>
                <th className="text-left px-4 py-2.5 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              {d.promptFields.map((f: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-2 text-indigo-300 font-mono text-[11px]">{f.field}</td>
                  <td className="px-4 py-2 text-white/30 font-mono text-[10px]">{f.type}</td>
                  <td className="px-4 py-2 text-white/50">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Task fields */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.taskTitle}</h3>
        <div className="rounded-xl bg-white/5 border border-white/8 overflow-hidden mb-6">
          <table className="w-full text-xs">
            <tbody>
              {d.taskFields.map((f: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-2 text-emerald-300 font-mono text-[11px] whitespace-nowrap">{f.field}</td>
                  <td className="px-4 py-2 text-white/50">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Trigger note */}
        <div className="rounded-lg bg-amber-500/5 border border-amber-500/15 px-4 py-3">
          <p className="text-xs text-amber-300/70">⚡ {d.triggerNote}</p>
        </div>
      </div>
    </section>
  );
}
