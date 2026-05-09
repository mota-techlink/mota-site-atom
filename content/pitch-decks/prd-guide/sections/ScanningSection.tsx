"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";
import { DeepDiveLink } from "@/components/pitch-deck";

export function ScanningSection() {
  const c = useContent();
  const d = c.scanning;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";
  const isChinese = c.authDict?.signIn === "登录";

  return (
    <section id="s-scanning" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400" : "bg-cyan-100 border border-cyan-400/30 text-cyan-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle}</p>
        <p className={`text-base ${t.body} leading-relaxed mb-6`}>
          {isChinese
            ? "13 个独立扫描器覆盖 Reddit、YouTube、Google、Amazon、Quora、Twitter/X、V2EX、微博及本土平台，配合 12 个可复用 Skills 构建扫描→相关度筛选→跨源验证的完整链路。"
            : "13 independent scanners cover Reddit, YouTube, Google, Amazon, Quora, Twitter/X, V2EX, Weibo, and local platforms. 12 reusable Skills build the full scanning→relevance filtering→cross-source validation pipeline."}
        </p>
        <DeepDiveLink href={d.deepDive.href} label={d.deepDive.label} />
      </div>
    </section>
  );
}
