"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";

export function ReplySection() {
  const c = useContent();
  const d = c.reply;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-reply" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-sky-500/10 border border-sky-500/20 text-sky-400" : "bg-sky-100 border border-sky-400/30 text-sky-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* Prompt rules */}
        <div className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 mb-8`}>
          <h3 className={`text-xl font-semibold ${t.body} mb-3`}>Prompt Rules</h3>
          <ol className="space-y-1.5">
            {d.promptRules.map((r: string, i: number) => (
              <li key={i} className={`text-base ${t.body} flex items-start gap-2`}>
                <span className={`text-base ${isDark ? "text-indigo-400" : "text-indigo-700"} font-mono mt-0.5`}>{i + 1}.</span>
                {r}
              </li>
            ))}
          </ol>
        </div>

        {/* Channels */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.channelsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {d.channels.map((ch: any, i: number) => (
            <div key={i} className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 hover:border-indigo-500/25 transition-colors`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{ch.icon}</span>
                <h4 className={`text-xl font-bold ${t.heading}`}>{ch.name}</h4>
                <span className={`text-base ${t.muted} font-mono ml-auto`}>{ch.ref}</span>
              </div>
              <p className={`text-base ${t.body} leading-relaxed`}>{ch.desc}</p>
            </div>
          ))}
        </div>

        {/* Quality control */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-3`}>{d.qualityTitle}</h3>
        <div className={`rounded-xl ${t.cardBg} border ${t.cardBorder} overflow-hidden`}>
          <table className="w-full text-base">
            <tbody>
              {d.quality.map((q: any, i: number) => (
                <tr key={i} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                  <td className={`px-4 py-2.5 ${t.body} font-medium`}>{q.metric}</td>
                  <td className={`px-4 py-2.5 ${isDark ? "text-indigo-300" : "text-indigo-700"} font-mono text-base`}>{q.value}</td>
                  <td className={`px-4 py-2.5 ${t.muted}`}>{q.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
