"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

export function PartnersSection() {
  const c = useContent();
  const d = c.partners;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-partners" className={PAGE}>
      <div className={PAGE_INNER}>
        <span
          className={`inline-block px-3 py-1 rounded-full ${
            isDark
              ? "bg-teal-500/10 border border-teal-500/20 text-teal-400"
              : "bg-teal-100 border border-teal-400/30 text-teal-700"
          } text-base font-medium mb-4`}
        >
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-3xl`}>{d.subtitle}</p>

        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.programsTitle}</h3>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
          {d.programs.map((program: any, i: number) => (
            <div key={i} className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5`}>
              <h4 className={`text-2xl font-bold ${t.heading} mb-3`}>{program.name}</h4>
              <div className="space-y-2 text-base">
                <div>
                  <span className={t.muted}>Target:</span> <span className={t.body}>{program.target}</span>
                </div>
                <div>
                  <span className={t.muted}>Compensation:</span> <span className={t.body}>{program.compensation}</span>
                </div>
                <div>
                  <span className={t.muted}>Flow:</span> <span className={t.body}>{program.flow}</span>
                </div>
                <div>
                  <span className={t.muted}>Best for:</span> <span className={t.body}>{program.fit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.matchingTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 mb-8">
          {d.matching.map((factor: any, i: number) => (
            <div
              key={i}
              className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 hover:border-teal-500/25 hover:bg-teal-500/5 transition-all`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <h4 className={`text-base font-bold ${t.heading}`}>{factor.factor}</h4>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-mono ${
                    isDark ? "bg-teal-500/10 text-teal-300" : "bg-teal-100 text-teal-700"
                  }`}
                >
                  {factor.weight}
                </span>
              </div>
              <p className={`text-base ${t.body}`}>{factor.desc}</p>
            </div>
          ))}
        </div>

        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.aiStagesTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
          {d.aiStages.map((stage: any, i: number) => (
            <div
              key={i}
              className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 text-center hover:border-teal-500/25 hover:bg-teal-500/5 transition-all`}
            >
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-base font-bold mb-3 ${
                  isDark ? "bg-teal-500/15 text-teal-300" : "bg-teal-100 text-teal-700"
                }`}
              >
                {stage.stage}
              </div>
              <div className={`text-xl font-bold ${t.heading} mb-2`}>{stage.label}</div>
              <div className={`text-base ${t.body} leading-relaxed`}>{stage.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
