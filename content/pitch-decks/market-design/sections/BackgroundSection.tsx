"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

/** Hover tooltip on any element */
function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";
  return (
    <div className="relative group/tip">
      {children}
      <div className={`pointer-events-none absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-2 px-4 py-3 rounded-xl border text-sm leading-relaxed whitespace-pre-line min-w-[240px] max-w-sm opacity-0 group-hover/tip:opacity-100 transition-opacity duration-200 shadow-xl ${isDark ? "bg-zinc-800 border-white/10 text-white/80" : "bg-white border-gray-200 text-gray-700"}`}>
        {text}
        <div className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent ${isDark ? "border-t-zinc-800" : "border-t-white"}`} />
      </div>
    </div>
  );
}

export function BackgroundSection() {
  const c = useContent();
  const d = c.background;
  const t = useThemeTokens();

  return (
    <section id="s-background" className={PAGE}>
      <div className={PAGE_INNER}>
        {/* Badge */}
        <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className={`text-2xl sm:text-3xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-base ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* ── Problem / Insight visual ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Traditional marketing problem */}
          <div className="rounded-xl bg-gradient-to-br from-red-500/5 to-red-500/0 border border-red-500/15 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🚫</span>
              <h3 className="text-base font-bold text-red-300">{d.problem.title}</h3>
            </div>
            <ul className="space-y-2">
              {d.problem.points.map((p: string, i: number) => (
                <li key={i} className={`text-sm ${t.body} flex items-start gap-2`}>
                  <span className="text-red-400/50 mt-0.5 shrink-0">✕</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Our approach */}
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/5 to-emerald-500/0 border border-emerald-500/15 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✅</span>
              <h3 className="text-base font-bold text-emerald-300">{d.solution.title}</h3>
            </div>
            <ul className="space-y-2">
              {d.solution.points.map((p: string, i: number) => (
                <li key={i} className={`text-sm ${t.body} flex items-start gap-2`}>
                  <span className="text-emerald-400/60 mt-0.5 shrink-0">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Five-step workflow — visual pipeline ──────────────── */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-4`}>{d.workflowTitle}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
          {d.workflow.map((step: any, i: number) => (
            <Tooltip key={i} text={step.detail}>
              <div className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 text-center hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200 cursor-default`}>
                <div className="w-8 h-8 mx-auto rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-sm font-bold text-indigo-300 mb-2">
                  {step.step}
                </div>
                <div className="text-xl mb-1">{step.icon}</div>
                <h4 className={`text-sm font-bold ${t.heading} mb-0.5`}>{step.label}</h4>
                <p className={`text-xs ${t.body} leading-relaxed`}>{step.brief}</p>
              </div>
            </Tooltip>
          ))}
        </div>

        {/* ── Business Goals (3-col grid with hover details) ─── */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-3`}>{d.goalsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-8">
          {d.goals.map((g: any, i: number) => (
            <Tooltip key={i} text={g.details ? g.details.join('\n') : g.desc}>
              <div className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-200 cursor-default`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{g.icon}</span>
                  <h4 className={`text-sm font-bold ${t.heading}`}>{g.title}</h4>
                </div>
                <p className={`text-xs ${t.body} leading-relaxed line-clamp-3`}>{g.desc}</p>
              </div>
            </Tooltip>
          ))}
        </div>

        {/* ── Signal Methodology — hover for details ────────────── */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-3`}>{d.methodTitle}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {d.methods.map((m: any, i: number) => (
            <Tooltip key={i} text={m.detail}>
              <div className={`rounded-lg ${t.cardBg} border ${t.cardBorder} p-3 hover:border-cyan-500/25 hover:bg-cyan-500/5 transition-all duration-200 cursor-default`}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-xs font-bold text-cyan-400/60 font-mono">{m.id}</span>
                  <span className="text-sm">{m.icon}</span>
                </div>
                <h4 className={`text-xs font-bold ${t.heading} mb-0.5`}>{m.name}</h4>
                <p className={`text-xs ${t.muted} leading-relaxed line-clamp-2`}>{m.platforms}</p>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </section>
  );
}
