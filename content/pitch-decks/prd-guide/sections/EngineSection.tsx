"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";
import { DeepDiveLink } from "@/components/pitch-deck";

export function EngineSection() {
  const c = useContent();
  const d = c.engine;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";
  const isChinese = c.authDict?.signIn === "登录";

  return (
    <section id="s-engine" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-amber-500/10 border border-amber-500/20 text-amber-400" : "bg-amber-100 border border-amber-400/30 text-amber-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle}</p>
        <p className={`text-base ${t.body} leading-relaxed mb-6`}>
          {isChinese
            ? "引擎通过 AI Agent 编排理解产品定义，反向推断目标用户、检索平台和查询词，自动生成扫描任务入队。核心输出包括 domain_tags、keywords、multilingual_queries 等结构化字段。"
            : "The engine uses AI Agent orchestration to understand product definitions, infer target audiences, search platforms, and query terms, then auto-generates scanning tasks. Core outputs include domain_tags, keywords, multilingual_queries, and other structured fields."}
        </p>
        <DeepDiveLink href={d.deepDive.href} label={d.deepDive.label} />
      </div>
    </section>
  );
}
