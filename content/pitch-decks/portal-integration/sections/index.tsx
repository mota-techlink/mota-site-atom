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
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${isDark ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-emerald-100 border border-emerald-400/30 text-emerald-700"}`}>
          {d.badge as string}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-xl ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle as string}</p>
        <p className={`text-base ${t.body} leading-relaxed mb-6`}>{d.description as string}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {highlights.map((h, i) => (
            <div key={i} className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5 flex items-start gap-4`}>
              <span className="text-3xl shrink-0">{h.icon}</span>
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

export function PortalsSection() {
  const c = useContent();
  const d = c.portals as Record<string, unknown>;
  const portals = d.portals as Array<Record<string, unknown>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  return (
    <section id="s-portals" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${isDark ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" : "bg-blue-100 border border-blue-400/30 text-blue-700"}`}>
          {d.badge as string}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="space-y-6">
          {portals.map((p, i) => {
            const modules = p.modules as string[];
            const kpis = p.kpis as string[];
            const portalIcons = ["🌐", "💻", "⚙️"];
            const colorClasses = [
              isDark ? "border-emerald-500/30" : "border-emerald-400/40",
              isDark ? "border-blue-500/30" : "border-blue-400/40",
              isDark ? "border-violet-500/30" : "border-violet-400/40",
            ];
            return (
              <div key={i} className={`rounded-2xl ${t.cardBg} border ${colorClasses[i]} p-6`}>
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-3xl shrink-0">{portalIcons[i]}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`text-2xl font-bold ${t.heading}`}>{p.name as string}</h3>
                      <span className={`text-xs font-mono px-2 py-0.5 rounded ${t.badgeBg} ${t.badgeText}`}>
                        {p.route as string}
                      </span>
                    </div>
                    <div className={`text-sm ${t.muted} mb-1`}>{p.audience as string}</div>
                    <p className={`text-base ${t.body} leading-relaxed`}>{p.goal as string}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className={`text-sm font-semibold ${t.heading} mb-2`}>📋 功能模块</div>
                    <div className="flex flex-wrap gap-1.5">
                      {modules.map((m, j) => (
                        <span key={j} className={`text-xs px-2 py-1 rounded ${t.badgeBg} ${t.badgeText}`}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm font-semibold ${t.heading} mb-2`}>📊 核心 KPI</div>
                    <div className="flex flex-wrap gap-1.5">
                      {kpis.map((k, j) => (
                        <span key={j} className={`text-xs px-2 py-1 rounded ${isDark ? "bg-white/5 text-white/70" : "bg-black/5 text-black/60"}`}>
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
