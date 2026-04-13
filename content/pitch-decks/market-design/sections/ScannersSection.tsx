"use client";

import React from "react";
import { useContent } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";

export function ScannersSection() {
  const c = useContent();
  const d = c.scanners;

  return (
    <section id="s-scanners" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{d.title}</h2>
        <p className="text-sm text-white/40 mb-8 max-w-2xl">{d.subtitle}</p>

        {/* Scanner matrix */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.scannersTitle}</h3>
        <div className="rounded-xl bg-white/5 border border-white/8 overflow-x-auto mb-8">
          <table className="w-full text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-white/8 text-white/30">
                <th className="text-left px-4 py-2.5 font-medium">Platform</th>
                <th className="text-left px-4 py-2.5 font-medium">Method</th>
                <th className="text-left px-4 py-2.5 font-medium">Frequency</th>
                <th className="text-left px-4 py-2.5 font-medium">Rate Limit</th>
              </tr>
            </thead>
            <tbody>
              {d.scanners.map((s: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-2 text-white font-medium">{s.platform}</td>
                  <td className="px-4 py-2 text-cyan-300/70 font-mono text-[10px]">{s.method}</td>
                  <td className="px-4 py-2 text-white/40">{s.freq}</td>
                  <td className="px-4 py-2 text-white/30 text-[10px]">{s.rateLimit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Skills */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.skillsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
          {d.skills.map((s: any, i: number) => (
            <div key={i} className="rounded-lg bg-white/5 border border-white/8 px-3 py-2.5">
              <div className="text-[11px] font-mono text-indigo-300 mb-1">{s.skill}</div>
              <div className="flex gap-4 text-[10px]">
                <span className="text-white/30">IN: <span className="text-white/50">{s.input}</span></span>
                <span className="text-white/30">OUT: <span className="text-emerald-300/60">{s.output}</span></span>
              </div>
            </div>
          ))}
        </div>

        {/* Filter keywords */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.filterTitle}</h3>
        <div className="flex flex-wrap gap-1.5">
          {d.filterKeywords.map((kw: string, i: number) => (
            <span key={i} className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/15 text-rose-300/70 text-[10px] font-mono">
              {kw}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
