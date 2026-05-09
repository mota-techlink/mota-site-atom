"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";
import { DeepDiveLink } from "@/components/pitch-deck";

export function ArchitectureSection() {
  const c = useContent();
  const d = c.architecture;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";
  const isChinese = c.authDict?.signIn === "登录";

  return (
    <section id="s-architecture" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400" : "bg-indigo-100 border border-indigo-400/30 text-indigo-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle}</p>
        <p className={`text-base ${t.body} leading-relaxed mb-6`}>
          {isChinese
            ? "产品架构覆盖三层产品线与数据底座，门户架构面向 Portal/User/Admin 三类角色输出不同工作面板。两者共同构成可运营的完整系统。"
            : "The product architecture covers three product lines and the data foundation; the portal architecture delivers different workspaces for Portal/User/Admin roles. Together they form a complete, operable system."}
        </p>
        <DeepDiveLink href={d.deepDive.href} label={d.deepDive.label} />
      </div>
    </section>
  );
}
