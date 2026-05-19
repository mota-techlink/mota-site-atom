"use client";
import React, { useMemo, useState } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";
import { DetailModal, useIsMobile } from "./DetailModal";

const DONUT_COLORS = ["#818cf8", "#a78bfa", "#34d399"];

type Segment = { value: number; color: string; label: string };

function buildDonutPaths(segments: Segment[]) {
  const cx = 60;
  const cy = 60;
  const r = 45;
  const innerR = 28;
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
    return { d, color: seg.color, label: seg.label, value: seg.value };
  });
}

export function PricingSection() {
  const c = useContent();
  const p = (c as any).pricing;
  const isMobile = useIsMobile();
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

  return (
    <section id="s-pricing" className={`${SECTION} bg-violet-50 dark:bg-[#1a0f0a] relative`}>
      <DynamicBackground accent="indigo" brightness={1.3} count={14} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-6 sm:mb-10">
          <span className="mi-child inline-block px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-600/40 text-indigo-400 text-xs sm:text-sm font-medium mb-2">{p.badge}</span>
          <h2 className="mi-child text-stone-900 dark:text-white font-bold mb-2">{p.title}</h2>
          <p className="mi-child text-stone-600/70 dark:text-stone-300/70 text-sm sm:text-base max-w-2xl mx-auto">{p.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {p.cards.map((card: any, i: number) => (
            <div
              key={i}
              onClick={isMobile ? () => setOpenIdx(i) : undefined}
              role={isMobile ? "button" : undefined}
              tabIndex={isMobile ? 0 : undefined}
              className={`mi-child rounded-xl bg-violet-100/70 dark:bg-stone-900/60 border border-indigo-400/40 dark:border-indigo-400/25 p-5 sm:p-6 flex flex-col ${isMobile ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{card.icon}</span>
                <div className="text-stone-900 dark:text-white font-bold text-sm sm:text-base">{card.category}</div>
              </div>
              <ul className="space-y-2 flex-1">
                {card.items.map((li: string, j: number) => (
                  <li key={j} className="flex items-start gap-2 text-stone-600/70 dark:text-stone-300/70 text-xs sm:text-sm">
                    <span className="text-indigo-400 mt-0.5 shrink-0">·</span>{li}
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-t border-indigo-400/20 dark:border-indigo-400/15 text-right">
                <span className="text-indigo-500 dark:text-indigo-300 font-semibold text-sm sm:text-base">{card.range}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary bar */}
        <div className="mi-child mb-6 rounded-2xl bg-indigo-500/10 dark:bg-indigo-900/30 border border-indigo-400/30 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-0 sm:divide-x sm:divide-indigo-400/30 text-center">
          <div className="sm:px-6">
            <div className="text-xs sm:text-sm text-stone-600/70 dark:text-stone-300/70 mb-1">{p.totalLabel}</div>
            <div className="text-indigo-600 dark:text-indigo-300 font-bold text-base sm:text-lg">
              {p.totalValue}
              {p.totalNote && (
                <span className="ml-2 text-xs sm:text-sm font-normal text-stone-600/70 dark:text-stone-300/70">{p.totalNote}</span>
              )}
            </div>
          </div>
          <div className="sm:px-6">
            <div className="text-xs sm:text-sm text-stone-600/70 dark:text-stone-300/70 mb-1">{p.annualLabel}</div>
            <div className="text-emerald-600 dark:text-emerald-300 font-bold text-base sm:text-lg">{p.annualValue}</div>
          </div>
        </div>

        {/* Donut chart + legend */}
        <div className="mi-child mb-6 rounded-2xl bg-violet-100/50 dark:bg-stone-900/40 border border-indigo-400/20 dark:border-indigo-400/15 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-center gap-6">
          <svg
            viewBox="0 0 120 120"
            width="160"
            height="160"
            className="shrink-0"
            role="img"
            aria-label="One-time cost breakdown"
          >
            {donutSegments.map((s, i) => (
              <path key={i} d={s.d} fill={s.color} stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
            ))}
            <text
              x="60"
              y="58"
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
              style={{ fontSize: "11px", fontWeight: 700 }}
            >
              {totalValue}
            </text>
          </svg>
          <ul className="space-y-2 text-sm">
            {donutSegments.map((s, i) => {
              const pct = Math.round((s.value / (totalValue || 1)) * 100);
              return (
                <li key={i} className="flex items-center gap-3">
                  <span
                    className="inline-block w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-stone-900 dark:text-white font-medium">{s.label}</span>
                  <span className="text-stone-600/70 dark:text-stone-300/70 text-xs">
                    {s.value} ({pct}%)
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mi-child text-center text-stone-600/60 dark:text-stone-300/60 text-xs sm:text-sm px-4">{p.note}</p>
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
