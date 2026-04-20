"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import {
  TrendingUp,
  PieChart as PieChartIcon,
  Cpu,
  Globe,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// ─── Color Palette ───────────────────────────────────────────────
const METALLIC_GOLD = "#d4a853";
const EQUITY_BLUE = "#2563eb";
const INVESTOR_GOLD = "#d4a853";

// ─── Fund Allocation Data ────────────────────────────────────────
const fundAllocation = [
  { name: "Product R&D & AI", value: 40, amount: "€120,000", color: "#3b82f6", icon: <Cpu className="w-4 h-4" /> },
  { name: "Market & Operations", value: 18.3, amount: "€55,000", color: METALLIC_GOLD, icon: <Globe className="w-4 h-4" /> },
  { name: "Security & Compliance", value: 11.7, amount: "€35,000", color: "#10b981", icon: <Lock className="w-4 h-4" /> },
  { name: "Contingency & Acquisition", value: 30, amount: "€90,000", color: "#8b5cf6", icon: <ShieldCheck className="w-4 h-4" /> },
];

// ─── SVG Icons for Pie Slices ────────────────────────────────────
const FUND_ICONS_SVG: Record<string, (c: string) => React.ReactNode> = {
  "Product R&D & AI": (c) => (
    <g>
      <circle cx="0" cy="0" r="8" fill={c} opacity="0.85" />
      <rect x="-3.5" y="-3.5" width="7" height="7" rx="1" fill="none" stroke="#fff" strokeWidth="1" opacity="0.8" />
      <rect x="-1.5" y="-1.5" width="3" height="3" rx="0.5" fill="#fff" opacity="0.6" />
    </g>
  ),
  "Market & Operations": (c) => (
    <g>
      <circle cx="0" cy="0" r="7" fill={c} opacity="0.85" />
      <circle cx="0" cy="0" r="5" fill="none" stroke="#fff" strokeWidth="0.9" opacity="0.6" />
      <ellipse cx="0" cy="0" rx="2.5" ry="5" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.5" />
      <line x1="-5" y1="0" x2="5" y2="0" stroke="#fff" strokeWidth="0.7" opacity="0.45" />
    </g>
  ),
  "Security & Compliance": (c) => (
    <g>
      <circle cx="0" cy="0" r="8" fill={c} opacity="0.85" />
      <rect x="-3.5" y="-1" width="7" height="5.5" rx="1" fill="none" stroke="#fff" strokeWidth="0.9" opacity="0.7" />
      <path d="M-2,-1 L-2,-3 C-2,-5 2,-5 2,-3 L2,-1" fill="none" stroke="#fff" strokeWidth="0.9" opacity="0.6" />
      <circle cx="0" cy="1.5" r="0.8" fill="#fff" opacity="0.6" />
    </g>
  ),
  "Contingency & Acquisition": (c) => (
    <g>
      <circle cx="0" cy="0" r="8" fill={c} opacity="0.85" />
      <path d="M0,-5.5 L4.5,-3 L4.5,0.5 C4.5,3.5 2.5,5 0,6.2 C-2.5,5 -4.5,3.5 -4.5,0.5 L-4.5,-3 Z" fill="none" stroke="#fff" strokeWidth="0.9" opacity="0.6" />
      <path d="M-1.8,0.5 L-0.5,2 L2,-.8" fill="none" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </g>
  ),
};

function renderPieIconLabel({ cx, cy, midAngle, innerRadius, outerRadius, index }: any) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const item = fundAllocation[index];
  const iconRenderer = FUND_ICONS_SVG[item.name];
  if (!iconRenderer) return null;
  return (
    <g transform={`translate(${x},${y}) scale(1.6)`}>
      {iconRenderer(item.color)}
    </g>
  );
}

