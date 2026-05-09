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
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${isDark ? "bg-teal-500/10 border border-teal-500/20 text-teal-400" : "bg-teal-100 border border-teal-400/30 text-teal-700"}`}>
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

export function ScannersSection() {
  const c = useContent();
  const d = c.scanners as Record<string, unknown>;
  const scanners = d.scanners as Array<Record<string, string>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  // 定义频率顺序（从高到低）
  const freqOrder = [
    "任务队列触发", "每日或实时",
    "每日",
    "每周", "每两周",
  ];
  const freqOrderEn = [
    "Task queue triggered", "Daily or real time",
    "Daily",
    "Weekly", "Biweekly",
  ];

  // 按频率分组
  const grouped: Record<string, Array<Record<string, string>>> = {};
  for (const s of scanners) {
    const key = s.freq;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(s);
  }

  // 按频率排序 key
  const localeOrder = d.badge === "13-Scanner Matrix" ? freqOrder : freqOrderEn;
  const sortedKeys = Object.keys(grouped).sort(
    (a, b) => (localeOrder.indexOf(a) === -1 ? 999 : localeOrder.indexOf(a))
           - (localeOrder.indexOf(b) === -1 ? 999 : localeOrder.indexOf(b))
  );

  const badgeColor = isDark
    ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
    : "bg-cyan-100 border border-cyan-400/30 text-cyan-700";
  const freqBadgeColor = isDark
    ? "bg-white/5 border border-white/10 text-white/60"
    : "bg-[#E8E2F2] border border-[#D6CEE8] text-[#6B5B8A]";

  return (
    <section id="s-scanners" className={`${PAGE} overflow-y-auto`}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${badgeColor}`}>
          {d.badge as string}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-xl ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="space-y-8">
          {sortedKeys.map((freq) => {
            const items = grouped[freq];
            return (
              <div key={freq}>
                <div className={`inline-block px-3 py-1 rounded-lg text-sm font-medium mb-3 ${freqBadgeColor}`}>
                  ⏱ {freq}
                </div>
                <div className="overflow-x-auto">
                  <table className={`w-full text-sm ${t.body}`}>
                    <thead>
                      <tr className={`border-b ${t.trBorder}`}>
                        <th className={`text-left py-2 px-3 ${t.thText} w-[10%]`}>平台</th>
                        <th className={`text-left py-2 px-3 ${t.thText} w-[18%]`}>方法</th>
                        <th className={`text-left py-2 px-3 ${t.thText} w-[16%]`}>成本</th>
                        <th className={`text-left py-2 px-3 ${t.thText} w-[22%] hidden sm:table-cell`}>限流</th>
                        <th className={`text-left py-2 px-3 ${t.thText}`}>聚焦目标</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((s, i) => (
                        <tr key={i} className={`border-b ${t.trBorder} ${t.trHover ?? ""}`}>
                          <td className={`py-2 px-3 font-medium ${t.heading} whitespace-nowrap`}>{s.platform}</td>
                          <td className={`py-2 px-3 font-mono text-xs ${t.muted}`}>{s.method}</td>
                          <td className={`py-2 px-3 text-xs ${t.cost ?? t.muted} whitespace-nowrap`}>{s.cost}</td>
                          <td className={`py-2 px-3 text-xs ${t.muted} hidden sm:table-cell`}>{s.rateLimit}</td>
                          <td className={`py-2 px-3 text-xs ${t.body}`}>{s.focus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function SkillsSection() {
  const c = useContent();
  const d = c.skills as Record<string, unknown>;
  const skills = d.skills as Array<Record<string, string>>;
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const isDark = theme === "dark";

  return (
    <section id="s-skills" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full text-base font-medium mb-4 ${isDark ? "bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400" : "bg-fuchsia-100 border border-fuchsia-400/30 text-fuchsia-700"}`}>
          {d.badge as string}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title as string}</h2>
        <p className={`text-xl ${t.subheading} mb-8 max-w-3xl`}>{d.subtitle as string}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {skills.map((sk, i) => (
            <div key={i} className={`rounded-2xl ${t.cardBg} border ${t.cardBorder} p-5 flex flex-col gap-2`}>
              <div className={`text-base font-semibold ${t.heading} font-mono`}>{sk.skill}</div>
              <div className="flex flex-wrap gap-1 text-xs">
                <span className={`px-2 py-0.5 rounded ${t.badgeBg} ${t.badgeText}`}>
                  📥 {sk.input}
                </span>
                <span className={`px-2 py-0.5 rounded ${t.badgeBg} ${t.badgeText}`}>
                  📤 {sk.output}
                </span>
              </div>
              <div className={`text-xs ${t.muted} leading-relaxed mt-1 flex items-start gap-1`}>
                <span>🔗</span>
                <span>{sk.linkPolicy}</span>
              </div>
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
