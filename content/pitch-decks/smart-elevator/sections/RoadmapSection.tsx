"use client";
import React from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

export function RoadmapSection() {
  const c = useContent();
  const r = c.roadmap;
  return (
    <section id="s-roadmap" className={`${SECTION} bg-d-bg2 relative`}>
      <DynamicBackground accent="indigo" brightness={1.2} count={12} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-d-indigo text-xs sm:text-sm font-medium mb-2">{r.badge}</span>
          <h2 className="mi-child text-d-fg font-bold mb-2">{r.title}</h2>
        </div>
        <div className="space-y-3">
          {r.items.map((item: any, i: number) => (
            <div key={i} className="mi-child flex items-start gap-4 rounded-xl bg-d-fg/5 border border-d-indigo/15 p-4 sm:p-5">
              <div className="min-w-[4rem] text-d-indigo font-bold text-xs sm:text-sm shrink-0 pt-0.5">{item.week}</div>
              <div>
                <div className="text-d-fg font-semibold text-sm sm:text-base mb-0.5">{item.title}</div>
                <div className="text-d-fg/55 text-xs sm:text-sm">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
