"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ClipboardCheck,
  TrendingDown,
  Globe,
  Sparkles,
  CheckCircle2,
  Zap,
  BarChart3,
  BrainCircuit,
} from "lucide-react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

/* ── Timing ──────────────────────────────────────────────── */
const CYCLE = 8_000; // ms for one full radar rotation
const PHASE = CYCLE / 4; // 2 s per quadrant

/* Sweep clockwise from 12 o'clock:
   phase 0 → top-right    → grid feature[1]
   phase 1 → bottom-right → grid feature[3]
   phase 2 → bottom-left  → grid feature[2]
   phase 3 → top-left     → grid feature[0]  */
const PHASE_MAP = [1, 3, 2, 0] as const;

/* ── Injected keyframes ──────────────────────────────────── */
const CSS = `
@keyframes rSweep{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes rPulse{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
@keyframes scanDown{0%{top:0;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:100%;opacity:0}}
`;

/* ── Accent palette per card ─────────────────────────────── */
const ACC = [
  {
    hi: "border-cyan-400/50 bg-cyan-500/[0.08] shadow-[0_0_30px_rgba(6,182,212,0.20)]",
    lo: "border-white/[0.06] bg-white/[0.02]",
    ic: "text-cyan-400",
  },
  {
    hi: "border-emerald-400/50 bg-emerald-500/[0.08] shadow-[0_0_30px_rgba(16,185,129,0.20)]",
    lo: "border-white/[0.06] bg-white/[0.02]",
    ic: "text-emerald-400",
  },
  {
    hi: "border-violet-400/50 bg-violet-500/[0.08] shadow-[0_0_30px_rgba(139,92,246,0.20)]",
    lo: "border-white/[0.06] bg-white/[0.02]",
    ic: "text-violet-400",
  },
  {
    hi: "border-amber-400/50 bg-amber-500/[0.08] shadow-[0_0_30px_rgba(245,158,11,0.20)]",
    lo: "border-white/[0.06] bg-white/[0.02]",
    ic: "text-amber-400",
  },
];

const ICONS = [
  <ClipboardCheck key="0" className="w-4 h-4 2xl:w-5 2xl:h-5" />,
  <ShieldCheck key="1" className="w-4 h-4 2xl:w-5 2xl:h-5" />,
  <Sparkles key="2" className="w-4 h-4 2xl:w-5 2xl:h-5" />,
  <Globe key="3" className="w-4 h-4 2xl:w-5 2xl:h-5" />,
];

/* ═════════════════════════════════════════════════════════════
   ComplianceSection – Radar-Scan AI-Driven Design
   ═════════════════════════════════════════════════════════════ */
