"use client";

import React from "react";
import { useContent } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";

export function ScheduleSection() {
  const c = useContent();
  const d = c.schedule;

  return (
    <section id="s-schedule" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
          {d.badge}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{d.title}</h2>
        <p className="text-sm text-white/40 mb-8 max-w-2xl">{d.subtitle}</p>

        {/* Schedule table */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.schedTitle}</h3>
        <div className="rounded-xl bg-white/5 border border-white/8 overflow-hidden mb-8">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/8 text-white/30">
                <th className="text-left px-4 py-2.5 font-medium">Task</th>
                <th className="text-left px-4 py-2.5 font-medium">Frequency</th>
                <th className="text-left px-4 py-2.5 font-medium">Trigger</th>
              </tr>
            </thead>
            <tbody>
              {d.schedules.map((r: any, i: number) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-2 text-white/60">{r.task}</td>
                  <td className="px-4 py-2 text-amber-300/60 font-mono text-[10px]">{r.freq}</td>
                  <td className="px-4 py-2 text-white/40">{r.trigger}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CLI commands */}
        <h3 className="text-sm font-semibold text-white/60 mb-3">{d.cliTitle}</h3>
        <div className="rounded-xl bg-black/40 border border-white/8 p-4 font-mono text-[11px]">
          {d.cliCommands.map((cmd: any, i: number) => (
            <div key={i} className="mb-2 last:mb-0">
              <span className="text-emerald-400/50">$</span>{" "}
              <span className="text-white/60">{cmd.cmd}</span>
              <span className="text-white/20 ml-4"># {cmd.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
