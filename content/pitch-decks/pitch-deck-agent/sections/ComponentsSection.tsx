"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

export function ComponentsSection() {
  const c = useContent();
  const d = c.components;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  const accentClasses = [
    isDark
      ? "text-indigo-300 bg-indigo-500/10 border-indigo-500/20"
      : "text-indigo-700 bg-indigo-100 border-indigo-300/40",
    isDark
      ? "text-violet-300 bg-violet-500/10 border-violet-500/20"
      : "text-violet-700 bg-violet-100 border-violet-300/40",
    isDark
      ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
      : "text-emerald-700 bg-emerald-100 border-emerald-300/40",
    isDark
      ? "text-amber-300 bg-amber-500/10 border-amber-500/20"
      : "text-amber-700 bg-amber-100 border-amber-300/40",
    isDark
      ? "text-cyan-300 bg-cyan-500/10 border-cyan-500/20"
      : "text-cyan-700 bg-cyan-100 border-cyan-300/40",
  ];

  return (
    <section id="s-components" className={PAGE}>
      <div className={PAGE_INNER}>
        {/* Badge */}
        <div
          className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4 ${
            isDark
              ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-300"
              : "bg-cyan-100 border border-cyan-400/30 text-cyan-700"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {d.categories.map(
            (
              cat: { label: string; icon: string; items: string[] },
              i: number
            ) => (
              <div
                key={i}
                className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 sm:p-5 hover:border-indigo-500/30 transition-all duration-200`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{cat.icon}</span>
                  <h3
                    className={`font-semibold ${t.heading} text-sm sm:text-base`}
                  >
                    {cat.label}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item: string, j: number) => (
                    <span
                      key={j}
                      className={`text-[10px] sm:text-xs font-mono px-2 py-0.5 rounded-md border ${
                        accentClasses[i % accentClasses.length]
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
