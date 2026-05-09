"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER, THEME } from "@/components/pitch-deck/deck/constants";
import { useDeckTheme } from "@/components/pitch-deck/deck/theme";

export function OverviewSection() {
  const c = useContent();
  const d = c.overview as Record<string, unknown>;
  const highlights = d.highlights as Array<Record<string, string>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  return (
    <section id="s-overview" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${isDark ? "bg-sky-500/10 border border-sky-500/20 text-sky-400" : "bg-sky-100 border border-sky-400/30 text-sky-700"}`}>
          {d.badge as string}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-xl ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle as string}</p>
        <p className={`text-base ${t.body} leading-relaxed mb-6`}>{d.description as string}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {highlights.map((h, i) => (
            <div key={i} className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5 flex items-start gap-4`}>
              <span className="text-2xl shrink-0">{h.icon}</span>
              <div>
                <h3 className={`text-lg font-semibold ${t.heading} mb-1`}>{h.label}</h3>
                <p className={`text-sm ${t.body} leading-relaxed`}>{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StagesSection() {
  const c = useContent();
  const d = c.stages as Record<string, unknown>;
  const stages = d.stages as Array<Record<string, string>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  return (
    <section id="s-stages" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${isDark ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400" : "bg-indigo-100 border border-indigo-400/30 text-indigo-700"}`}>
          {d.badge as string}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stages.map((s, i) => (
            <div key={i} className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5 flex flex-col`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-base font-bold ${isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-700"}`}>
                  {s.step}
                </div>
                <h3 className={`text-lg font-semibold ${t.heading}`}>{s.label}</h3>
              </div>
              <p className={`text-sm ${t.body} leading-relaxed`}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DataFlowSection() {
  const c = useContent();
  const d = c["data-flow"] as Record<string, unknown>;
  const flows = d.flows as Array<Record<string, string>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  return (
    <section id="s-data-flow" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${isDark ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" : "bg-amber-100 border border-amber-400/30 text-amber-700"}`}>
          {d.badge as string}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="space-y-3">
          {flows.map((f, i) => (
            <div key={i} className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 flex flex-col sm:flex-row sm:items-center gap-3`}>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-sm font-mono font-semibold px-2 py-0.5 rounded ${isDark ? "bg-white/10 text-white/80" : "bg-black/5 text-black/70"}`}>
                  {f.from}
                </span>
                <span className={`text-lg ${t.muted}`}>→</span>
                <span className={`text-sm font-mono font-semibold px-2 py-0.5 rounded ${isDark ? "bg-white/10 text-white/80" : "bg-black/5 text-black/70"}`}>
                  {f.to}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full ${t.badgeBg} ${t.badgeText}`}>
                  {f.type}
                </span>
              </div>
              <p className={`text-sm ${t.body} leading-relaxed sm:ml-auto`}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BackSection() {
  const c = useContent();
  const d = c.back as Record<string, unknown>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  const targetDeck = d.targetDeck as string;

  return (
    <section id="s-back" className={PAGE}>
      <div className={PAGE_INNER}>
        <a
          href={targetDeck}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-medium transition-all cursor-pointer ${isDark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-[#D6CEE8] hover:bg-[#C8BEE0] text-[#1A1230]"}`}
        >
          ← {d.subtitle as string}
        </a>
        <p className={`text-sm ${t.muted} mt-2`}>Ctrl+click 可新标签页打开</p>
      </div>
    </section>
  );
}
