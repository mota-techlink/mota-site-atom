"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

export function StructureSection() {
  const c = useContent();
  const d = c.structure;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-structure" className={PAGE}>
      <div className={PAGE_INNER}>
        {/* Badge */}
        <div
          className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4 ${
            isDark
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
              : "bg-emerald-100 border border-emerald-400/30 text-emerald-700"
          }`}
        >
          {d.badge}
        </div>

        <h2
          className={`font-bold ${t.heading} mb-2`}
          style={{ fontSize: "clamp(1.15rem, 1.8vw + 0.4rem, 2.5rem)" }}
        >
          {d.title}
        </h2>
        <p className={`${t.body} text-sm sm:text-base max-w-2xl mb-8`}>
          {d.subtitle}
        </p>

        {/* File tree */}
        <div
          className={`rounded-xl border ${t.cardBorder} overflow-hidden mb-8`}
        >
          {/* Browser chrome */}
          <div
            className={`flex items-center gap-1.5 px-3 py-2 border-b ${t.divider} ${t.cardBg}`}
          >
            <span className="w-3 h-3 rounded-full bg-red-400/60" />
            <span className="w-3 h-3 rounded-full bg-amber-400/60" />
            <span className="w-3 h-3 rounded-full bg-emerald-400/60" />
            <span
              className={`ml-2 text-xs font-mono ${t.muted}`}
            >
              content/pitch-decks/&lt;slug&gt;/
            </span>
          </div>
          <div className="p-4 space-y-1">
            {d.tree.map(
              (
                f: { name: string; icon: string; desc: string },
                i: number
              ) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isDark ? "hover:bg-white/10" : "hover:bg-[#D6CEE8]/40"
                  }`}
                >
                  <span className="text-lg shrink-0">{f.icon}</span>
                  <span
                    className={`text-xs sm:text-sm font-mono ${
                      isDark ? "text-emerald-300" : "text-emerald-700"
                    } shrink-0 w-32 sm:w-40`}
                  >
                    {f.name}
                  </span>
                  <span className={`text-xs ${t.muted} truncate`}>
                    {f.desc}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Layout patterns */}
        <h3
          className={`font-semibold ${t.subheading} mb-4`}
          style={{ fontSize: "clamp(0.85rem, 0.9vw + 0.3rem, 1.1rem)" }}
        >
          Layout Patterns
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {d.patterns.map(
            (p: { icon: string; label: string; desc: string }, i: number) => (
              <div
                key={i}
                className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 sm:p-6`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{p.icon}</span>
                  <h4
                    className={`font-semibold ${t.heading} text-sm sm:text-base`}
                  >
                    {p.label}
                  </h4>
                </div>
                <p className={`text-xs sm:text-sm ${t.body} leading-relaxed`}>
                  {p.desc}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
