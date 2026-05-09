"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";
import { DeepDiveLink } from "@/components/pitch-deck";

export function PipelineSection() {
  const c = useContent();
  const d = c.pipeline;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";
  const isChinese = c.authDict?.signIn === "登录";

  return (
    <section id="s-pipeline" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-violet-500/10 border border-violet-500/20 text-violet-400" : "bg-violet-100 border border-violet-400/30 text-violet-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle}</p>
        <p className={`text-base ${t.body} leading-relaxed mb-6`}>
          {isChinese
            ? "六阶段执行管线串联产品录入→AI 分析→扫描→挖掘→回复→结算全链路，数据以 project_id / mention_id / tracking_url 为线索在各模块间流转。"
            : "A six-stage execution pipeline connecting product entry → AI analysis → scanning → mining → reply → settlement, with data flowing across modules linked by project_id / mention_id / tracking_url."}
        </p>
        <DeepDiveLink href={d.deepDive.href} label={d.deepDive.label} />
      </div>
    </section>
  );
}