// ─── Animated Counter ────────────────────────────────────────────
function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  delay = 0,
  className = "",
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  className?: string;
}) {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, target, {
      duration: 2,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [count, target, delay]);

  return (
    <span className={className}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}

// ─── Valuation Stacked Bar ───────────────────────────────────────
function ValuationBar({ c }: { c: any }) {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm lg:text-base font-mono text-slate-400 uppercase tracking-wider">
          {c.totalRaise}
        </span>
        <motion.span
          className="text-base lg:text-lg font-black font-mono"
          style={{ color: METALLIC_GOLD }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          {c.totalRaiseAmount}
        </motion.span>
      </div>

      <div className="relative w-full h-11 lg:h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10">
        <motion.div
          className="absolute inset-y-0 left-0 flex items-center justify-center"
          style={{ backgroundColor: `${EQUITY_BLUE}cc`, width: "40%" }}
          initial={{ width: 0 }}
          animate={{ width: "40%" }}
          transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
        >
          <span className="text-xs lg:text-sm font-mono font-bold text-white/90 truncate px-2">
            {c.valuationBar.preLabel} {c.valuationBar.preValue}
          </span>
        </motion.div>
        <motion.div
          className="absolute inset-y-0 flex items-center justify-center"
          style={{
            backgroundColor: `${INVESTOR_GOLD}cc`,
            left: "40%",
            width: "60%",
          }}
          initial={{ width: 0 }}
          animate={{ width: "60%" }}
          transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
        >
          <span className="text-xs lg:text-sm font-mono font-bold text-slate-900 truncate px-2">
            {c.valuationBar.postLabel} {c.valuationBar.postValue}
          </span>
        </motion.div>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: EQUITY_BLUE }} />
          <span className="text-xs lg:text-sm font-mono text-slate-400">{c.valuationBar.preLabel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: INVESTOR_GOLD }} />
          <span className="text-xs lg:text-sm font-mono text-slate-400">{c.valuationBar.postLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Fund Legend ─────────────────────────────────────────────────
function FundLegend({
  c,
  activeIndex,
  onHover,
}: {
  c: any;
  activeIndex: number | null;
  onHover: (index: number | null) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {fundAllocation.map((item, i) => (
        <motion.div
          key={item.name}
          className={`flex items-start gap-2 rounded-lg border px-2.5 py-2 cursor-pointer transition-all duration-200 ${
            activeIndex === i
              ? "border-white/20 bg-white/[0.06]"
              : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
          }`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 + i * 0.08 }}
          onMouseEnter={() => onHover(i)}
          onMouseLeave={() => onHover(null)}
        >
          <div className="mt-0.5 shrink-0" style={{ color: item.color }}>
            {item.icon}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] md:text-xs font-bold text-white/80 truncate">
              {c.fundAllocation[i]?.label ?? item.name}
            </div>
            <div className="text-[9px] md:text-[11px] font-mono" style={{ color: item.color }}>
              {c.fundAllocation[i]?.pct ?? `${item.value}%`} · {item.amount}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Section ────────────────────────────────────────────────
export function FinancialSection() {
  const content = useContent();
  const c = content.slide7;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section
      className={`${SECTION} bg-[#f0f4f8] dark:bg-linear-to-b dark:from-[#0a0e15] dark:via-[#0d1320] dark:to-[#0a0e15]`}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4 md:px-8 py-6 text-white overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-600/[0.05] blur-[120px] rounded-full pointer-events-none" />

        {/* Badge */}
        <motion.div
          className="ei-child inline-flex items-center gap-2 mb-2 md:mb-3 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <PieChartIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] md:text-sm font-mono tracking-[0.2em] uppercase text-emerald-400/90">
            {c.badge}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="ei-child text-2xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold tracking-tight text-center mb-0.5"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {c.title}{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-300">
            {c.titleHighlight}
          </span>
        </motion.h2>
        <motion.p
          className="ei-child text-xs md:text-base text-white/50 text-center max-w-xl mb-3 md:mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {c.subtitle}
        </motion.p>

        {/* Two-column: Pie + Legend/Details */}
        <div className="ei-child w-full max-w-4xl 2xl:max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center">
          {/* Left: Interactive Pie Chart */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="text-xs lg:text-sm font-mono text-slate-400 uppercase tracking-wider mb-0">
              {c.totalRaise}
            </div>
            <div className="w-full relative" style={{ height: "clamp(200px, 32vh, 360px)" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fundAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius="28%"
                    outerRadius={activeIndex !== null ? "72%" : "68%"}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    animationDuration={600}
                    label={renderPieIconLabel}
                    labelLine={false}
                  >
                    {fundAllocation.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.25}
                        strokeWidth={activeIndex === index ? 2 : 0}
                        stroke={activeIndex === index ? "#fff" : "none"}
                        style={{
                          cursor: "pointer",
                          transition: "opacity 0.25s, stroke-width 0.25s",
                          filter: activeIndex === index ? `drop-shadow(0 0 8px ${entry.color})` : "none",
                        }}
                      />
                    ))}
                  </Pie>
                  {activeIndex !== null && (
                    <>
                      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle"
                        fill={fundAllocation[activeIndex].color} fontSize="22" fontFamily="monospace" fontWeight="900">
                        {c.fundAllocation[activeIndex]?.pct ?? `${fundAllocation[activeIndex].value}%`}
                      </text>
                      <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle"
                        fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">
                        {c.fundAllocation[activeIndex]?.detail ?? fundAllocation[activeIndex].amount}
                      </text>
                    </>
                  )}
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Right: Legend + Valuation + Metrics */}
          <div className="flex flex-col gap-3">
            <FundLegend c={c} activeIndex={activeIndex} onHover={setActiveIndex} />
            <ValuationBar c={c} />
          </div>
        </div>

        {/* Bottom row: Investment highlights (full-width) */}
        <motion.div
          className="ei-child w-full max-w-4xl 2xl:max-w-6xl mt-3 md:mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 md:p-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <h3 className="text-xs md:text-sm font-bold text-emerald-400 mb-2">
            {c.investmentCard.title}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {c.investmentCard.items.map((item: string, i: number) => (
              <div key={i} className="text-[10px] md:text-sm text-white/60 flex items-start gap-1.5">
                <TrendingUp className="w-3 h-3 text-emerald-400/60 mt-0.5 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
