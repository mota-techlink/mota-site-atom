"use client";

import React, { useContext } from "react";
import { PageNavCtx, useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER, SECTION_MAP } from "../constants";
import { useDeckTheme } from "../theme";

function Tip({ text, children }: { text: string; children: React.ReactNode }) {
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative group/tip">
      {children}
      <div
        className={`pointer-events-none absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-2 px-4 py-3 rounded-xl border text-xl leading-relaxed whitespace-pre-line min-w-[240px] max-w-sm opacity-0 group-hover/tip:opacity-100 transition-opacity duration-200 shadow-xl ${
          isDark
            ? "bg-zinc-800 border-white/10 text-white/80"
            : "bg-[#E2DCF0] border-[#D0C8E4] text-[#37294F]"
        }`}
      >
        {text}
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent ${
            isDark ? "border-t-zinc-800" : "border-t-[#E2DCF0]"
          }`}
        />
      </div>
    </div>
  );
}

const LAYER_META: Record<
  string,
  {
    icon: string;
    accentDark: string;
    accentLight: string;
  }
> = {
  Frontend: { icon: "🖥️", accentDark: "text-cyan-300/80", accentLight: "text-cyan-700" },
  Design: { icon: "🎨", accentDark: "text-violet-300/80", accentLight: "text-violet-700" },
  Identity: { icon: "🔐", accentDark: "text-sky-300/80", accentLight: "text-sky-700" },
  Backend: { icon: "⚙️", accentDark: "text-indigo-300/80", accentLight: "text-indigo-700" },
  Orchestration: { icon: "🔄", accentDark: "text-emerald-300/80", accentLight: "text-emerald-700" },
  LLM: { icon: "🧠", accentDark: "text-purple-300/80", accentLight: "text-purple-700" },
  Acquisition: { icon: "📡", accentDark: "text-amber-300/80", accentLight: "text-amber-700" },
  Payments: { icon: "💳", accentDark: "text-rose-300/80", accentLight: "text-rose-700" },
  Data: { icon: "🗄️", accentDark: "text-cyan-300/80", accentLight: "text-cyan-700" },
};

export function CoverSection() {
  const c = useContent();
  const d = c.cover;
  const goTo = useContext(PageNavCtx);
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";

  const byLayer = d.stack.reduce<Record<string, Array<{ name: string; layer: string; desc: string }>>>(
    (acc, item) => {
      (acc[item.layer] ??= []).push(item);
      return acc;
    },
    {}
  );

  const userNodes = ["Frontend", "Design", "Identity"].flatMap((layer) => byLayer[layer] ?? []);
  const appTop = (byLayer.Backend ?? [])[0];
  const appNodes = ["Orchestration", "LLM", "Acquisition", "Payments"].flatMap((layer) => byLayer[layer] ?? []);
  const dataNode = (byLayer.Data ?? [])[0];

  const navigate = (target?: string) => {
    if (target && SECTION_MAP[target] != null) goTo(SECTION_MAP[target]);
  };

  const versionLabelMap: Record<string, string> = {
    Architecture: "ARCH",
    Billing: "BILLING",
  };

  const NodeCard = ({
    item,
  }: {
    item: { name: string; layer: string; desc: string };
  }) => {
    const meta = LAYER_META[item.layer] ?? {
      icon: "🧩",
      accentDark: "text-white/70",
      accentLight: "text-[#4A3D66]",
    };

    return (
      <Tip text={item.desc}>
        <div className="relative group/tn">
          <div
            className={`rounded-xl border ${
              isDark ? "border-white/15 bg-white/[0.06]" : "border-[#C5BAD8] bg-[#E2DCF0]"
            } px-4 py-3 text-center transition-all duration-200 hover:scale-[1.03] cursor-pointer`}
          >
            <div className="text-2xl mb-1">{meta.icon}</div>
            <div className={`text-base font-bold ${t.heading} mb-0.5`}>{item.layer}</div>
            <div className={`text-sm font-mono leading-relaxed ${isDark ? meta.accentDark : meta.accentLight}`}>
              {item.name}
            </div>
          </div>
        </div>
      </Tip>
    );
  };

  const HArrow = ({ label, dashed }: { label: string; dashed?: boolean }) => (
    <div className="flex flex-col items-center justify-center px-1 shrink-0">
      <span
        className={`text-sm font-mono px-2 py-0.5 rounded-full mb-1 whitespace-nowrap ${
          isDark ? "bg-teal-500/10 text-teal-300/70" : "bg-teal-100 text-teal-700"
        }`}
      >
        {label}
      </span>
      <div className="flex items-center">
        <div
          className={`w-6 sm:w-10 h-0 ${
            dashed ? "border-t border-dashed" : "border-t-2"
          } ${isDark ? "border-teal-400/40" : "border-teal-500/50"}`}
        />
        <div
          className={`w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-t-transparent border-b-transparent ${
            isDark ? "border-l-teal-400/50" : "border-l-teal-500/60"
          }`}
        />
      </div>
    </div>
  );

  return (
    <section id="s-cover" className={PAGE}>
      <div className={PAGE_INNER}>
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
            isDark
              ? "bg-indigo-500/15 border border-indigo-500/25 text-indigo-400"
              : "bg-indigo-100 border border-indigo-400/30 text-indigo-700"
          } text-base font-medium mb-6`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          {d.badge}
        </div>

        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${t.heading} mb-3`}>{d.title}</h1>
        <p className={`text-xl sm:text-2xl ${t.body} max-w-3xl mb-10`}>{d.subtitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {d.docRefs.map((doc: any, i: number) => (
            <Tip key={i} text={doc.hoverDesc}>
              <button
                onClick={() => navigate(doc.targetSection)}
                className={`w-full rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200 text-left cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-2 gap-3">
                  <span
                    className={`text-xl font-bold ${t.heading} ${
                      isDark ? "group-hover:text-indigo-300" : "group-hover:text-indigo-600"
                    } transition-colors`}
                  >
                    {doc.label}
                  </span>
                  <span
                    className={`text-base px-2 py-0.5 rounded-full ${
                      isDark ? "bg-indigo-500/15 text-indigo-300" : "bg-indigo-100 text-indigo-700"
                    } font-mono shrink-0`}
                  >
                    {c.nav.versions.find((v: any) => v.label === (versionLabelMap[doc.label] ?? doc.label))?.ver ?? doc.sections}
                  </span>
                </div>
                <p className={`text-base ${t.body} mb-1`}>{doc.desc}</p>
                <p className={`text-base ${t.muted} font-mono`}>{doc.sections}</p>
                <span
                  className={`block mt-2 text-base ${
                    isDark ? "text-indigo-400/50" : "text-indigo-600"
                  } opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  {doc.clickHint} →
                </span>
              </button>
            </Tip>
          ))}
        </div>

        <h3 className={`text-xl font-semibold ${t.subheading} mb-4`}>{d.pipeline.title}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-10">
          {d.pipeline.stages.map((stage: any, i: number) => (
            <Tip key={i} text={stage.hoverDesc}>
              <button
                onClick={() => navigate(stage.targetSection)}
                className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 text-center hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200 cursor-pointer group`}
              >
                <div className="text-3xl mb-2">{stage.icon}</div>
                <h4
                  className={`text-xl font-bold ${t.heading} ${
                    isDark ? "group-hover:text-indigo-300" : "group-hover:text-indigo-600"
                  } transition-colors mb-1`}
                >
                  {stage.label}
                </h4>
                <p className={`text-base ${t.muted} leading-relaxed`}>{stage.desc}</p>
              </button>
            </Tip>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {d.metrics.map((metric: any, i: number) => (
            <Tip key={i} text={metric.hoverDesc}>
              <button
                onClick={() => navigate(metric.targetSection)}
                className={`w-full flex flex-col items-center justify-center rounded-xl ${t.cardBg} border ${t.cardBorder} px-4 py-5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all duration-200 cursor-pointer group`}
              >
                <div className="text-3xl mb-2">{metric.icon}</div>
                <div
                  className={`text-3xl sm:text-4xl font-bold ${t.heading} ${
                    isDark ? "group-hover:text-indigo-300" : "group-hover:text-indigo-600"
                  } transition-colors`}
                >
                  {metric.value}
                </div>
                <div
                  className={`text-base ${t.muted} mt-1 ${
                    isDark ? "group-hover:text-indigo-300/60" : "group-hover:text-indigo-600"
                  } transition-colors`}
                >
                  {metric.label}
                </div>
              </button>
            </Tip>
          ))}
        </div>

        <div className="mt-10">
          <h3 className={`text-xl font-semibold ${t.subheading} mb-4`}>{d.stackTitle}</h3>

          <div className="flex items-stretch gap-0 overflow-x-auto pb-2">
            <div
              className={`rounded-l-xl border ${
                isDark ? "border-white/10 bg-white/[0.03]" : "border-[#D0C8E4] bg-[#E8E3F3]/60"
              } px-4 py-4 flex flex-col min-w-[200px]`}
            >
              <div
                className={`text-base font-bold uppercase tracking-wider ${
                  isDark ? "text-white/30" : "text-[#7A6E96]"
                } mb-3`}
              >
                Experience Layer
              </div>
              <div className="flex flex-col items-center gap-2 flex-1 justify-center">
                {userNodes.map((item) => (
                  <React.Fragment key={`${item.layer}-${item.name}`}>
                    <NodeCard item={item} />
                    {item !== userNodes[userNodes.length - 1] && (
                      <div className="flex flex-col items-center">
                        <div className={`w-px h-3 ${isDark ? "bg-teal-400/30" : "bg-teal-500/40"}`} />
                        <div
                          className={`w-0 h-0 border-l-[4px] border-r-[4px] border-t-[5px] border-l-transparent border-r-transparent ${
                            isDark ? "border-t-teal-400/40" : "border-t-teal-500/50"
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <HArrow label="UI / Auth" />

            <div
              className={`border ${
                isDark ? "border-white/10 bg-white/[0.03]" : "border-[#D0C8E4] bg-[#E8E3F3]/60"
              } px-4 py-4 flex-1 min-w-[420px]`}
            >
              <div
                className={`text-base font-bold uppercase tracking-wider ${
                  isDark ? "text-white/30" : "text-[#7A6E96]"
                } mb-3`}
              >
                Application Services
              </div>
              <div className="flex flex-col items-center gap-2">
                {appTop && <NodeCard item={appTop} />}
                <svg viewBox="0 0 320 20" className="w-full max-w-[320px] h-5" preserveAspectRatio="xMidYMid meet">
                  <line
                    x1="160"
                    y1="0"
                    x2="40"
                    y2="20"
                    stroke={isDark ? "rgba(94,234,212,0.3)" : "rgba(13,148,136,0.35)"}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <line
                    x1="160"
                    y1="0"
                    x2="120"
                    y2="20"
                    stroke={isDark ? "rgba(94,234,212,0.3)" : "rgba(13,148,136,0.35)"}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <line
                    x1="160"
                    y1="0"
                    x2="200"
                    y2="20"
                    stroke={isDark ? "rgba(94,234,212,0.3)" : "rgba(13,148,136,0.35)"}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <line
                    x1="160"
                    y1="0"
                    x2="280"
                    y2="20"
                    stroke={isDark ? "rgba(94,234,212,0.3)" : "rgba(13,148,136,0.35)"}
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                </svg>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full">
                  {appNodes.map((item) => (
                    <NodeCard key={`${item.layer}-${item.name}`} item={item} />
                  ))}
                </div>
              </div>
            </div>

            <HArrow label="State / Jobs" dashed />

            <div
              className={`rounded-r-xl border ${
                isDark ? "border-white/10 bg-white/[0.03]" : "border-[#D0C8E4] bg-[#E8E3F3]/60"
              } px-4 py-4 flex flex-col min-w-[180px]`}
            >
              <div
                className={`text-base font-bold uppercase tracking-wider ${
                  isDark ? "text-white/30" : "text-[#7A6E96]"
                } mb-3`}
              >
                Data Layer
              </div>
              <div className="flex items-center justify-center flex-1">
                {dataNode && <NodeCard item={dataNode} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
