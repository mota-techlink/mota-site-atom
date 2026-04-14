"use client";

import React, { useState, useRef, useCallback } from "react";
import { useContent, useActiveSlide } from "../hooks";
import { SECTION, SECTION_MAP } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

const PLATFORM_COLORS: Record<string, string> = {
  Reddit: "bg-orange-500",
  YouTube: "bg-red-500",
  Naver: "bg-green-500",
  Quora: "bg-red-700",
  G2: "bg-blue-600",
};

const STATUS_DOT: Record<string, string> = {
  click: "bg-emerald-400",
  posted: "bg-amber-400",
};

/* ── Conversion trend line (SVG overlay) ── */
function ConversionLine({
  bars,
  maxConv,
  isVisible,
}: {
  bars: { conv: number }[];
  maxConv: number;
  isVisible: boolean;
}) {
  if (bars.length === 0 || maxConv === 0) return null;
  const n = bars.length;
  // points at center of each bar column
  const pts = bars.map((b, i) => {
    const x = ((i + 0.5) / n) * 100;
    const y = 100 - (b.conv / maxConv) * 85; // 85% max to leave top room
    return { x, y };
  });
  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: "visible" }}
    >
      <polyline
        points={polyline}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        style={{
          opacity: isVisible ? 1 : 0,
          strokeDasharray: 300,
          strokeDashoffset: isVisible ? 0 : 300,
          transition: "stroke-dash-offset 1.2s ease-out 0.3s, opacity 0.6s ease 0.3s",
        }}
      />
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="2.5"
          fill="#22d3ee"
          vectorEffect="non-scaling-stroke"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: `opacity 0.4s ease ${0.5 + i * 0.08}s`,
          }}
        />
      ))}
    </svg>
  );
}

export function DashboardSection() {
  const c = useContent();
  const d = (c as any).dashboard;
  const activeSlide = useActiveSlide();
  const isVisible = activeSlide === SECTION_MAP["s-dashboard"];
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  if (!d) return null;

  const bars: { label: string; value: number; conv: number }[] = d.chart.bars;
  const maxBar = Math.max(...bars.map((b) => b.value));
  const maxConv = Math.max(...bars.map((b) => b.conv ?? 0)) * 1.15; // headroom

  return (
    <section id="s-dashboard" className={`${SECTION} bg-d-bg2 relative`}>
      <DynamicBackground accent="cyan" brightness={1.4} count={16} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-3 sm:mb-5">
          <span className="inline-block px-3 py-1 sm:px-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-d-cyan text-xs sm:text-sm font-medium mb-2 sm:mb-3">
            {d.badge}
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-d-fg mb-1 sm:mb-2">
            {d.title}
          </h2>
          <p className="text-xs sm:text-base text-d-fg/40 max-w-2xl mx-auto">
            {d.subtitle}
          </p>
        </div>

        {/* Mock dashboard UI */}
        <div className="rounded-xl sm:rounded-2xl border border-d-fg/10 bg-d-card/80 overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 border-b border-d-fg/5 bg-d-fg/3">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            <span className="ml-2 text-[10px] sm:text-xs text-d-fg/30">dashboard.motaiot.com</span>
          </div>

          <div className="p-3 sm:p-4 lg:p-5">
            {/* Stat cards */}
            <div className="mi-child grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
              {d.stats.map((s: any, i: number) => (
                <div
                  key={i}
                  className="rounded-lg sm:rounded-xl bg-d-fg/5 border border-d-fg/8 p-2.5 sm:p-3.5"
                >
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="text-[10px] sm:text-xs text-d-fg/40">{s.label}</span>
                    <span className="text-sm sm:text-base">{s.icon}</span>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-d-fg">{s.value}</div>
                  <div className="text-[10px] sm:text-xs text-d-emerald mt-0.5">{s.change}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 sm:gap-3">
              {/* Chart — bars + conversion trend line + hover tooltip */}
              <div className="mi-child lg:col-span-3 rounded-lg sm:rounded-xl bg-d-fg/5 border border-d-fg/8 p-2.5 sm:p-3.5">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <h4 className="text-[10px] sm:text-xs text-d-fg/40 font-medium">
                    {d.chart.title}
                  </h4>
                  <span className="text-[9px] sm:text-[10px] text-d-cyan/60 font-medium flex items-center gap-1">
                    <span className="inline-block w-3 h-0.5 bg-cyan-400 rounded-full" />
                    {d.chart.convTitle}
                  </span>
                </div>
                <div
                  ref={chartRef}
                  className="relative flex gap-1 sm:gap-2 h-24 sm:h-32"
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {/* SVG conversion line overlay */}
                  <ConversionLine
                    bars={bars}
                    maxConv={maxConv}
                    isVisible={isVisible}
                  />
                  {bars.map((bar, i) => {
                    const pct = maxBar > 0 ? (bar.value / maxBar) * 100 : 0;
                    const isHovered = hoveredBar === i;
                    return (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center relative"
                        onMouseEnter={() => setHoveredBar(i)}
                      >
                        <div className="flex-1 w-full relative">
                          <div
                            className="absolute bottom-0 w-full rounded-sm bg-linear-to-t from-indigo-600 to-d-indigo transition-all duration-700"
                            style={{
                              height: isVisible ? `${pct}%` : "0%",
                              transitionDelay: `${i * 80}ms`,
                              opacity: hoveredBar !== null ? (isHovered ? 1 : 0.45) : 0.85,
                            }}
                          />
                        </div>
                        <span className="text-[8px] sm:text-[10px] text-d-fg/30 mt-1 shrink-0">
                          {bar.label}
                        </span>

                        {/* Hover tooltip */}
                        {isHovered && (
                          <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-10 px-2.5 py-1.5 rounded-lg bg-d-card2 border border-d-fg/10 shadow-xl whitespace-nowrap pointer-events-none">
                            <div className="text-[10px] sm:text-xs font-bold text-d-fg">
                              {bar.label}
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-d-indigo/75">
                              🖱 {bar.value} clicks
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-d-cyan/75">
                              📈 {bar.conv}%
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 bg-d-card2 border-r border-b border-d-fg/10" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activity feed */}
              <div className="mi-child lg:col-span-2 rounded-lg sm:rounded-xl bg-d-fg/5 border border-d-fg/8 p-2.5 sm:p-3.5">
                <h4 className="text-[10px] sm:text-xs text-d-fg/40 font-medium mb-2 sm:mb-3">
                  {d.activity.title}
                </h4>
                <div className="space-y-1.5 sm:space-y-2">
                  {d.activity.items.map((a: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[9px] sm:text-xs"
                    >
                      <div
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${
                          STATUS_DOT[a.status] ?? "bg-d-fg/20"
                        }`}
                      />
                      <span
                        className={`shrink-0 px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] font-medium ${
                          PLATFORM_COLORS[a.platform]
                            ? `${PLATFORM_COLORS[a.platform]}/20 text-d-fg/70`
                            : "bg-d-fg/10 text-d-fg/50"
                        }`}
                      >
                        {a.platform}
                      </span>
                      <span className="text-d-fg/50 truncate flex-1">{a.action}</span>
                      <span className="text-d-fg/25 shrink-0">{a.time}</span>
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
