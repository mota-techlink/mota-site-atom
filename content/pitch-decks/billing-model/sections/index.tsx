"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER, THEME } from "@/components/pitch-deck/deck/constants";
import { useDeckTheme } from "@/components/pitch-deck/deck/theme";
import { Collapsible } from "@/components/pitch-deck/deck/shared-sections";

export function OverviewSection() {
  const c = useContent();
  const d = c.overview as Record<string, unknown>;
  const principles = d.principles as Array<Record<string, string>>;
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
        <p className={`text-xl ${t.subheading} mb-8 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {principles.map((p, i) => (
            <div key={i} className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5 flex items-start gap-4`}>
              <span className="text-2xl shrink-0">{p.icon}</span>
              <div>
                <h3 className={`text-lg font-semibold ${t.heading} mb-1`}>{p.label}</h3>
                <p className={`text-base ${t.body} leading-relaxed`}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TierSystemSection() {
  const c = useContent();
  const d = c["tier-system"] as Record<string, unknown>;
  const sub = d.subscription as Record<string, unknown>;
  const rep = d.report as Record<string, unknown>;
  const out = d.outreach as Record<string, unknown>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];

  return (
    <section id="s-tier-system" className={PAGE}>
      <div className={PAGE_INNER}>
        <h2 className={`text-2xl sm:text-3xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-lg ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5`}>
            <h3 className={`text-xl font-semibold ${t.heading} mb-2`}>📋 Subscription</h3>
            <p className={`text-sm ${t.body} mb-3`}>{sub.summary as string}</p>
            <div className="flex flex-wrap gap-2">
              {(sub.levels as string[]).map((l, i) => (
                <span key={i} className={`text-xs px-2 py-1 rounded ${t.badgeBg} ${t.badgeText}`}>{l}</span>
              ))}
            </div>
          </div>
          <div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5`}>
            <h3 className={`text-xl font-semibold ${t.heading} mb-2`}>📘 Report</h3>
            <p className={`text-sm ${t.body} mb-3`}>{rep.summary as string}</p>
            <div className="flex flex-wrap gap-2">
              {(rep.levels as string[]).map((l, i) => (
                <span key={i} className={`text-xs px-2 py-1 rounded ${t.badgeBg} ${t.badgeText}`}>{l}</span>
              ))}
            </div>
          </div>
          <div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5`}>
            <h3 className={`text-xl font-semibold ${t.heading} mb-2`}>💬 Outreach</h3>
            <p className={`text-sm ${t.body} mb-3`}>{out.summary as string}</p>
            <p className={`text-xs ${t.muted}`}>{out.description as string}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function X402Section() {
  const c = useContent();
  const d = c.x402 as Record<string, unknown>;
  const flow = d.flow as Array<Record<string, string>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  return (
    <section id="s-x402" className={PAGE}>
      <div className={PAGE_INNER}>
        <h2 className={`text-2xl sm:text-3xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-lg ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="space-y-3 mb-6">
          {flow.map((step, i) => (
            <div key={i} className={`flex items-start gap-4 ${t.cardBg} ${t.cardBorder} rounded-xl border p-4`}>
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${isDark ? "bg-indigo-500/20 text-indigo-400" : "bg-indigo-100 text-indigo-700"}`}>
                {step.step}
              </div>
              <div>
                <div className={`text-base font-semibold ${t.heading}`}>{step.action}</div>
                <div className={`text-sm ${t.body}`}>{step.detail}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5`}>
          <p className={`text-sm ${t.body} leading-relaxed`}>{d.creditSystem as string}</p>
        </div>
      </div>
    </section>
  );
}

export function PlatformCommissionSection() {
  const c = useContent();
  const d = c["platform-commission"] as Record<string, unknown>;
  const tiers = d.tiers as Array<Record<string, string>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  return (
    <section id="s-platform-commission" className={PAGE}>
      <div className={PAGE_INNER}>
        <h2 className={`text-2xl sm:text-3xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-lg ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${t.body}`}>
            <thead>
              <tr className={`border-b ${t.trBorder}`}>
                <th className={`text-left py-3 px-4 ${t.thText}`}>Tier</th>
                <th className={`text-left py-3 px-4 ${t.thText}`}>倍率</th>
                <th className={`text-left py-3 px-4 ${t.thText}`}>平台</th>
                <th className={`text-left py-3 px-4 ${t.thText}`}>成本原因</th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier, i) => (
                <tr key={i} className={`border-b ${t.trBorder} ${t.trHover ?? ""}`}>
                  <td className={`py-3 px-4 font-medium ${t.heading}`}>{tier.tier}</td>
                  <td className="py-3 px-4 font-mono">{tier.multiplier}x</td>
                  <td className="py-3 px-4">{tier.platforms}</td>
                  <td className={`py-3 px-4 ${t.muted}`}>{tier.costReason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function QaBillingSection() {
  const c = useContent();
  const d = c["qa-billing"] as Record<string, unknown>;
  const types = d.adjustTypes as Array<Record<string, string>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];

  return (
    <section id="s-qa-billing" className={PAGE}>
      <div className={PAGE_INNER}>
        <h2 className={`text-2xl sm:text-3xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-lg ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {types.map((adj, i) => (
            <div key={i} className={`rounded-xl ${t.cardBg} border ${t.cardBorder} p-4`}>
              <div className={`text-base font-semibold ${t.heading} mb-1`}>{adj.type}</div>
              <div className={`text-sm ${t.body}`}>{adj.desc}</div>
            </div>
          ))}
        </div>

        <div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5`}>
          <p className={`text-sm ${t.body} leading-relaxed`}>{d.rules as string}</p>
        </div>
      </div>
    </section>
  );
}

export function SettlementSection() {
  const c = useContent();
  const d = c.settlement as Record<string, unknown>;
  const methods = d.methods as Array<Record<string, string>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];

  return (
    <section id="s-settlement" className={PAGE}>
      <div className={PAGE_INNER}>
        <h2 className={`text-2xl sm:text-3xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-lg ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="space-y-3">
          {methods.map((m, i) => (
            <div key={i} className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5`}>
              <h3 className={`text-lg font-semibold ${t.heading} mb-2`}>{m.name}</h3>
              <p className={`text-sm ${t.body} leading-relaxed`}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AdjustmentSection() {
  const c = useContent();
  const d = c.adjustment as Record<string, unknown>;
  const fields = d.auditFields as string[];
  const { theme } = useDeckTheme();
  const t = THEME[theme];

  return (
    <section id="s-adjustment" className={PAGE}>
      <div className={PAGE_INNER}>
        <h2 className={`text-2xl sm:text-3xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-lg ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle as string}</p>

        <div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5 mb-4`}>
          <div className={`text-sm font-medium ${t.subheading} mb-2`}>审计字段</div>
          <div className="flex flex-wrap gap-2">
            {fields.map((f, i) => (
              <span key={i} className={`text-xs px-2 py-1 rounded font-mono ${t.badgeBg} ${t.badgeText}`}>{f}</span>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5`}>
          <p className={`text-sm ${t.body} leading-relaxed`}>{d.notes as string}</p>
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
  const targetSection = d.targetSection as string;

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
