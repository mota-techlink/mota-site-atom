"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative group/tip">
      {children}
      <div
        className={`pointer-events-none absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-2 px-4 py-3 rounded-xl border text-xl leading-relaxed whitespace-pre-line min-w-[240px] max-w-sm opacity-0 group-hover/tip:opacity-100 transition-opacity duration-200 shadow-xl ${
          isDark
            ? "bg-zinc-800 border-white/10 text-white/80"
            : "bg-[#E2DCF0] border-[#D0C8E4] text-[#37294F]"
        }`}
      >
        {text}
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent ${
            isDark ? "border-t-zinc-800" : "border-t-[#E2DCF0]"
          }`}
        />
      </div>
    </div>
  );
}

export function BackgroundSection() {
  const c = useContent();
  const d = c.background;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-background" className={PAGE}>
      <div className={PAGE_INNER}>
        <span
          className={`inline-block px-3 py-1 rounded-full ${
            isDark
              ? "bg-violet-500/10 border border-violet-500/20 text-violet-400"
              : "bg-violet-100 border border-violet-400/30 text-violet-700"
          } text-base font-medium mb-4`}
        >
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-3xl`}>{d.subtitle}</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl bg-gradient-to-br from-red-500/5 to-red-500/0 border border-red-500/15 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">🚫</span>
              <h3 className={`text-xl font-bold ${isDark ? "text-red-300" : "text-red-600"}`}>{d.problem.title}</h3>
            </div>
            <ul className="space-y-2">
              {d.problem.points.map((point: string, i: number) => (
                <li key={i} className={`text-xl ${t.body} flex items-start gap-2`}>
                  <span className={`${isDark ? "text-red-400/50" : "text-red-500"} mt-0.5 shrink-0`}>✕</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-emerald-500/5 to-emerald-500/0 border border-emerald-500/15 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">✅</span>
              <h3 className={`text-xl font-bold ${isDark ? "text-emerald-300" : "text-emerald-600"}`}>
                {d.solution.title}
              </h3>
            </div>
            <ul className="space-y-2">
              {d.solution.points.map((point: string, i: number) => (
                <li key={i} className={`text-xl ${t.body} flex items-start gap-2`}>
                  <span className={`${isDark ? "text-emerald-400/60" : "text-emerald-600"} mt-0.5 shrink-0`}>✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h3 className={`text-xl font-semibold ${t.subheading} mb-4`}>{d.workflowTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-8">
          {d.workflow.map((step: any, i: number) => (
            <Tooltip key={i} text={step.detail}>
              <div
                className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 text-center hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-200 cursor-default`}
              >
                <div
                  className={`w-8 h-8 mx-auto rounded-full ${
                    isDark ? "bg-violet-500/15 border border-violet-500/25" : "bg-violet-100 border border-violet-400/30"
                  } flex items-center justify-center text-xl font-bold ${
                    isDark ? "text-violet-300" : "text-violet-700"
                  } mb-2`}
                >
                  {step.step}
                </div>
                <div className="text-2xl mb-1">{step.icon}</div>
                <h4 className={`text-xl font-bold ${t.heading} mb-0.5`}>{step.label}</h4>
                <p className={`text-base ${t.body} leading-relaxed`}>{step.brief}</p>
              </div>
            </Tooltip>
          ))}
        </div>

        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.goalsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 mb-8">
          {d.goals.map((goal: any, i: number) => (
            <Tooltip key={i} text={goal.details?.join("\n") ?? goal.desc}>
              <div
                className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-200 cursor-default`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{goal.icon}</span>
                  <h4 className={`text-xl font-bold ${t.heading}`}>{goal.title}</h4>
                </div>
                <p className={`text-base ${t.body} leading-relaxed`}>{goal.desc}</p>
              </div>
            </Tooltip>
          ))}
        </div>

        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.methodTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {d.methods.map((method: any, i: number) => (
            <Tooltip key={i} text={method.detail}>
              <div
                className={`rounded-lg ${t.cardBg} border ${t.cardBorder} p-4 hover:border-violet-500/25 hover:bg-violet-500/5 transition-all duration-200 cursor-default`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-base font-bold ${isDark ? "text-violet-400/70" : "text-violet-700"} font-mono`}>
                    {method.id}
                  </span>
                  <span className="text-xl">{method.icon}</span>
                </div>
                <h4 className={`text-base font-bold ${t.heading} mb-1`}>{method.name}</h4>
                <p className={`text-base ${t.muted} leading-relaxed`}>{method.platforms}</p>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </section>
  );
}
