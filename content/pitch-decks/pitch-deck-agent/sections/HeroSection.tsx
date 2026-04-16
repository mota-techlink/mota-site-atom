"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

export function HeroSection() {
  const c = useContent();
  const d = c.hero;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-hero" className={PAGE}>
      <div className={PAGE_INNER}>
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
            isDark
              ? "bg-indigo-500/15 border border-indigo-500/25 text-indigo-400"
              : "bg-indigo-100 border border-indigo-400/30 text-indigo-700"
          } text-sm font-medium mb-6`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          {d.badge}
        </div>

        {/* Hero title */}
        <h1
          className={`font-bold ${t.heading} mb-3`}
          style={{ fontSize: "clamp(2rem, 4vw + 0.5rem, 4.5rem)" }}
        >
          {d.title}
        </h1>

        <p
          className={`${t.body} max-w-2xl mb-2`}
          style={{ fontSize: "clamp(1rem, 1.5vw + 0.3rem, 1.4rem)" }}
        >
          {d.subtitle}
        </p>

        <p
          className={`font-mono mb-10 ${isDark ? "text-indigo-400" : "text-indigo-600"}`}
          style={{ fontSize: "clamp(0.85rem, 1vw + 0.2rem, 1.1rem)" }}
        >
          {d.tagline}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {d.stats.map(
            (s: { icon: string; value: string; label: string }, i: number) => (
              <div
                key={i}
                className={`rounded-xl ${t.cardBg} border ${t.cardBorder} px-4 py-5 flex flex-col items-center`}
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div
                  className={`font-bold ${t.heading} mb-1`}
                  style={{ fontSize: "clamp(1.1rem, 1.5vw + 0.3rem, 1.75rem)" }}
                >
                  {s.value}
                </div>
                <div className={`text-xs sm:text-sm ${t.muted} text-center`}>
                  {s.label}
                </div>
              </div>
            )
          )}
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {d.highlights.map(
            (h: { icon: string; text: string }, i: number) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl ${t.cardBg} border ${t.cardBorder} px-4 py-3`}
              >
                <span className="text-2xl">{h.icon}</span>
                <span className={`text-sm sm:text-base ${t.body}`}>
                  {h.text}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
