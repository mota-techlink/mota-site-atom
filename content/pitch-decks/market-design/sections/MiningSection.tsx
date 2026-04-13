"use client";

import React from "react";
import { useContent } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";

export function MiningSection() {
  const c = useContent();
  const d = c.mining;

  return (
    <section id="s-mining" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{d.title}</h2>
        <p className="text-sm text-white/40 mb-8 max-w-2xl">{d.subtitle}</p>

        {/* LLM strategy */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.llmTitle}</h3>
        <div className="rounded-xl bg-white/5 border border-white/8 overflow-hidden mb-8">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8 text-white/30">
                <th className="text-left px-4 py-2.5 font-medium">Task</th>
                <th className="text-left px-4 py-2.5 font-medium">Model</th>
                <th className="text-left px-4 py-2.5 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody>
              {d.llmStrategy.map((s: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-2 text-white/60">{s.task}</td>
                  <td className="px-4 py-2 text-cyan-300/70 font-mono text-[10px]">{s.model}</td>
                  <td className="px-4 py-2 text-white/35">{s.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pipeline */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.pipelineTitle}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {d.pipeline.map((p: any, i: number) => (
            <div key={i} className="rounded-xl bg-gradient-to-br from-white/5 to-white/2 border border-white/8 p-4">
              <div className="w-7 h-7 rounded-full bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-xs text-purple-300 font-bold mb-2">
                {p.step}
              </div>
              <h4 className="text-xs font-bold text-white mb-1">{p.label}</h4>
              <p className="text-[10px] text-white/35 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* 5-axis validation */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.validationTitle}</h3>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {d.axes.map((a: any, i: number) => (
            <div key={i} className="rounded-lg bg-white/5 border border-white/8 p-3 text-center">
              <div className="text-lg font-bold text-indigo-300 mb-1">{a.axis}</div>
              <div className="text-[10px] text-white/40">{a.name}</div>
              <div className="text-[10px] text-white/25 mt-1">max {a.max}</div>
            </div>
          ))}
        </div>

        {/* Verdicts */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.verdictTitle}</h3>
        <div className="flex gap-3 mb-8">
          {d.verdicts.map((v: any, i: number) => (
            <div key={i} className="flex-1 rounded-lg bg-white/5 border border-white/8 p-3 text-center">
              <div className="text-lg mb-1">{v.icon}</div>
              <div className="text-xs font-bold text-white">{v.range}</div>
              <div className="text-[10px] text-white/50">{v.verdict}</div>
              <div className="text-[10px] text-white/25 mt-1">{v.action}</div>
            </div>
          ))}
        </div>

        {/* Output fields */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.outputTitle}</h3>
        <div className="flex flex-wrap gap-1.5">
          {d.outputFields.map((f: string, i: number) => (
            <span key={i} className="px-2 py-1 rounded bg-white/5 border border-white/8 text-[10px] font-mono text-white/40">
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
