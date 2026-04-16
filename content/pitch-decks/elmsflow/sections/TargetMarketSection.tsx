"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { Target, TrendingUp } from "lucide-react";

// ─── Color sets per card index ───────────────────────────────────
const CARD_THEMES = [
  { border: "border-blue-500/30", text: "text-blue-400", accentRgb: "59,130,246" },
  { border: "border-violet-500/30", text: "text-violet-400", accentRgb: "139,92,246" },
  { border: "border-cyan-500/30", text: "text-cyan-400", accentRgb: "6,182,212" },
  { border: "border-emerald-500/30", text: "text-emerald-400", accentRgb: "16,185,129" },
  { border: "border-amber-500/30", text: "text-amber-400", accentRgb: "245,158,11" },
  { border: "border-rose-500/30", text: "text-rose-400", accentRgb: "244,63,94" },
];

// ─── Segment Card with hover glow + tooltip ──────────────────────
function SegmentCard({
  label,
  stat,
  detail,
  growth,
  idx,
}: {
  label: string;
  stat: string;
  detail: string;
  growth: string;
  idx: number;
}) {
  const [hovered, setHovered] = useState(false);
  const theme = CARD_THEMES[idx % CARD_THEMES.length];

  return (
    <motion.div
      className={`relative rounded-xl border ${theme.border} backdrop-blur-sm p-4 lg:p-5 flex flex-col gap-2 cursor-default overflow-visible`}
      style={{
        background: `var(--card-bg, linear-gradient(135deg, rgba(${theme.accentRgb},0.08) 0%, rgba(15,23,42,0.7) 60%, rgba(${theme.accentRgb},0.04) 100%))`,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + idx * 0.08 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{
        scale: 1.03,
        transition: { type: "spring", stiffness: 300, damping: 18 },
      }}
    >
      {/* Light-mode card fill — must fully cover the dark inline gradient */}
      <div className="absolute inset-0 rounded-xl bg-white dark:bg-transparent pointer-events-none z-0 shadow-sm dark:shadow-none" />

      {/* Interactive glow background on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{
          boxShadow: hovered
            ? `0 0 24px rgba(${theme.accentRgb},0.25), 0 0 48px rgba(${theme.accentRgb},0.1), inset 0 1px 0 rgba(${theme.accentRgb},0.15)`
            : `0 0 0px transparent, inset 0 1px 0 rgba(255,255,255,0.03)`,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Shimmer on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute -left-1/2 top-0 w-[200%] h-full"
              style={{
                background: `linear-gradient(105deg, transparent 40%, rgba(${theme.accentRgb},0.06) 45%, rgba(${theme.accentRgb},0.12) 50%, rgba(${theme.accentRgb},0.06) 55%, transparent 60%)`,
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card content */}
      <div className="relative z-20">
        <div className="flex items-center justify-between">
          <span className={`relative z-10 text-xs md:text-sm font-bold text-slate-700 dark:text-white/90 truncate`}>
            {label}
          </span>
          <span className={`relative z-10 text-[10px] md:text-xs font-mono ${theme.text}`}>
            {growth}
          </span>
        </div>
        <span className={`relative z-10 text-base md:text-lg lg:text-xl font-extrabold ${theme.text}`}>
          {stat}
        </span>
        <p className="relative z-10 text-[9px] md:text-xs text-slate-500 dark:text-white/50 leading-snug line-clamp-2">
          {detail}
        </p>
      </div>

      {/* Hover tooltip with full detail */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute z-50 left-1/2 -translate-x-1/2 bottom-[calc(100%+8px)] w-64 rounded-xl border p-3 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, rgba(${theme.accentRgb},0.25) 0%, #0f172a 25%, #0c1322 100%)`,
              borderColor: `rgba(${theme.accentRgb},0.5)`,
              backdropFilter: "blur(24px)",
              boxShadow: `0 16px 48px rgba(0,0,0,0.85), 0 0 32px rgba(${theme.accentRgb},0.25), inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className={`text-xs font-bold ${theme.text} mb-1`}>{label}</div>
            <p className="text-[11px] text-slate-300 leading-relaxed">{detail}</p>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/10">
              <TrendingUp className={`w-3 h-3 ${theme.text}`} />
              <span className={`text-[10px] font-mono font-bold ${theme.text}`}>{growth}</span>
              <span className="text-[10px] text-white/40">·</span>
              <span className="text-[10px] font-bold text-white/70">{stat}</span>
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 rotate-45"
              style={{
                background: `#0c1322`,
                borderRight: `1px solid rgba(${theme.accentRgb},0.4)`,
                borderBottom: `1px solid rgba(${theme.accentRgb},0.4)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Section ────────────────────────────────────────────────
export function TargetMarketSection() {
  const content = useContent();
  const c = content.slide11;

  return (
    <section
      className={`${SECTION} bg-[#f0f4f8] dark:bg-linear-to-b dark:from-[#0a0e15] dark:via-[#0d1320] dark:to-[#0a0e15]`}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4 md:px-8 py-6 text-slate-800 dark:text-white overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/[0.06] blur-[120px] rounded-full pointer-events-none" />

        {/* Badge */}
        <motion.div
          className="ei-child inline-flex items-center gap-2 mb-3 md:mb-4 px-3 py-1 rounded-full border border-violet-500/25 bg-violet-500/[0.08]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Target className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[10px] md:text-sm font-mono tracking-[0.2em] uppercase text-violet-400/90">
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
          className="ei-child text-xs md:text-base text-slate-500 dark:text-white/50 text-center max-w-xl mb-4 md:mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {c.subtitle}
        </motion.p>

        {/* Segment grid */}
        <div className="ei-child grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full max-w-4xl 2xl:max-w-6xl">
          {c.segments.map((seg: { label: string; stat: string; detail: string; growth: string }, i: number) => (
            <SegmentCard
              key={seg.label}
              label={seg.label}
              stat={seg.stat}
              detail={seg.detail}
              growth={seg.growth}
              idx={i}
            />
          ))}
        </div>

        {/* Key message */}
        <motion.p
          className="ei-child text-xs md:text-base text-center text-violet-600 dark:text-violet-300/80 font-medium mt-4 md:mt-6 max-w-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {c.keyMessage}
        </motion.p>

        {/* Bottom stats */}
        <div className="ei-child flex items-center justify-center gap-6 md:gap-10 mt-3 md:mt-5">
          {c.stats.map((s: { value: string; label: string }, i: number) => (
            <motion.div
              key={s.label}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
            >
              <div className="text-xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
                {s.value}
              </div>
              <div className="text-[9px] md:text-xs text-slate-500 dark:text-white/40 font-mono uppercase tracking-wider">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
