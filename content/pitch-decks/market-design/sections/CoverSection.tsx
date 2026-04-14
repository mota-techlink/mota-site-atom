"use client";

import React, { useContext } from "react";
import { useContent, PageNavCtx } from "../hooks";
import { PAGE, PAGE_INNER, SECTION_MAP } from "../constants";

/** Tooltip for hover descriptions */
function Tip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div className="relative group/tip">
      {children}
      <div className="pointer-events-none absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-2 px-4 py-3 rounded-xl bg-zinc-800 border border-white/10 text-sm leading-relaxed text-white/80 whitespace-pre-line min-w-[240px] max-w-sm opacity-0 group-hover/tip:opacity-100 transition-opacity duration-200 shadow-xl">
        {text}
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-zinc-800" />
      </div>
    </div>
  );
}

export function CoverSection() {
  const c = useContent();
  const d = c.cover;
  const goTo = useContext(PageNavCtx);

  return (
    <section id="s-cover" className={PAGE}>
      <div className={PAGE_INNER}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          {d.badge}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
          {d.title}
        </h1>
        <p className="text-base sm:text-lg text-white/50 max-w-2xl mb-10">
          {d.subtitle}
        </p>

        {/* Doc References — hover shows description, click jumps to section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {d.docRefs.map((doc: any, i: number) => (
            <Tip key={i} text={doc.hoverDesc}>
              <button
                onClick={() => {
                  const target = doc.targetSection;
                  if (target && SECTION_MAP[target] != null) goTo(SECTION_MAP[target]);
                }}
                className="w-full rounded-xl bg-white/5 border border-white/8 p-4 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200 text-left cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{doc.label}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-mono">
                    {doc.ver}
                  </span>
                </div>
                <p className="text-xs text-white/40 mb-1">{doc.desc}</p>
                <p className="text-xs text-white/25 font-mono">{doc.sections}</p>
                <span className="block mt-2 text-xs text-indigo-400/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  {doc.clickHint} →
                </span>
              </button>
            </Tip>
          ))}
        </div>

        {/* Pipeline — hover shows detail, click navigates to section */}
        <h3 className="text-base font-semibold text-white/60 mb-4">{d.pipeline.title}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {d.pipeline.stages.map((s: any, i: number) => (
            <div key={i} className="relative">
              <Tip text={s.hoverDesc}>
                <button
                  onClick={() => {
                    const target = s.targetSection;
                    if (target && SECTION_MAP[target] != null) goTo(SECTION_MAP[target]);
                  }}
                  className="w-full rounded-xl bg-gradient-to-br from-white/5 to-white/2 border border-white/8 p-4 text-center hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200 cursor-pointer group"
                >
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">{s.label}</h4>
                  <p className="text-xs text-white/35 leading-relaxed">{s.desc}</p>
                </button>
              </Tip>
              {i < d.pipeline.stages.length - 1 && (
                <div className="hidden sm:block absolute top-1/2 -right-2 text-white/15 text-xs">→</div>
              )}
            </div>
          ))}
        </div>

        {/* Metrics — hover for description, click to navigate */}
        <div className="grid grid-cols-4 gap-4">
          {d.metrics.map((m: any, i: number) => (
            <Tip key={i} text={m.hoverDesc}>
              <button
                onClick={() => {
                  const target = m.targetSection;
                  if (target && SECTION_MAP[target] != null) goTo(SECTION_MAP[target]);
                }}
                className="text-center px-2 py-3 rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer group"
              >
                <div className="text-2xl sm:text-3xl font-bold text-white group-hover:text-indigo-300 transition-colors">{m.value}</div>
                <div className="text-xs text-white/30 mt-1 group-hover:text-white/50 transition-colors">{m.label}</div>
              </button>
            </Tip>
          ))}
        </div>
      </div>
    </section>
  );
}
