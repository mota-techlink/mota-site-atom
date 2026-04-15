"use client";

import React from "react";
import { motion } from "framer-motion";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { Rocket, Gift, TrendingUp } from "lucide-react";

// ─── Growth Chart (SVG axis + trend line) ────────────────────────
function GrowthChart({
  phases,
}: {
  phases: { label: string; timeline: string; metric: string }[];
}) {
  // Extract numeric values for chart scaling
  const values = [0, 20, 100, 500, 2000];
  const maxY = 2000;
  const w = 400;
  const h = 200;
  const padL = 40;
  const padB = 30;
  const padT = 10;
  const chartW = w - padL - 10;
  const chartH = h - padB - padT;

  const points = values.map((v, i) => ({
    x: padL + (i / (values.length - 1)) * chartW,
    y: padT + chartH - (v / maxY) * chartH,
    label: phases[i - 1]?.metric ?? "Start",
  }));

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Y-axis labels
  const yLabels = [0, 500, 1000, 1500, 2000];

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto max-h-[30vh]">
        {/* Grid lines */}
        {yLabels.map((v) => {
          const y = padT + chartH - (v / maxY) * chartH;
          return (
            <g key={v}>
              <line
                x1={padL}
                y1={y}
                x2={w - 10}
                y2={y}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="0.5"
              />
              <text
                x={padL - 4}
                y={y + 3}
                textAnchor="end"
                fill="rgba(255,255,255,0.25)"
                fontSize="7"
                fontFamily="monospace"
              >
                {v > 0 ? `${v}` : ""}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={h - 8}
            textAnchor="middle"
            fill="rgba(255,255,255,0.3)"
            fontSize="7"
            fontFamily="monospace"
          >
            {i === 0 ? "Now" : phases[i - 1]?.timeline?.split(" ")[0] ?? ""}
          </text>
        ))}

        {/* Area fill */}
        <motion.polygon
          points={`${points[0].x},${padT + chartH} ${polyline} ${points[points.length - 1].x},${padT + chartH}`}
          fill="url(#growthGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        />

        {/* Trend line */}
        <motion.polyline
          points={polyline}
          fill="none"
          stroke="#34d399"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: 600, strokeDashoffset: 0 }}
        />

        {/* Data points */}
        {points.map((p, i) => (
          <motion.g key={i}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#0f172a"
              stroke="#34d399"
              strokeWidth="1.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.2 }}
            />
            {i > 0 && (
              <motion.text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fill="#34d399"
                fontSize="7"
                fontFamily="monospace"
                fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 + i * 0.2 }}
              >
                {phases[i - 1]?.metric ?? ""}
              </motion.text>
            )}
          </motion.g>
        ))}

        <defs>
          <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(52,211,153,0.25)" />
            <stop offset="100%" stopColor="rgba(52,211,153,0)" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}

// ─── Phase Card (compact) ────────────────────────────────────────
function PhaseCard({
  phase,
  idx,
}: {
  phase: { label: string; timeline: string; detail: string; metric: string };
  idx: number;
}) {
  const accents = ["text-blue-400", "text-violet-400", "text-cyan-400", "text-emerald-400"];
  const borders = [
    "border-blue-500/25",
    "border-violet-500/25",
    "border-cyan-500/25",
    "border-emerald-500/25",
  ];

  return (
    <motion.div
      className={`relative rounded-xl border ${borders[idx % 4]} bg-white/[0.02] p-3 md:p-4 flex flex-col gap-1.5`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + idx * 0.1 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs md:text-sm font-bold text-white/90">{phase.label}</span>
        <span className={`text-[9px] md:text-xs font-mono ${accents[idx % 4]}`}>{phase.timeline}</span>
      </div>
      <p className="text-[9px] md:text-xs text-white/45 leading-snug">{phase.detail}</p>
      <div className={`text-xs md:text-sm font-bold ${accents[idx % 4]} mt-auto pt-1 border-t border-white/5`}>
        <TrendingUp className="w-3 h-3 inline mr-1 opacity-60" />
        {phase.metric}
      </div>
    </motion.div>
  );
}

// ─── Main Section ────────────────────────────────────────────────
export function GrowthSection() {
  const content = useContent();
  const c = content.slide14;

  return (
    <section
      className={`${SECTION} bg-[#f0f4f8] dark:bg-linear-to-b dark:from-[#0a0e15] dark:via-[#0d1320] dark:to-[#0a0e15]`}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4 md:px-8 py-6 text-white overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-emerald-600/[0.05] blur-[120px] rounded-full pointer-events-none" />

        {/* Badge */}
        <motion.div
          className="ei-child inline-flex items-center gap-2 mb-2 md:mb-3 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Rocket className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] md:text-sm font-mono tracking-[0.2em] uppercase text-emerald-400/90">
            {c.badge}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="ei-child text-2xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold tracking-tight text-center mb-1 md:mb-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {c.title}
        </motion.h2>
        <motion.p
          className="ei-child text-xs md:text-base text-white/50 text-center max-w-xl mb-3 md:mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {c.subtitle}
        </motion.p>

        {/* Growth trend chart */}
        <div className="ei-child w-full max-w-3xl 2xl:max-w-5xl mb-3 md:mb-4">
          <GrowthChart phases={c.phases} />
        </div>

        {/* Phase cards row */}
        <div className="ei-child grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 w-full max-w-4xl 2xl:max-w-6xl mb-3 md:mb-4">
          {c.phases.map(
            (
              phase: { label: string; timeline: string; detail: string; metric: string },
              i: number,
            ) => (
              <PhaseCard key={phase.label} phase={phase} idx={i} />
            ),
          )}
        </div>

        {/* Early bird perks + summary */}
        <div className="ei-child w-full max-w-4xl 2xl:max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-3">
          <motion.div
            className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-3 md:p-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs md:text-sm font-bold text-amber-400 uppercase tracking-wider">
                Early Bird
              </span>
            </div>
            <ul className="space-y-1.5">
              {c.earlyBird.map((perk: string, i: number) => (
                <li key={i} className="text-[10px] md:text-sm text-white/60 flex items-start gap-2">
                  <span className="text-amber-400/60 mt-0.5">•</span>
                  {perk}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3 md:p-4 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <div className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-300">
              {c.summaryMetric}
            </div>
            <div className="text-xs md:text-sm text-white/40 font-mono uppercase tracking-wider mt-1">
              {c.summaryLabel}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
