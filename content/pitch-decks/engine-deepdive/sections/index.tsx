"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER, THEME } from "@/components/pitch-deck/deck/constants";
import { useDeckTheme } from "@/components/pitch-deck/deck/theme";

export function OverviewSection() {
  const c = useContent();
  const d = c.overview as Record<string, unknown>;
  const highlights = d.highlights as Array<Record<string, string>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  return (
    <section id="s-overview" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${isDark ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" : "bg-blue-100 border border-blue-400/30 text-blue-700"}`}>
          {d.badge as string}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-xl ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle as string}</p>
        <p className={`text-base ${t.body} leading-relaxed mb-6`}>{d.description as string}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {highlights.map((h, i) => (
            <div key={i} className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5 flex items-start gap-4`}>
              <span className="text-2xl shrink-0">{h.icon}</span>
              <div>
                <h3 className={`text-lg font-semibold ${t.heading} mb-1`}>{h.label}</h3>
                <p className={`text-sm ${t.body} leading-relaxed`}>{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FlowSection() {
  const c = useContent();
  const d = c.flow as Record<string, unknown>;
  const steps = d.steps as Array<Record<string, string>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  return (
    <section id="s-flow" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${isDark ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-emerald-100 border border-emerald-400/30 text-emerald-700"}`}>
          {d.badge as string}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className={`flex items-start gap-4 ${t.cardBg} ${t.cardBorder} rounded-xl border p-4`}>
              <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-base font-bold ${isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-700"}`}>
                {step.step}
              </div>
              <div className="flex-1">
                <div className={`text-lg font-semibold ${t.heading}`}>{step.label}</div>
                <div className={`text-base ${t.body} leading-relaxed mt-1`}>{step.detail}</div>
                <div className={`text-sm font-mono ${t.muted} mt-2 bg-black/10 dark:bg-white/5 inline-block px-2 py-0.5 rounded`}>
                  → {step.output}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PromptFieldsSection() {
  const c = useContent();
  const d = c["prompt-fields"] as Record<string, unknown>;
  const fields = d.fields as Array<Record<string, string>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  return (
    <section id="s-prompt-fields" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${isDark ? "bg-violet-500/10 border border-violet-500/20 text-violet-400" : "bg-violet-100 border border-violet-400/30 text-violet-700"}`}>
          {d.badge as string}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((f, i) => (
            <div key={i} className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4`}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className={`text-base font-semibold ${t.heading} font-mono`}>{f.field}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${t.badgeBg} ${t.badgeText} font-mono`}>{f.type}</span>
              </div>
              <p className={`text-sm ${t.body} leading-relaxed`}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TaskFieldsSection() {
  const c = useContent();
  const d = c["task-fields"] as Record<string, unknown>;
  const fields = d.fields as Array<Record<string, string>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  return (
    <section id="s-task-fields" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${isDark ? "bg-orange-500/10 border border-orange-500/20 text-orange-400" : "bg-orange-100 border border-orange-400/30 text-orange-700"}`}>
          {d.badge as string}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="space-y-3">
          {fields.map((f, i) => (
            <div key={i} className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4 flex items-start gap-3`}>
              <div className="shrink-0 mt-1">
                <span className={`text-sm px-2 py-0.5 rounded font-mono ${isDark ? "bg-white/10 text-white/80" : "bg-black/5 text-black/70"}`}>
                  {f.field}
                </span>
              </div>
              <p className={`text-sm ${t.body} leading-relaxed`}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TriggerSection() {
  const c = useContent();
  const d = c.trigger as Record<string, unknown>;
  const configItems = d.configItems as Array<Record<string, string>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  return (
    <section id="s-trigger" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${isDark ? "bg-rose-500/10 border border-rose-500/20 text-rose-400" : "bg-rose-100 border border-rose-400/30 text-rose-700"}`}>
          {d.badge as string}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-xl ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle as string}</p>

        <div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5 mb-6`}>
          <p className={`text-base ${t.body} leading-relaxed`}>{d.triggerNote as string}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {configItems.map((item, i) => (
            <div key={i} className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5`}>
              <h3 className={`text-lg font-semibold ${t.heading} mb-2`}>{item.label}</h3>
              <p className={`text-sm ${t.body} leading-relaxed`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BackSection() {
  const c = useContent();
  const d = c.back as Record<string, unknown>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  const targetDeck = d.targetDeck as string;

  return (
    <section id="s-back" className={PAGE}>
      <div className={PAGE_INNER}>
        <a
          href={targetDeck}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-medium transition-all cursor-pointer ${isDark ? "bg-white/10 hover:bg-white/15 text-white" : "bg-[#D6CEE8] hover:bg-[#C8BEE0] text-[#1A1230]"}`}
        >
          ← {d.subtitle as string}
        </a>
        <p className={`text-sm ${t.muted} mt-2`}>Ctrl+click 可新标签页打开</p>
      </div>
    </section>
  );
}
