"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

export function WorkflowSection() {
  const c = useContent();
  const d = c.workflow;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-workflow" className={PAGE}>
      <div className={PAGE_INNER}>
        {/* Badge */}
        <div
          className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4 ${
            isDark
              ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
              : "bg-indigo-100 border border-indigo-400/30 text-indigo-700"
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

        {/* Steps timeline */}
        <div className="space-y-3 mb-10">
          {d.steps.map(
            (
              step: { icon: string; label: string; desc: string },
              i: number
            ) => (
              <div key={i} className="flex gap-4">
                {/* Connector */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                      isDark
                        ? "bg-indigo-500/15 border border-indigo-500/30"
                        : "bg-indigo-100 border border-indigo-300/60"
                    }`}
                  >
                    {step.icon}
                  </div>
                  {i < d.steps.length - 1 && (
                    <div
                      className={`w-px flex-1 min-h-[1.5rem] mt-1 ${
                        isDark ? "bg-white/20" : "bg-[#D0C8E4]"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-3 flex-1">
                  <h3
                    className={`font-semibold ${t.heading} mb-1 text-sm sm:text-base`}
                  >
                    {step.label}
                  </h3>
                  <p className={`text-xs sm:text-sm ${t.body} leading-relaxed`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* File generation order */}
          <div>
            <h3
              className={`font-semibold ${t.subheading} mb-3 text-sm sm:text-base`}
            >
              File Generation Order
            </h3>
            <div
              className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4`}
            >
              <ol className="space-y-1.5">
                {d.fileOrder.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono ${t.muted} w-4 text-right shrink-0`}
                    >
                      {i + 1}.
                    </span>
                    <span
                      className={`text-xs font-mono ${
                        isDark ? "text-indigo-300" : "text-indigo-700"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Example invocation */}
          <div>
            <h3
              className={`font-semibold ${t.subheading} mb-3 text-sm sm:text-base`}
            >
              Example Invocation
            </h3>
            <div
              className={`rounded-xl border ${t.cardBorder} overflow-hidden`}
            >
              <div
                className={`flex items-center gap-1.5 px-3 py-2 border-b ${t.divider} ${isDark ? "bg-[#141626]" : t.cardBg} text-xs font-mono ${t.subheading}`}
              >
                <span>●</span>
                <span>GitHub Copilot Chat</span>
              </div>
              <pre
                className={`p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap ${
                  isDark ? "bg-[#0a0c16] text-emerald-300" : "bg-[#F5F2FF] text-emerald-800"
                }`}
              >
                {d.invocation}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
