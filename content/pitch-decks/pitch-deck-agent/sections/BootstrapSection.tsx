"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

export function BootstrapSection() {
  const c = useContent();
  const d = c.bootstrap;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-bootstrap" className={PAGE}>
      <div className={PAGE_INNER}>
        {/* Badge */}
        <div
          className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4 ${
            isDark
              ? "bg-rose-500/10 border border-rose-500/20 text-rose-300"
              : "bg-rose-100 border border-rose-400/30 text-rose-700"
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

        {/* Bootstrap checks */}
        <div className="space-y-3 mb-10">
          {d.checks.map(
            (
              check: {
                id: string;
                icon: string;
                label: string;
                check: string;
                fix: string;
              },
              i: number
            ) => (
              <div
                key={i}
                className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 hover:border-indigo-500/30 transition-all duration-200`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isDark
                        ? "bg-indigo-500/15 text-indigo-300"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {check.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{check.icon}</span>
                      <h3
                        className={`font-semibold ${t.heading} text-sm sm:text-base`}
                      >
                        {check.label}
                      </h3>
                    </div>
                    <p className={`text-xs ${t.muted} mb-1`}>{check.check}</p>
                    <span
                      className={`text-xs font-mono break-all ${
                        isDark ? "text-emerald-300" : "text-emerald-700"
                      }`}
                    >
                      → {check.fix}
                    </span>
                  </div>
                  <div className="shrink-0">
                    <span className="text-emerald-400 text-lg">✓</span>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Support matrix */}
        <h3
          className={`font-semibold ${t.subheading} mb-4 text-sm sm:text-base`}
        >
          Project Compatibility
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {d.support.map(
            (s: { icon: string; label: string; desc: string }, i: number) => (
              <div
                key={i}
                className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 sm:p-5`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{s.icon}</span>
                  <h4
                    className={`font-semibold ${t.heading} text-sm sm:text-base`}
                  >
                    {s.label}
                  </h4>
                </div>
                <p className={`text-xs sm:text-sm ${t.body}`}>{s.desc}</p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
