"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { Collapsible } from "./_shared";

export function ScheduleSection() {
  const c = useContent();
  const d = c.schedule;
  const t = useThemeTokens();

  return (
    <section id="s-schedule" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className={`text-2xl sm:text-3xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-base ${t.subheading} mb-8 max-w-2xl`}>{d.subtitle}</p>

        {/* Schedule table */}
        <div className="mb-6">
          <Collapsible title={d.schedTitle} badge={<span className={`text-xs ${t.muted} font-mono`}>{d.schedules.length} tasks</span>}>
            <div className="overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className={`border-b ${t.cardBorder} ${t.thText}`}>
                    <th className="text-left px-4 py-2.5 font-medium">Task</th>
                    <th className="text-left px-4 py-2.5 font-medium">Frequency</th>
                    <th className="text-left px-4 py-2.5 font-medium">Trigger</th>
                  </tr>
                </thead>
                <tbody>
                  {d.schedules.map((r: any, i: number) => (
                    <tr key={i} className={`border-b ${t.trBorder} ${t.trHover} transition-colors`}>
                      <td className={`px-4 py-2 ${t.body}`}>{r.task}</td>
                      <td className="px-4 py-2 text-amber-300/60 font-mono text-xs">{r.freq}</td>
                      <td className={`px-4 py-2 ${t.body}`}>{r.trigger}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>
        </div>

        {/* CLI commands */}
        <h3 className={`text-base font-semibold ${t.subheading} mb-3`}>{d.cliTitle}</h3>
        <div className={`rounded-xl bg-black/40 border ${t.cardBorder} p-4 font-mono text-xs`}>
          {d.cliCommands.map((cmd: any, i: number) => (
            <div key={i} className="mb-2 last:mb-0">
              <span className="text-emerald-400/50">$</span>{" "}
              <span className={t.body}>{cmd.cmd}</span>
              <span className={`${t.muted} ml-4`}># {cmd.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
