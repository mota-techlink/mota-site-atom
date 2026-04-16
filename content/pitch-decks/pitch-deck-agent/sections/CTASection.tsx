"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

export function CTASection() {
  const c = useContent();
  const d = c.cta;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-cta" className={PAGE}>
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
          className={`font-bold mb-2`}
          style={{
            fontSize: "clamp(1.15rem, 1.8vw + 0.4rem, 2.5rem)",
            background: isDark
              ? "linear-gradient(to right, #818cf8, #a78bfa, #f472b6)"
              : "linear-gradient(to right, #4f46e5, #7c3aed, #db2777)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {d.title}
        </h2>
        <p className={`${t.body} text-sm sm:text-base max-w-2xl mb-8`}>
          {d.subtitle}
        </p>

        {/* Invocation example */}
        <div
          className={`rounded-2xl border mb-10 overflow-hidden ${
            isDark
              ? "border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 to-transparent"
              : "border-indigo-300/40 bg-gradient-to-b from-indigo-50 to-transparent"
          }`}
        >
          <div
            className={`flex items-center gap-1.5 px-4 py-2 border-b ${t.divider} ${isDark ? "bg-[#141626]" : t.cardBg} text-xs font-mono ${t.subheading}`}
          >
            <span>●</span>
            <span>GitHub Copilot Agent Invocation</span>
          </div>
          <div className="p-4 sm:p-6">
            <span
              className={`text-sm sm:text-base font-mono ${
                isDark ? "text-indigo-300" : "text-indigo-700"
              }`}
            >
              {d.example}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {/* Feature checklist */}
          <div>
            <h3
              className={`font-semibold ${t.subheading} mb-4 text-sm sm:text-base`}
            >
              What You Get
            </h3>
            <ul className="space-y-2">
              {d.features.map((feat: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className={`shrink-0 ${isDark ? "text-emerald-400" : "text-emerald-600"} font-bold`}>
                    ✓
                  </span>
                  <span className={t.body}>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3
              className={`font-semibold ${t.subheading} mb-4 text-sm sm:text-base`}
            >
              Resources
            </h3>
            <div className="space-y-3">
              {d.links.map(
                (
                  link: { icon: string; label: string; url: string },
                  i: number
                ) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-xl ${t.cardBg} border ${t.cardBorder} px-4 py-3`}
                  >
                    <span className="text-xl shrink-0">{link.icon}</span>
                    <div>
                      <div
                        className={`font-medium ${t.heading} text-sm`}
                      >
                        {link.label}
                      </div>
                      <span className={`text-xs font-mono ${t.body}`}>
                        {link.url}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Final call */}
        <div
          className={`text-center py-6 rounded-2xl border ${t.cardBorder} ${t.cardBg}`}
        >
          <p
            className={`font-bold ${t.heading} mb-1`}
            style={{ fontSize: "clamp(1rem, 1.5vw + 0.3rem, 1.5rem)" }}
          >
            🤖 Ready to generate?
          </p>
          <p className={`text-xs sm:text-sm ${t.muted}`}>
            Open GitHub Copilot Chat and invoke the agent.
          </p>
        </div>
      </div>
    </section>
  );
}
