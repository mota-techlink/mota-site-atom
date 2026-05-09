"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

export function ProductsSection() {
  const c = useContent();
  const d = c.products;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  const groups = [
    { key: "subscription", data: d.subscription, accent: "emerald", icon: "🛰️" },
    { key: "report", data: d.report, accent: "cyan", icon: "📘" },
    { key: "outreach", data: d.outreach, accent: "rose", icon: "💬" },
  ] as const;

  function accentCls(accent: string, isDark: boolean) {
    if (accent === "emerald") return isDark ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20" : "text-emerald-700 bg-emerald-100 border-emerald-400/30";
    if (accent === "cyan") return isDark ? "text-cyan-300 bg-cyan-500/10 border-cyan-500/20" : "text-cyan-700 bg-cyan-100 border-cyan-400/30";
    return isDark ? "text-rose-300 bg-rose-500/10 border-rose-500/20" : "text-rose-700 bg-rose-100 border-rose-400/30";
  }

  return (
    <section id="s-products" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-emerald-100 border border-emerald-400/30 text-emerald-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-3xl`}>{d.subtitle}</p>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {groups.map(({ key, data, accent, icon }) => (
            <div key={key} className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5`}>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium mb-3 ${accentCls(accent, isDark)}`}>
                <span>{icon}</span>
                {data.title}
              </div>
              <p className={`text-base ${t.body} leading-relaxed`}>{data.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
