"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

export function RoleSection() {
  const c = useContent();
  const d = c.role;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-role" className={PAGE}>
      <div className={PAGE_INNER}>
        {/* Badge */}
        <div
          className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4 ${
            isDark
              ? "bg-violet-500/10 border border-violet-500/20 text-violet-300"
              : "bg-violet-100 border border-violet-400/30 text-violet-700"
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

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {d.steps.map(
            (
              s: { icon: string; title: string; desc: string },
              i: number
            ) => (
              <div
                key={i}
                className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 sm:p-6 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-200`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{s.icon}</span>
                  <h3
                    className={`font-semibold ${t.heading}`}
                    style={{
                      fontSize: "clamp(0.9rem, 0.9vw + 0.3rem, 1.2rem)",
                    }}
                  >
                    {s.title}
                  </h3>
                </div>
                <p className={`text-sm ${t.body} leading-relaxed`}>{s.desc}</p>
              </div>
            )
          )}
        </div>

        {/* Constraints */}
        <h3
          className={`font-semibold ${t.subheading} mb-4`}
          style={{ fontSize: "clamp(0.85rem, 0.9vw + 0.3rem, 1.1rem)" }}
        >
          Key Constraints
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {d.constraints.map(
            (con: { label: string; desc: string }, i: number) => (
              <div
                key={i}
                className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 text-center`}
              >
                <div
                  className={`font-mono font-bold mb-1 ${
                    isDark ? "text-violet-300" : "text-violet-700"
                  } text-sm`}
                >
                  {con.label}
                </div>
                <p className={`text-xs ${t.muted} leading-relaxed`}>
                  {con.desc}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
