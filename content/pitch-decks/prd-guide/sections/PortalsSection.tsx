"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";
import { DeepDiveLink } from "@/components/pitch-deck";

export function PortalsSection() {
  const c = useContent();
  const d = c.portals;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";
  const isChinese = c.authDict?.signIn === "登录";

  return (
    <section id="s-portals" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" : "bg-blue-100 border border-blue-400/30 text-blue-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle}</p>
        <p className={`text-base ${t.body} leading-relaxed mb-6`}>
          {isChinese
            ? "Portal Portal（公开产品站点）、User Portal（客户工作台）、Admin Portal（管理后台）共享同一套数据底座，面向三类角色输出完全不同视图。"
            : "Portal (public product site), User Portal (customer dashboard), and Admin Portal (management backend) share the same data foundation while delivering entirely different views for three role types."}
        </p>
        <DeepDiveLink href={d.deepDive.href} label={d.deepDive.label} />
      </div>
    </section>
  );
}
