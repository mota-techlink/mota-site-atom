"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";

export function ReplySection() {
  const c = useContent();
  const d = c.reply;
  const t = useThemeTokens();

  return (
    <section id="s-reply" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className={`text-2xl sm:text-3xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-base ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* Prompt rules */}
        <div className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 mb-8`}>
          <h3 className={`text-base font-semibold ${t.body} mb-3`}>Prompt Rules</h3>
          <ol className="space-y-1.5">
            {d.promptRules.map((r: string, i: number) => (
              <li key={i} className={`text-xs ${t.body} flex items-start gap-2`}>
                <span className="text-xs text-indigo-400 font-mono mt-0.5">{i + 1}.</span>
                {r}
              </li>
            ))}
          </ol>
        </div>

        {/* Channels */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-3`}>{d.channelsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {d.channels.map((ch: any, i: number) => (
            <div key={i} className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 hover:border-white/15 transition-colors`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{ch.icon}</span>
                <h4 className={`text-sm font-bold ${t.heading}`}>{ch.name}</h4>
                <span className={`text-xs ${t.muted} font-mono ml-auto`}>{ch.ref}</span>
              </div>
              <p className={`text-xs ${t.body} leading-relaxed`}>{ch.desc}</p>
            </div>
          ))}
        </div>

        {/* Quality control */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-3`}>{d.qualityTitle}</h3>
        <div className={`rounded-xl ${t.cardBg} border ${t.cardBorder} overflow-hidden`}>
          <table className="w-full text-xs">
            <tbody>
              {d.quality.map((q: any, i: number) => (
                <tr key={i} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                  <td className={`px-4 py-2.5 ${t.body} font-medium`}>{q.metric}</td>
                  <td className="px-4 py-2.5 text-indigo-300 font-mono text-xs">{q.value}</td>
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
