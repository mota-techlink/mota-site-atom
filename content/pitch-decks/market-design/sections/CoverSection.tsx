"use client";

import React, { useContext } from "react";
import { useContent, PageNavCtx, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER, SECTION_MAP } from "../constants";
import { useDeckTheme } from "../theme";

/** Tooltip for hover descriptions */
function Tip({ text, children }: { text: string; children: React.ReactNode }) {
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";
  return (
    <div className="relative group/tip">
      {children}
      <div className={`pointer-events-none absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-2 px-4 py-3 rounded-xl border text-xl leading-relaxed whitespace-pre-line min-w-[240px] max-w-sm opacity-0 group-hover/tip:opacity-100 transition-opacity duration-200 shadow-xl ${isDark ? "bg-zinc-800 border-white/10 text-white/80" : "bg-[#E2DCF0] border-[#D0C8E4] text-[#37294F]"}`}>
        {text}
        <div className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent ${isDark ? "border-t-zinc-800" : "border-t-[#E2DCF0]"}`} />
      </div>
    </div>
  );
}

export function CoverSection() {
  const c = useContent();
  const d = c.cover;
  const goTo = useContext(PageNavCtx);
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <section id="s-cover" className={PAGE}>
      <div className={PAGE_INNER}>
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${isDark ? "bg-indigo-500/15 border border-indigo-500/25 text-indigo-400" : "bg-indigo-100 border border-indigo-400/30 text-indigo-700"} text-base font-medium mb-6`}>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          {d.badge}
        </div>

        {/* Title */}
        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${t.heading} mb-3`}>
          {d.title}
        </h1>
        <p className={`text-xl sm:text-2xl ${t.body} max-w-2xl mb-10`}>
          {d.subtitle}
        </p>

        {/* Doc References — hover shows description, click jumps to section */}
        {/* Version lookup: single source from nav.versions */}
        {(() => {
          const verMap: Record<string, string> = {};
          for (const v of c.nav.versions) verMap[v.label] = v.ver;
          return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {d.docRefs.map((doc: any, i: number) => (
            <Tip key={i} text={doc.hoverDesc}>
              <button
                onClick={() => {
                  const target = doc.targetSection;
                  if (target && SECTION_MAP[target] != null) goTo(SECTION_MAP[target]);
                }}
                className={`w-full rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200 text-left cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xl font-bold ${t.heading} ${isDark ? "group-hover:text-indigo-300" : "group-hover:text-indigo-600"} transition-colors`}>{doc.label}</span>
                  <span className={`text-base px-2 py-0.5 rounded-full ${isDark ? "bg-indigo-500/15 text-indigo-300" : "bg-indigo-100 text-indigo-700"} font-mono`}>
                    {verMap[doc.label] ?? doc.ver}
                  </span>
                </div>
                <p className={`text-base ${t.body} mb-1`}>{doc.desc}</p>
                <p className={`text-base ${t.muted} font-mono`}>{doc.sections}</p>
                <span className={`block mt-2 text-base ${isDark ? "text-indigo-400/50" : "text-indigo-600"} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  {doc.clickHint} →
                </span>
              </button>
            </Tip>
          ))}
        </div>
          );
        })()}

        {/* Pipeline — hover shows detail, click navigates to section */}
        <h3 className={`text-xl font-semibold ${t.subheading} mb-4`}>{d.pipeline.title}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {d.pipeline.stages.map((s: any, i: number) => (
            <div key={i} className="relative">
              <Tip text={s.hoverDesc}>
                <button
                  onClick={() => {
                    const target = s.targetSection;
                    if (target && SECTION_MAP[target] != null) goTo(SECTION_MAP[target]);
                  }}
                  className={`w-full rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 text-center hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200 cursor-pointer group`}
                >
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <h4 className={`text-xl font-bold ${t.heading} ${isDark ? "group-hover:text-indigo-300" : "group-hover:text-indigo-600"} transition-colors mb-1`}>{s.label}</h4>
                  <p className={`text-base ${t.muted} leading-relaxed`}>{s.desc}</p>
                </button>
              </Tip>
              {i < d.pipeline.stages.length - 1 && (
                <div className={`hidden sm:block absolute top-1/2 -right-2 ${t.muted} text-base`}>→</div>
              )}
            </div>
          ))}
        </div>

        {/* Metrics — hover for description, click to navigate */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {d.metrics.map((m: any, i: number) => (
            <Tip key={i} text={m.hoverDesc}>
              <button
                onClick={() => {
                  const target = m.targetSection;
                  if (target && SECTION_MAP[target] != null) goTo(SECTION_MAP[target]);
                }}
                className={`w-full flex flex-col items-center justify-center rounded-xl ${t.cardBg} border ${t.cardBorder} px-4 py-5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200 cursor-pointer group`}
              >
                <div className="text-3xl mb-2">{m.icon}</div>
                <div className={`text-3xl sm:text-4xl font-bold ${t.heading} ${isDark ? "group-hover:text-indigo-300" : "group-hover:text-indigo-600"} transition-colors`}>{m.value}</div>
                <div className={`text-base ${t.muted} mt-1 ${isDark ? "group-hover:text-indigo-300/60" : "group-hover:text-indigo-600"} transition-colors`}>{m.label}</div>
              </button>
            </Tip>
          ))}
        </div>

        {/* ── Tech Stack — horizontal topology architecture ─────────────── */}
        {(() => {
          const i = c.i18n;
          const z = i.stackZones ?? { user: "User", app: "Application", data: "Data", connApi: "API", connData: "R/W" };

          /* Map stack items by layer key */
          const byKey: Record<string, any> = {};
          const layerKeys: Record<string, string[]> = {
            "数据库": ["db"], "Database": ["db"],
            "后端": ["backend"], "Backend": ["backend"],
            "AI/LLM": ["ai"],
            "爬虫": ["scraper"], "Scraping": ["scraper"],
            "支付": ["pay"], "Payments": ["pay"],
            "前端": ["fe"], "Frontend": ["fe"],
            "部署": ["deploy"], "Deployment": ["deploy"],
          };
          for (const s of i.stack) {
            const keys = layerKeys[s.layer] ?? [];
            for (const k of keys) byKey[k] = s;
          }
          const fe = byKey.fe, deploy = byKey.deploy, backend = byKey.backend;
          const ai = byKey.ai, scraper = byKey.scraper, pay = byKey.pay, db = byKey.db;

          /* Zone styling */
          const zoneBorder = isDark ? "border-white/10" : "border-[#D0C8E4]";
          const zoneBg = isDark ? "bg-white/[0.03]" : "bg-[#E8E3F3]/60";
          const zoneLabel = `text-base font-bold uppercase tracking-wider ${isDark ? "text-white/30" : "text-[#7A6E96]"}`;
          const nodeBorder = isDark ? "border-white/15" : "border-[#C5BAD8]";
          const nodeBg = isDark ? "bg-white/[0.06]" : "bg-[#E2DCF0]";

          /* Node card with hover tooltip */
          const TNode = ({ item, darkAccent, lightAccent }: { item: any; darkAccent: string; lightAccent: string }) => (
            <div className="relative group/tn">
              <div className={`rounded-xl border ${nodeBorder} ${nodeBg} px-4 py-3 text-center transition-all duration-200 hover:scale-[1.03] cursor-pointer`}>
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className={`text-base font-bold ${t.heading} mb-0.5`}>{item.layer}</div>
                <div className={`text-sm font-mono leading-relaxed ${isDark ? darkAccent : lightAccent}`}>{item.tech}</div>
              </div>
              {/* Hover tooltip — detailed description + doc link */}
              {item.desc && (
                <div className={`pointer-events-none group-hover/tn:pointer-events-auto absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 sm:w-80 rounded-xl border p-4 opacity-0 group-hover/tn:opacity-100 transition-all duration-200 delay-75 shadow-xl ${isDark ? "bg-zinc-800 border-white/10" : "bg-[#E2DCF0] border-[#C5BAD8]"}`}>
                  {/* Invisible bridge to keep hover alive across the gap */}
                  <div className="absolute left-0 right-0 top-full h-4" />
                  <p className={`text-base leading-relaxed mb-2.5 ${isDark ? "text-white/75" : "text-[#37294F]"}`}>{item.desc}</p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-lg transition-colors ${isDark ? "bg-teal-500/15 text-teal-300 hover:bg-teal-500/25" : "bg-teal-100 text-teal-700 hover:bg-teal-200"}`}
                    >
                      📄 Docs ↗
                    </a>
                  )}
                  {/* Arrow */}
                  <div className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent ${isDark ? "border-t-zinc-800" : "border-t-[#E2DCF0]"}`} />
                </div>
              )}
            </div>
          );

          /* Horizontal arrow connector */
          const HArrow = ({ label, dashed }: { label: string; dashed?: boolean }) => (
            <div className="flex flex-col items-center justify-center px-1 shrink-0">
              <span className={`text-sm font-mono px-2 py-0.5 rounded-full mb-1 whitespace-nowrap ${isDark ? "bg-teal-500/10 text-teal-300/70" : "bg-teal-100 text-teal-700"}`}>{label}</span>
              <div className="flex items-center">
                <div className={`w-6 sm:w-10 h-0 ${dashed ? "border-t border-dashed" : "border-t-2"} ${isDark ? "border-teal-400/40" : "border-teal-500/50"}`} />
                <div className={`w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-t-transparent border-b-transparent ${isDark ? "border-l-teal-400/50" : "border-l-teal-500/60"}`} />
              </div>
            </div>
          );

          return (
            <div className="mt-10">
              <h3 className={`text-xl font-semibold ${t.subheading} mb-4`}>{i.stackTitle}</h3>

              {/* Horizontal topology — left-to-right flow */}
              <div className="flex items-stretch gap-0 overflow-visible pb-2">
                {/* Zone 1: User Layer */}
                <div className={`rounded-l-xl border ${zoneBorder} ${zoneBg} px-4 py-4 flex flex-col min-w-[140px]`}>
                  <div className={`${zoneLabel} mb-3`}>{z.user}</div>
                  <div className="flex flex-col items-center gap-2 flex-1 justify-center">
                    {fe && <TNode item={fe} darkAccent="text-cyan-300/80" lightAccent="text-cyan-700" />}
                    {/* Small vertical arrow FE → Deploy */}
                    <div className="flex flex-col items-center">
                      <div className={`w-px h-3 ${isDark ? "bg-teal-400/30" : "bg-teal-500/40"}`} />
                      <div className={`w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent ${isDark ? "border-t-teal-400/40" : "border-t-teal-500/50"}`} />
                    </div>
                    {deploy && <TNode item={deploy} darkAccent="text-teal-300/80" lightAccent="text-teal-700" />}
                  </div>
                </div>

                {/* Arrow: User → App */}
                <HArrow label={z.connApi} />

                {/* Zone 2: Application Layer */}
                <div className={`border ${zoneBorder} ${zoneBg} px-4 py-4 flex-1 min-w-[260px]`}>
                  <div className={`${zoneLabel} mb-3`}>{z.app}</div>
                  <div className="flex flex-col items-center gap-2">
                    {backend && <TNode item={backend} darkAccent="text-indigo-300/80" lightAccent="text-indigo-700" />}
                    {/* Dashed fan-out lines from Backend to sub-services */}
                    <svg viewBox="0 0 240 20" className="w-full max-w-[240px] h-5" preserveAspectRatio="xMidYMid meet">
                      <line x1="120" y1="0" x2="30" y2="20" stroke={isDark ? "rgba(94,234,212,0.3)" : "rgba(13,148,136,0.35)"} strokeWidth="1.5" strokeDasharray="4 3" />
                      <line x1="120" y1="0" x2="120" y2="20" stroke={isDark ? "rgba(94,234,212,0.3)" : "rgba(13,148,136,0.35)"} strokeWidth="1.5" strokeDasharray="4 3" />
                      <line x1="120" y1="0" x2="210" y2="20" stroke={isDark ? "rgba(94,234,212,0.3)" : "rgba(13,148,136,0.35)"} strokeWidth="1.5" strokeDasharray="4 3" />
                    </svg>
                    {/* Sub-services row */}
                    <div className="grid grid-cols-3 gap-2 w-full">
                      {ai && <TNode item={ai} darkAccent="text-purple-300/80" lightAccent="text-purple-700" />}
                      {scraper && <TNode item={scraper} darkAccent="text-emerald-300/80" lightAccent="text-emerald-700" />}
                      {pay && <TNode item={pay} darkAccent="text-amber-300/80" lightAccent="text-amber-700" />}
                    </div>
                  </div>
                </div>

                {/* Arrow: App → Data */}
                <HArrow label={z.connData} dashed />

                {/* Zone 3: Data Layer */}
                <div className={`rounded-r-xl border ${zoneBorder} ${zoneBg} px-4 py-4 flex flex-col min-w-[140px]`}>
                  <div className={`${zoneLabel} mb-3`}>{z.data}</div>
                  <div className="flex items-center justify-center flex-1">
                    {db && <TNode item={db} darkAccent="text-cyan-300/80" lightAccent="text-cyan-700" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