export function ComplianceSection() {
  const { slide15: c } = useContent();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 4), PHASE);
    return () => clearInterval(id);
  }, []);

  const activeIdx = PHASE_MAP[phase];

  return (
    <section
      className={`${SECTION} bg-[#f0f4f8] dark:bg-linear-to-b dark:from-[#0a0e15] dark:via-[#0d1320] dark:to-[#0a0e15]`}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="relative w-full flex flex-col items-center px-4 md:px-8 py-3 md:py-4 text-slate-800 dark:text-white">
        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none" />

        {/* ── Badge ─────────────────────────────────────── */}
        <motion.div
          className="ei-child inline-flex items-center gap-2 mb-1.5 md:mb-2 px-3 py-0.5 rounded-full border border-cyan-500/25 bg-cyan-500/8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-cyan-400/90">
            {c.badge}
          </span>
        </motion.div>

        {/* ── Title ─────────────────────────────────────── */}
        <motion.h2
          className="ei-child text-xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold tracking-tight text-center mb-0.5 md:mb-1"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {c.title}
        </motion.h2>
        <motion.p
          className="ei-child text-[10px] md:text-sm text-slate-500 dark:text-white/50 text-center max-w-lg mb-2 md:mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {c.subtitle}
        </motion.p>

        {/* ── Stats row ────────────────────────────────── */}
        <div className="ei-child grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 w-full max-w-3xl 2xl:max-w-5xl mb-2 md:mb-3">
          {[
            { icon: <TrendingDown className="w-4 h-4 2xl:w-5 2xl:h-5 text-emerald-400" />, accent: "border-emerald-500/25 bg-emerald-500/[0.06]" },
            { icon: <Zap className="w-4 h-4 2xl:w-5 2xl:h-5 text-cyan-400" />, accent: "border-cyan-500/25 bg-cyan-500/[0.06]" },
            { icon: <Globe className="w-4 h-4 2xl:w-5 2xl:h-5 text-violet-400" />, accent: "border-violet-500/25 bg-violet-500/[0.06]" },
            { icon: <BarChart3 className="w-4 h-4 2xl:w-5 2xl:h-5 text-amber-400" />, accent: "border-amber-500/25 bg-amber-500/[0.06]" },
          ].map((s, i) => (
            <motion.div
              key={i}
              className={`rounded-xl border ${s.accent} backdrop-blur-sm p-2 md:p-3 flex flex-col gap-1 text-center`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
            >
              <div className="mx-auto">{s.icon}</div>
              <div className="text-base md:text-xl 2xl:text-2xl font-extrabold text-slate-800 dark:text-white">{c.stats[i].value}</div>
              <div className="text-[8px] md:text-[10px] 2xl:text-xs text-slate-500 dark:text-white/50 font-mono uppercase tracking-wider">{c.stats[i].label}</div>
            </motion.div>
          ))}
        </div>

        {/* ═══ RADAR FRAME ═══════════════════════════════ */}
        <motion.div
          className="ei-child relative w-full max-w-3xl 2xl:max-w-5xl rounded-2xl border border-slate-200 dark:border-cyan-500/10 bg-[#070b12]/70 backdrop-blur-md overflow-hidden"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* ── Radar rings (ellipses for rectangular container) ── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-70"
            viewBox="0 0 800 500"
            preserveAspectRatio="xMidYMid slice"
          >
            {[70, 120, 170, 220].map((r) => (
              <ellipse
                key={r}
                cx={400}
                cy={250}
                rx={r * 1.5}
                ry={r}
                fill="none"
                stroke="rgba(6,182,212,0.06)"
                strokeWidth={0.7}
              />
            ))}
            {/* Crosshair */}
            <line
              x1={400}
              y1={15}
              x2={400}
              y2={485}
              stroke="rgba(6,182,212,0.05)"
              strokeWidth={0.5}
              strokeDasharray="5 5"
            />
            <line
              x1={15}
              y1={250}
              x2={785}
              y2={250}
              stroke="rgba(6,182,212,0.05)"
              strokeWidth={0.5}
              strokeDasharray="5 5"
            />
            {/* Tick marks at 45° intervals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = ((deg - 90) * Math.PI) / 180;
              const r1 = 210,
                r2 = 225;
              return (
                <line
                  key={deg}
                  x1={400 + r1 * 1.5 * Math.cos(rad)}
                  y1={250 + r1 * Math.sin(rad)}
                  x2={400 + r2 * 1.5 * Math.cos(rad)}
                  y2={250 + r2 * Math.sin(rad)}
                  stroke="rgba(6,182,212,0.10)"
                  strokeWidth={0.5}
                />
              );
            })}
            {/* Center dot */}
            <circle cx={400} cy={250} r={2} fill="rgba(6,182,212,0.3)" />
          </svg>

          {/* ── Sweep beam (rotating conic gradient) ───── */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 2000,
                height: 2000,
                marginTop: -1000,
                marginLeft: -1000,
                background: `conic-gradient(from 0deg at 50% 50%,
                  rgba(6,182,212,0.22) 0deg,
                  transparent 4deg,
                  transparent 300deg,
                  rgba(6,182,212,0.01) 330deg,
                  rgba(6,182,212,0.10) 355deg,
                  rgba(6,182,212,0.22) 360deg)`,
                animation: `rSweep ${CYCLE}ms linear infinite`,
              }}
            />
          </div>

          {/* ── Content layer (grid + center badge) ────── */}
          <div className="relative z-10 p-3 md:p-5 2xl:p-7">
            {/* 2 × 2 feature cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 2xl:gap-5">
              {c.features.map(
                (
                  f: {
                    title: string;
                    description: string;
                    items: string[];
                  },
                  i: number,
                ) => {
                  const on = i === activeIdx;
                  const a = ACC[i];
                  return (
                    <motion.div
                      key={i}
                      className={`relative rounded-xl border backdrop-blur-sm p-3 md:p-4 2xl:p-5 transition-all duration-700 ${on ? a.hi : a.lo}`}
                      animate={{ opacity: on ? 1 : 0.4 }}
                      transition={{ duration: 0.6 }}
                    >
                      {/* Scan line sweeps top→bottom on active card */}
                      {on && (
                        <div
                          key={`sl-${phase}`}
                          className="absolute inset-x-0 h-px pointer-events-none z-20"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)",
                            animation: `scanDown ${PHASE}ms linear forwards`,
                          }}
                        />
                      )}

                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={a.ic}>{ICONS[i]}</span>
                        <h3 className="text-xs md:text-sm 2xl:text-base font-bold text-white">
                          {f.title}
                        </h3>
                      </div>
                      <ul className="space-y-1">
                        {f.items.map((item, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-1.5 text-[10px] md:text-[11px] 2xl:text-xs text-white/55"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-400/60 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                },
              )}
            </div>

            {/* ── Center "AI DRIVEN" floating badge ────── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div
                className="flex flex-col items-center gap-0.5 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-[#070b12]/95 border border-cyan-400/30 backdrop-blur-md shadow-[0_0_40px_rgba(6,182,212,0.15)]"
                style={{ animation: "rPulse 3s ease-in-out infinite" }}
              >
                <BrainCircuit className="w-5 h-5 md:w-6 md:h-6 text-cyan-400" />
                <span className="text-[10px] md:text-xs font-black tracking-[0.35em] text-cyan-300 uppercase">
                  AI Driven
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Bottom note ───────────────────────────────── */}
        <motion.p
          className="ei-child text-[10px] md:text-xs text-center text-cyan-400/70 font-mono mt-2 md:mt-3 max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {c.bottomNote}
        </motion.p>
      </div>
    </section>
  );
}
