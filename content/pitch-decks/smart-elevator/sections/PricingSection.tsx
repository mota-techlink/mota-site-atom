"use client";
import React, { useMemo, useState } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";
import { DetailModal } from "./DetailModal";

const DONUT_COLORS = ["#818cf8", "#a78bfa", "#f472b6", "#34d399"];

type Segment = { value: number; color: string; label: string };

function buildDonutPaths(segments: Segment[]) {
  const cx = 60;
  const cy = 60;
  const r = 50;
  const innerR = 30;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let cursor = 0;
  return segments.map((seg) => {
    const startAngle = (cursor / total) * Math.PI * 2;
    cursor += seg.value;
    const endAngle = (cursor / total) * Math.PI * 2;
    const x1 = cx + r * Math.cos(startAngle - Math.PI / 2);
    const y1 = cy + r * Math.sin(startAngle - Math.PI / 2);
    const x2 = cx + r * Math.cos(endAngle - Math.PI / 2);
    const y2 = cy + r * Math.sin(endAngle - Math.PI / 2);
    const ix1 = cx + innerR * Math.cos(endAngle - Math.PI / 2);
    const iy1 = cy + innerR * Math.sin(endAngle - Math.PI / 2);
    const ix2 = cx + innerR * Math.cos(startAngle - Math.PI / 2);
    const iy2 = cy + innerR * Math.sin(startAngle - Math.PI / 2);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
    // midpoint angle for label positioning
    const midAngle = (startAngle + endAngle) / 2;
    return {
      d,
      color: seg.color,
      label: seg.label,
      value: seg.value,
      midAngle,
    };
  });
}

