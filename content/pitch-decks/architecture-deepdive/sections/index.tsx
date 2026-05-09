"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER, THEME } from "../constants";
import { useDeckTheme } from "../theme";

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
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${isDark ? "bg-purple-500/10 border border-purple-500/20 text-purple-400" : "bg-purple-100 border border-purple-400/30 text-purple-700"}`}>
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

export function ProductArchSection() {
  const c = useContent();
  const d = c["product-arch"] as Record<string, unknown>;
  const layers = d.layers as Array<Record<string, unknown>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  return (
    <section id="s-product-arch" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${isDark ? "bg-violet-500/10 border border-violet-500/20 text-violet-400" : "bg-violet-100 border border-violet-400/30 text-violet-700"}`}>
          {d.badge as string}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {layers.map((layer, i) => {
            const components = layer.components as string[];
            const layerNames = ["底", "中", "顶"];
            return (
              <div key={i} className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-6 flex flex-col`}>
                <div className={`text-xs font-mono mb-1 ${t.muted}`}>
                  Layer {i + 1} · {layer.layer as string}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {i < 2 && (
                    <span className={`text-xs px-2 py-0.5 rounded ${isDark ? "bg-white/5 text-white/50" : "bg-black/5 text-black/50"}`}>
                      {layerNames[i]}层
                    </span>
                  )}
                  <h3 className={`text-xl font-bold ${t.heading}`}>{layer.name as string}</h3>
                </div>
                <p className={`text-sm ${t.body} leading-relaxed mb-4 flex-1`}>{layer.desc as string}</p>
                <div className="flex flex-wrap gap-1.5">
                  {components.map((comp, j) => (
                    <span key={j} className={`text-xs font-mono px-2 py-0.5 rounded ${t.badgeBg} ${t.badgeText}`}>
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PortalArchSection() {
  const c = useContent();
  const d = c["portal-arch"] as Record<string, unknown>;
  const portals = d.portals as Array<Record<string, unknown>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  return (
    <section id="s-portal-arch" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${isDark ? "bg-rose-500/10 border border-rose-500/20 text-rose-400" : "bg-rose-100 border border-rose-400/30 text-rose-700"}`}>
          {d.badge as string}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {portals.map((p, i) => {
            const surfaces = p.surfaces as string[];
            const portalIcons = ["🌐", "💻", "⚙️"];
            return (
              <div key={i} className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-6`}>
                <div className="text-3xl mb-3">{portalIcons[i]}</div>
                <h3 className={`text-xl font-bold ${t.heading} mb-1`}>{p.portal as string}</h3>
                <div className={`text-xs ${t.muted} mb-1`}>{p.audience as string}</div>
                <p className={`text-sm ${t.body} leading-relaxed mb-4`}>{p.goal as string}</p>
                <div className="space-y-1">
                  {surfaces.map((s, j) => (
                    <div key={j} className={`text-xs ${t.muted} flex items-center gap-1`}>
                      <span className="shrink-0">·</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
