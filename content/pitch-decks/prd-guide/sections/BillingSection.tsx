"use client";

import React from "react";
import { useContent, useThemeTokens } from "../hooks";
import { PAGE, PAGE_INNER } from "../constants";
import { useDeckTheme } from "../theme";
import { DeepDiveLink } from "@/components/pitch-deck";

export function BillingSection() {
  const c = useContent();
  const d = c.billing;
  const t = useThemeTokens();
  const { theme } = useDeckTheme();
  const isDark = theme === "dark";
  const isChinese = c.authDict?.signIn === "登录";

  return (
    <section id="s-billing" className={PAGE}>
      <div className={PAGE_INNER}>
        <span className={`inline-block px-3 py-1 rounded-full ${isDark ? "bg-rose-500/10 border border-rose-500/20 text-rose-400" : "bg-rose-100 border border-rose-400/30 text-rose-700"} text-base font-medium mb-4`}>
          {d.badge}
        </span>
        <h2 className={`text-3xl sm:text-4xl font-bold ${t.heading} mb-2`}>{d.title}</h2>
        <p className={`text-xl ${t.subheading} mb-6 max-w-3xl`}>{d.subtitle}</p>
        <p className={`text-base ${t.body} leading-relaxed mb-6`}>
          {isChinese ? "定价模型涵盖订阅制、预付制与按效果付费三种并行收费模式，配合平台 Tier 倍率机制与管理员调账权限。" : "The billing model covers three parallel charging modes: subscription, prepaid, and pay-per-performance, with platform Tier multipliers and admin adjustment capabilities."}
        </p>
        <DeepDiveLink href={d.deepDive.href} label={d.deepDive.label} />
      </div>
    </section>
  );
}
