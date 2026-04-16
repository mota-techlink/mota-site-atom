"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

const TOKEN_ACCENT_CLASSES: Record<string, string> = {
  "bg-d-bg": "bg-[#0B0D14] border-white/20",
  "text-d-fg": "bg-zinc-100 border-zinc-300",
  "text-d-indigo": "bg-indigo-500 border-indigo-400",
  "text-d-violet": "bg-violet-500 border-violet-400",
  "text-d-emerald": "bg-emerald-500 border-emerald-400",
  "text-d-amber": "bg-amber-500 border-amber-400",
  "text-d-cyan": "bg-cyan-500 border-cyan-400",
  "bg-d-card": "bg-zinc-800 border-zinc-600",
};

export function DesignSection() {
  const c = useContent();
  const d = c.design;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-design" className={PAGE}>
      <div className={PAGE_INNER}>
        {/* Badge */}
        <div
          className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4 ${
            isDark
              ? "bg-amber-500/10 border border-amber-500/20 text-amber-300"
              : "bg-amber-100 border border-amber-400/30 text-amber-700"
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Design tokens */}
          <div>
            <h3
              className={`font-semibold ${t.subheading} mb-3 text-sm sm:text-base`}
            >
              Design Token Palette
            </h3>
            <div className="space-y-1.5">
              {d.tokens.map(
                (tok: { token: string; purpose: string }, i: number) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-lg ${t.cardBg} border ${t.cardBorder} px-3 py-2`}
                  >
                    <div
                      className={`w-4 h-4 rounded border shrink-0 ${
                        TOKEN_ACCENT_CLASSES[tok.token] ?? "bg-zinc-500"
                      }`}
                    />
                    <span
                      className={`text-xs font-mono ${
                        isDark ? "text-amber-300" : "text-amber-700"
                      } w-32 sm:w-36 shrink-0`}
                    >
                      {tok.token}
                    </span>
                    <span className={`text-xs ${t.muted}`}>{tok.purpose}</span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Typography scale */}
            <div>
              <h3
                className={`font-semibold ${t.subheading} mb-3 text-sm sm:text-base`}
              >
                Typography Scale
              </h3>
              <div className="space-y-1.5">
                {d.typeScale.map(
                  (ts: { element: string; rule: string }, i: number) => (
                    <div
                      key={i}
                      className={`rounded-lg ${t.cardBg} border ${t.cardBorder} px-3 py-2`}
                    >
                      <div className={`text-xs ${t.subheading} mb-0.5`}>
                        {ts.element}
                      </div>
                      <span
                        className={`text-xs font-mono ${
                          isDark ? "text-cyan-300" : "text-cyan-700"
                        }`}
                      >
                        {ts.rule}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Animations */}
            <div>
              <h3
                className={`font-semibold ${t.subheading} mb-3 text-sm sm:text-base`}
              >
                Animations
              </h3>
              <div className="space-y-1.5">
                {d.animations.map(
                  (
                    anim: { icon: string; label: string; desc: string },
                    i: number
                  ) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 rounded-lg ${t.cardBg} border ${t.cardBorder} px-3 py-2`}
                    >
                      <span className="text-lg shrink-0">{anim.icon}</span>
                      <div>
                        <div
                          className={`text-xs font-semibold ${t.heading} mb-0.5`}
                        >
                          {anim.label}
                        </div>
                        <p className={`text-xs ${t.muted} leading-relaxed`}>
                          {anim.desc}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
