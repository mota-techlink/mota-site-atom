"use client";

import React from "react";
import { useContent, useActiveSlide } from "../hooks";
import { SECTION, SECTION_MAP } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

const STATUS_STYLE: Record<string, string> = {
  active: "bg-emerald-500/15 text-d-emerald",
  paid: "bg-indigo-500/15 text-d-indigo",
  new: "bg-amber-500/15 text-d-amber",
};

const PLAT_DOT: Record<string, string> = {
  Reddit: "bg-orange-500",
  YouTube: "bg-red-500",
  Naver: "bg-green-500",
  "Yahoo!": "bg-d-violet",
  Twitter: "bg-sky-500",
};

export function CreatorPartnerSection() {
  const c = useContent();
  const cp = (c as any).creatorPartner;
  const activeSlide = useActiveSlide();
  const isVisible = activeSlide === SECTION_MAP["s-creatorpartner"];

  if (!cp) return null;

  return (
    <section
      id="s-creatorpartner"
      className={`${SECTION} bg-d-bg relative`}
    >
      <DynamicBackground accent="cyan" brightness={1.8} count={18} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* ── Header ───────────────────────────────────── */}
        <div className="text-center mb-2 sm:mb-4">
          <span className="inline-block px-3 py-1 sm:px-4 rounded-full bg-linear-to-r from-fuchsia-500/15 to-cyan-500/15 border border-fuchsia-500/20 text-d-fuchsia text-[10px] sm:text-sm font-medium mb-1.5 sm:mb-2">
            {cp.badge}
          </span>
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-d-fg">
            {cp.title}{" "}
            <span className="bg-linear-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              {cp.titleHighlight}
            </span>
          </h2>
          <p className="text-[10px] sm:text-sm text-d-fg/40 max-w-2xl mx-auto mt-0.5 sm:mt-1">
            {cp.subtitle}
          </p>
        </div>

        {/* ── Vision: 3 pillars ────────────────────────── */}
        <div className="mi-child grid grid-cols-3 gap-1.5 sm:gap-3 mb-2 sm:mb-4">
          {cp.vision.items.map((v: any, i: number) => (
            <div
              key={i}
              className="rounded-lg sm:rounded-xl bg-linear-to-br from-d-fg/5 to-d-fg/[0.02] ring-1 ring-d-fg/8 p-2 sm:p-3.5 text-center transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="text-xl sm:text-3xl mb-1 sm:mb-2">{v.icon}</div>
              <h4 className="text-[10px] sm:text-sm font-bold text-d-fg mb-0.5 sm:mb-1">
                {v.label}
              </h4>
              <p className="text-[8px] sm:text-xs text-d-fg/40 leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── Two-column: Flow + Dashboard ─────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
          {/* Left — Automated flow */}
          <div className="mi-child rounded-xl sm:rounded-2xl ring-1 ring-d-fg/8 bg-d-card/60 p-2.5 sm:p-4">
            <h3 className="text-[10px] sm:text-sm font-semibold text-d-fg/70 mb-2 sm:mb-3">
              ⚡ {cp.flow.title}
            </h3>
            <div className="space-y-1 sm:space-y-2">
              {cp.flow.steps.map((s: any, i: number) => (
                <div
                  key={i}
                  className="flex gap-2 sm:gap-4 items-start group"
                >
                  {/* Left: Icon + num + title (fixed width) */}
                  <div className="shrink-0 w-28 sm:w-40 flex items-center gap-1.5 sm:gap-2">
                    <div
                      className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 rounded-full bg-linear-to-br from-fuchsia-500/20 to-cyan-500/20 ring-1 ring-fuchsia-500/30 flex items-center justify-center text-xs sm:text-sm transition-all duration-500"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? "scale(1)" : "scale(0.5)",
                        transitionDelay: `${200 + i * 120}ms`,
                      }}
                    >
                      {s.icon}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[8px] sm:text-[10px] text-d-fuchsia/50 font-mono block">
                        {s.num}
                      </span>
                      <h4 className="text-[10px] sm:text-sm font-semibold text-d-fg leading-tight">
                        {s.title}
                      </h4>
                    </div>
                  </div>
                  {/* Right: Description — fills remaining width */}
                  <p className="flex-1 text-[9px] sm:text-sm text-d-fg/40 leading-relaxed pt-1 sm:pt-2">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Payment methods */}
            <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-d-fg/5">
              <h4 className="text-[9px] sm:text-xs text-d-fg/30 font-medium mb-1.5 sm:mb-2">
                {cp.payment.title}
              </h4>
              <div className="flex gap-2 sm:gap-3">
                {cp.payment.methods.map((m: any, i: number) => (
                  <div
                    key={i}
                    className="flex-1 rounded-lg bg-d-fg/5 ring-1 ring-d-fg/8 p-1.5 sm:p-2.5 flex items-center gap-1.5 sm:gap-2"
                  >
                    <span className="text-base sm:text-xl">{m.icon}</span>
                    <div>
                      <div className="text-[9px] sm:text-xs font-semibold text-d-fg">
                        {m.name}
                      </div>
                      <div className="text-[7px] sm:text-[10px] text-d-fg/30">
                        {m.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Mock dashboard */}
          <div className="mi-child rounded-xl sm:rounded-2xl ring-1 ring-d-fg/8 bg-d-card/60 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 border-b border-d-fg/5 bg-d-fg/3">
              <div className="w-2 h-2 rounded-full bg-rose-500/60" />
              <div className="w-2 h-2 rounded-full bg-amber-500/60" />
              <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
              <span className="ml-1.5 text-[8px] sm:text-[10px] text-d-fg/25">
                creators.motaiot.com
              </span>
            </div>

            <div className="p-2 sm:p-3">
              {/* Stat cards (2×2) */}
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                {cp.dashboard.stats.map((st: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-lg bg-d-fg/5 ring-1 ring-d-fg/5 p-1.5 sm:p-2.5"
                  >
                    <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                      <span className="text-[8px] sm:text-[10px] text-d-fg/30">
                        {st.label}
                      </span>
                      <span className="text-xs sm:text-sm">{st.icon}</span>
                    </div>
                    <div className="text-sm sm:text-xl font-bold text-d-fg">
                      {st.value}
                    </div>
                    <div className="text-[7px] sm:text-[10px] text-d-emerald/70 mt-0.5">
                      {st.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent activity */}
              <div>
                <h4 className="text-[8px] sm:text-[10px] text-d-fg/30 font-medium mb-1 sm:mb-1.5">
                  {cp.dashboard.recentTitle}
                </h4>
                <div className="space-y-1 sm:space-y-1.5">
                  {cp.dashboard.recent.map((r: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[11px]"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible
                          ? "translateX(0)"
                          : "translateX(12px)",
                        transition: `all 0.4s ease ${400 + i * 80}ms`,
                      }}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          PLAT_DOT[r.platform] ?? "bg-d-fg/20"
                        }`}
                      />
                      <span className="text-d-fg/60 font-medium shrink-0 w-20 sm:w-28 truncate">
                        {r.creator}
                      </span>
                      <span className="text-d-fg/40 flex-1 truncate">
                        {r.action}
                      </span>
                      <span
                        className={`shrink-0 px-1 py-0.5 rounded text-[7px] sm:text-[9px] font-medium ${
                          STATUS_STYLE[r.status] ?? "bg-d-fg/10 text-d-fg/40"
                        }`}
                      >
                        {(cp.statusLabels as Record<string, string>)[
                          r.status
                        ] ?? r.status}
                      </span>
                      <span className="text-d-fg/20 shrink-0 hidden sm:inline">
                        {r.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
