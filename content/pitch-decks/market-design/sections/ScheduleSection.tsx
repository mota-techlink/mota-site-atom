"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

/**
 * Category accent palettes — each frequency band gets its own color.
 * { border, headerBg, headerText, dotBg, timeBadge }
 */
const CAT_COLORS: Record<
  string,
  {
    dark: { border: string; headerBg: string; headerText: string; dotBg: string; timeBadge: string };
    light: { border: string; headerBg: string; headerText: string; dotBg: string; timeBadge: string };
  }
> = {
  /* 即时 / Instant — amber */
  "0": {
    dark:  { border: "border-amber-500/30", headerBg: "bg-amber-500/10", headerText: "text-amber-300", dotBg: "bg-amber-400", timeBadge: "text-amber-300/80" },
    light: { border: "border-amber-500/40", headerBg: "bg-amber-100", headerText: "text-amber-700", dotBg: "bg-amber-500", timeBadge: "text-amber-700" },
  },
  /* 每月 / Monthly — rose */
  "1": {
    dark:  { border: "border-rose-500/30", headerBg: "bg-rose-500/10", headerText: "text-rose-300", dotBg: "bg-rose-400", timeBadge: "text-rose-300/80" },
    light: { border: "border-rose-500/40", headerBg: "bg-rose-100", headerText: "text-rose-700", dotBg: "bg-rose-500", timeBadge: "text-rose-700" },
  },
  /* 每周 / Weekly — cyan */
  "2": {
    dark:  { border: "border-cyan-500/30", headerBg: "bg-cyan-500/10", headerText: "text-cyan-300", dotBg: "bg-cyan-400", timeBadge: "text-cyan-300/80" },
    light: { border: "border-cyan-500/40", headerBg: "bg-cyan-100", headerText: "text-cyan-700", dotBg: "bg-cyan-500", timeBadge: "text-cyan-700" },
  },
  /* 每日 / Daily — indigo */
  "3": {
    dark:  { border: "border-indigo-500/30", headerBg: "bg-indigo-500/10", headerText: "text-indigo-300", dotBg: "bg-indigo-400", timeBadge: "text-indigo-300/80" },
    light: { border: "border-indigo-500/40", headerBg: "bg-indigo-100", headerText: "text-indigo-700", dotBg: "bg-indigo-500", timeBadge: "text-indigo-700" },
  },
};

export function ScheduleSection() {
  const c = useContent();
  const d = c.schedule;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-schedule" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" : "bg-amber-100 border border-amber-400/30 text-amber-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* ── Stacked category blocks ─────────────────────────── */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-4`}>{d.schedTitle}</h3>

        {/* Top row: Instant + Monthly side-by-side */}
        {d.categories.length >= 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {(d.categories as any[]).slice(0, 2).map((cat: any, ci: number) => {
              const palette = CAT_COLORS[String(ci)]?.[isDark ? "dark" : "light"] ?? CAT_COLORS["0"][isDark ? "dark" : "light"];
              return (
                <div
                  key={ci}
                  className={`rounded-xl border-2 ${palette.border} overflow-hidden transition-colors`}
                >
                  {/* Category header */}
                  <div className={`flex items-center gap-2 px-4 py-2 ${palette.headerBg}`}>
                    <span className="text-xl">{cat.icon}</span>
                    <h4 className={`text-base font-bold ${palette.headerText}`}>{cat.label}</h4>
                    <span className={`text-base ${t.muted} ml-auto`}>{cat.desc}</span>
                  </div>
                  {/* Tasks — compact rows */}
                  <div className="divide-y divide-transparent">
                    {cat.tasks.map((task: any, ti: number) => (
                      <div
                        key={ti}
                        className={`flex items-center gap-2 px-4 py-2 ${isDark ? "bg-[#14161E]" : "bg-[#EEEBF7]"}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${palette.dotBg} shrink-0`} />
                        <span className="text-lg shrink-0">{task.icon}</span>
                        <span className={`text-base font-semibold ${t.heading} flex-1 min-w-0 truncate`}>{task.task}</span>
                        {task.time && (
                          <span className={`text-sm font-mono ${palette.timeBadge} shrink-0`}>{task.time}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Remaining categories: full-width stacked blocks */}
        <div className="space-y-3 mb-8">
          {(d.categories as any[]).slice(2).map((cat: any, ci: number) => {
            const realIdx = ci + 2;
            const palette = CAT_COLORS[String(realIdx)]?.[isDark ? "dark" : "light"] ?? CAT_COLORS["0"][isDark ? "dark" : "light"];
            return (
              <div
                key={realIdx}
                className={`rounded-xl border-2 ${palette.border} overflow-hidden transition-colors`}
              >
                {/* Category header */}
                <div className={`flex items-center gap-3 px-5 py-3 ${palette.headerBg}`}>
                  <span className="text-2xl">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xl font-bold ${palette.headerText}`}>{cat.label}</h4>
                    <p className={`text-base ${t.muted}`}>{cat.desc}</p>
                  </div>
                  <span className={`text-base font-mono ${palette.timeBadge} shrink-0`}>
                    {cat.tasks.length}
                  </span>
                </div>

                {/* Task items grid */}
                <div className={`grid grid-cols-1 ${cat.tasks.length > 2 ? "sm:grid-cols-2" : ""} gap-px ${isDark ? "bg-white/5" : "bg-[#D0C8E4]/50"}`}>
                  {cat.tasks.map((task: any, ti: number) => (
                    <div
                      key={ti}
                      className={`flex items-center gap-3 px-5 py-3 ${isDark ? "bg-[#14161E]" : "bg-[#EEEBF7]"} transition-colors`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${palette.dotBg} shrink-0`} />
                      <span className="text-xl shrink-0">{task.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className={`text-base font-semibold ${t.heading}`}>{task.task}</span>
                        {task.time && (
                          <span className={`text-base font-mono ${palette.timeBadge} ml-2`}>{task.time}</span>
                        )}
                      </div>
                      <span className={`text-base ${t.muted} shrink-0 hidden sm:inline`}>{task.trigger}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CLI commands */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.cliTitle}</h3>
        <div className={`rounded-xl ${isDark ? "bg-black/40" : "bg-[#1A1230]"} border ${t.cardBorder} p-4 font-mono text-base`}>
          {d.cliCommands.map((cmd: any, i: number) => (
            <div key={i} className="mb-2 last:mb-0">
              <span className={isDark ? "text-emerald-400/50" : "text-emerald-400"}>$</span>{" "}
              <span className={isDark ? "text-white/60" : "text-white/80"}>{cmd.cmd}</span>
              <span className={`${isDark ? "text-white/35" : "text-white/50"} ml-4`}># {cmd.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