export function PricingSection() {
  const c = useContent();
  const p = (c as any).pricing;
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const active = openIdx !== null ? p.cards[openIdx] : null;

  const donutSegments = useMemo(() => {
    const oneTime = p.cards.slice(0, 3);
    const segs: Segment[] = oneTime.map((card: any, i: number) => ({
      value: card.value,
      color: DONUT_COLORS[i],
      label: card.category,
    }));
    return buildDonutPaths(segs);
  }, [p.cards]);

  const totalValue = donutSegments.reduce((s, x) => s + x.value, 0);

  // Center text: depends on hover within donut (only indices 0..2)
  const centerCard =
    hoverIdx !== null && hoverIdx < 3 ? p.cards[hoverIdx] : null;

  return (
    <section
      id="s-pricing"
      className={`${SECTION} bg-violet-50 dark:bg-[#1a0f0a] relative`}
    >
      <DynamicBackground accent="indigo" brightness={1.3} count={14} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-600/40 text-indigo-400 text-xs sm:text-sm font-medium mb-2">
            {p.badge}
          </span>
          <h2 className="mi-child text-stone-900 dark:text-white font-bold mb-2">
            {p.title}
          </h2>
          <p className="mi-child text-stone-600/70 dark:text-stone-300/70 text-sm sm:text-base max-w-2xl mx-auto">
            {p.subtitle}
          </p>
        </div>

        {/* Main: Donut (left) + Card list (right) */}
        <div className="mi-child grid grid-cols-1 sm:grid-cols-[45%_55%] gap-6 sm:gap-8 items-center mb-6">
          {/* LEFT: Donut */}
          <div className="flex justify-center">
            <svg
              viewBox="0 0 120 120"
              className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] shrink-0"
              role="img"
              aria-label="One-time cost breakdown"
            >
              {donutSegments.map((s, i) => {
                const isActive = hoverIdx === i || openIdx === i;
                return (
                  <path
                    key={i}
                    d={s.d}
                    fill={s.color}
                    stroke={isActive ? "#fff" : "rgba(0,0,0,0.04)"}
                    strokeWidth={isActive ? 2 : 0.5}
                    className="cursor-pointer transition-all duration-150"
                    style={{
                      opacity: hoverIdx !== null && hoverIdx !== i ? 0.6 : 1,
                      transform: isActive ? "scale(1.03)" : "scale(1)",
                      transformOrigin: "60px 60px",
                    }}
                    onMouseEnter={() => setHoverIdx(i)}
                    onMouseLeave={() => setHoverIdx(null)}
                    onClick={() => setOpenIdx(i)}
                  />
                );
              })}
              {/* Center text */}
              {centerCard ? (
                <>
                  <text
                    x="60"
                    y="56"
                    textAnchor="middle"
                    className="fill-stone-900 dark:fill-white"
                    style={{ fontSize: "10px", fontWeight: 600 }}
                  >
                    {centerCard.category}
                  </text>
                  <text
                    x="60"
                    y="70"
                    textAnchor="middle"
                    className="fill-indigo-600 dark:fill-indigo-300"
                    style={{ fontSize: "12px", fontWeight: 700 }}
                  >
                    {centerCard.range}
                  </text>
                </>
              ) : (
                <>
                  <text
                    x="60"
                    y="56"
                    textAnchor="middle"
                    className="fill-stone-900 dark:fill-white"
                    style={{ fontSize: "10px", fontWeight: 600 }}
                  >
                    {p.totalLabel}
                  </text>
                  <text
                    x="60"
                    y="72"
                    textAnchor="middle"
                    className="fill-indigo-600 dark:fill-indigo-300"
                    style={{ fontSize: "14px", fontWeight: 700 }}
                  >
                    {p.totalValue}
                  </text>
                </>
              )}
            </svg>
          </div>

          {/* RIGHT: Compact card list */}
          <ul className="rounded-xl bg-violet-100/50 dark:bg-stone-900/50 border border-indigo-400/25 overflow-hidden divide-y divide-indigo-400/15">
            {p.cards.map((card: any, i: number) => {
              const isActive = hoverIdx === i || openIdx === i;
              const dotColor = DONUT_COLORS[i] ?? "#34d399";
              return (
                <li
                  key={i}
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() => setHoverIdx(null)}
                  onClick={() => setOpenIdx(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setOpenIdx(i);
                    }
                  }}
                  className={`flex items-center gap-3 px-4 py-3 min-h-[48px] cursor-pointer transition-colors ${
                    isActive
                      ? "bg-indigo-100/70 dark:bg-indigo-900/30"
                      : "hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20"
                  }`}
                >
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: dotColor }}
                  />
                  <span className="text-sm sm:text-base">{card.icon}</span>
                  <span className="text-stone-900 dark:text-white font-medium text-sm sm:text-base flex-1 truncate">
                    {card.category}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-300 font-semibold text-xs sm:text-sm whitespace-nowrap">
                    {card.range}
                  </span>
                  <span className="text-indigo-400 text-xs">›</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Summary bar */}
        <div className="mi-child mb-4 rounded-2xl bg-indigo-500/10 dark:bg-indigo-900/30 border border-indigo-400/30 px-6 py-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
          <div className="flex items-baseline gap-2">
            <span className="text-xs sm:text-sm text-stone-600/70 dark:text-stone-300/70">
              {p.totalLabel}
            </span>
            <span className="text-indigo-600 dark:text-indigo-300 font-bold text-base sm:text-lg">
              {p.totalValue}
            </span>
          </div>
          <span className="hidden sm:inline text-indigo-400/40">|</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xs sm:text-sm text-stone-600/70 dark:text-stone-300/70">
              {p.annualLabel}
            </span>
            <span className="text-emerald-600 dark:text-emerald-300 font-bold text-base sm:text-lg">
              {p.annualValue}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mi-child text-center text-stone-600/60 dark:text-stone-300/60 text-xs sm:text-sm px-4">
          {p.note}
        </p>
      </div>

      <DetailModal
        open={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        title={active?.category ?? ""}
        icon={active?.icon}
        eyebrow={p.badge}
      >
        <ul className="space-y-2">
          {active?.items.map((li: string, j: number) => (
            <li key={j} className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5 shrink-0">·</span>
              <span>{li}</span>
            </li>
          ))}
        </ul>
        {active?.range && (
          <div className="mt-4 pt-3 border-t border-indigo-400/20 text-right">
            <span className="text-indigo-300 font-semibold">{active.range}</span>
          </div>
        )}
      </DetailModal>
    </section>
  );
}
