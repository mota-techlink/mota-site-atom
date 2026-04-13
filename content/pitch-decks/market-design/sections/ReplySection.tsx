"use client";

import React from "react";
import { useContent } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";

export function ReplySection() {
  const c = useContent();
  const d = c.reply;

  return (
    <section id="s-reply" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{d.title}</h2>
        <p className="text-sm text-white/40 mb-8 max-w-2xl">{d.subtitle}</p>

        {/* Prompt rules */}
        <div className="rounded-xl bg-white/5 border border-white/8 p-4 mb-8">
          <h3 className="text-xs font-semibold text-white/50 mb-3">Prompt Rules</h3>
          <ol className="space-y-1.5">
            {d.promptRules.map((r: string, i: number) => (
              <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                <span className="text-[10px] text-indigo-400 font-mono mt-0.5">{i + 1}.</span>
                {r}
              </li>
            ))}
          </ol>
        </div>

        {/* Channels */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.channelsTitle}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {d.channels.map((ch: any, i: number) => (
            <div key={i} className="rounded-xl bg-white/5 border border-white/8 p-4 hover:border-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{ch.icon}</span>
                <h4 className="text-sm font-bold text-white">{ch.name}</h4>
                <span className="text-[9px] text-white/20 font-mono ml-auto">{ch.ref}</span>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed">{ch.desc}</p>
            </div>
          ))}
        </div>

        {/* Quality control */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.qualityTitle}</h3>
        <div className="rounded-xl bg-white/5 border border-white/8 overflow-hidden">
          <table className="w-full text-xs">
            <tbody>
              {d.quality.map((q: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-2.5 text-white/60 font-medium">{q.metric}</td>
                  <td className="px-4 py-2.5 text-indigo-300 font-mono text-[11px]">{q.value}</td>
                  <td className="px-4 py-2.5 text-white/35">{q.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
