"use client";

import React, { useState } from "react";
import {
  Rocket,
  Users,
  TrendingUp,
  Building2,
  Crown,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { MobileDetailModal, MobileExpandButton } from "./MobileDetailModal";
import { useContent } from "./useContent";

// ─── Phase Data ──────────────────────────────────────────────────
interface Phase {
  id: string;
  phase: string;
  title: string;
  timeline: string;
  icon: React.ReactNode;
  description: string;
  metrics: { label: string; value: string }[];
  features: string[];
  color: string;
  accentRgb: string;
}

// ─── Growth Chart (SVG) ──────────────────────────────────────────
function GrowthChart() {
  // Simulated area chart path
  const path = "M 0 180 C 40 175, 80 165, 120 155 C 160 140, 200 120, 240 90 C 280 60, 320 25, 400 5";
  const areaPath = path + " L 400 180 L 0 180 Z";

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <svg viewBox="0 0 400 200" className="w-full h-28 lg:h-36" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(56,189,248,0.3)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0)" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(56,189,248,0.6)" />
            <stop offset="50%" stopColor="rgba(167,139,250,0.6)" />
            <stop offset="100%" stopColor="rgba(245,158,11,0.6)" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[45, 90, 135].map((y) => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(148,163,184,0.06)" strokeWidth="0.5" />
        ))}

        {/* Area */}
        <motion.path
          d={areaPath}
          fill="url(#areaGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        />

        {/* Line */}
        <motion.path
          d={path}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
        />

        {/* Phase markers */}
        {[
          { x: 60, y: 170, label: "P1" },
          { x: 200, y: 105, label: "P2" },
          { x: 360, y: 15, label: "P3" },
        ].map((m, i) => (
          <g key={i}>
            <motion.circle
              cx={m.x} cy={m.y} r="4"
              fill={i === 0 ? "rgb(56,189,248)" : i === 1 ? "rgb(167,139,250)" : "rgb(245,158,11)"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2 + i * 0.2 }}
            />
            <text x={m.x} y={m.y - 10} textAnchor="middle" className="text-[9px] font-mono" fill="rgba(148,163,184,0.6)">
              {m.label}
            </text>
          </g>
        ))}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between px-2 mt-1">
        <span className="text-[8px] font-mono text-slate-600">Q1 2026</span>
        <span className="text-[8px] font-mono text-slate-600">Q4 2026</span>
        <span className="text-[8px] font-mono text-slate-600">2027+</span>
      </div>
    </motion.div>
  );
}

// ─── Phase Card ──────────────────────────────────────────────────
function PhaseCard({ phase, delay }: { phase: Phase; delay: number }) {
  const colorMap: Record<string, { icon: string; border: string; bg: string; badge: string }> = {
    cyan: { icon: "text-cyan-400", border: "border-cyan-500/20 hover:border-cyan-500/40", bg: "bg-cyan-500/5", badge: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400" },
    violet: { icon: "text-violet-400", border: "border-violet-500/20 hover:border-violet-500/40", bg: "bg-violet-500/5", badge: "bg-violet-500/15 border-violet-500/30 text-violet-400" },
    amber: { icon: "text-amber-400", border: "border-amber-500/20 hover:border-amber-500/40", bg: "bg-amber-500/5", badge: "bg-amber-500/15 border-amber-500/30 text-amber-400" },
  };
  const c = colorMap[phase.color] || colorMap.cyan;

  return (
    <motion.div
      className={`p-4 lg:p-5 rounded-2xl border ${c.border} ${c.bg} backdrop-blur-sm transition-all duration-500`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {/* Phase header */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1.5 rounded-lg bg-white/5 ${c.icon}`}>{phase.icon}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-mono font-bold ${c.icon}`}>{phase.phase}</span>
            <span className="text-[8px] font-mono text-slate-600">{phase.timeline}</span>
          </div>
          <h4 className="text-sm lg:text-base font-bold text-white">{phase.title}</h4>
        </div>
      </div>

      <p className="text-[10px] lg:text-xs text-slate-400 mb-3">{phase.description}</p>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {phase.metrics.map((m, i) => (
          <div key={i} className="text-center p-2 rounded-lg bg-white/3">
            <div className="text-sm lg:text-base font-black text-white font-mono">{m.value}</div>
            <div className="text-[8px] lg:text-[9px] text-slate-500 font-mono tracking-wider">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <ul className="space-y-1">
        {phase.features.map((f, i) => (
          <li key={i} className="flex items-center gap-1.5 text-[9px] lg:text-[10px] text-slate-300/80">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export function GrowthStrategySlide() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useContent().slide8;

  const phases: Phase[] = [
    {
      id: "seed",
      phase: t.phases[0].phase,
      title: t.phases[0].title,
      timeline: t.phases[0].timeline,
      icon: <Rocket className="w-5 h-5" />,
      description: t.phases[0].description,
      metrics: t.phases[0].metrics,
      features: t.phases[0].features,
      color: "cyan",
      accentRgb: "56,189,248",
    },
    {
      id: "growth",
      phase: t.phases[1].phase,
      title: t.phases[1].title,
      timeline: t.phases[1].timeline,
      icon: <Users className="w-5 h-5" />,
      description: t.phases[1].description,
      metrics: t.phases[1].metrics,
      features: t.phases[1].features,
      color: "violet",
      accentRgb: "167,139,250",
    },
    {
      id: "scale",
      phase: t.phases[2].phase,
      title: t.phases[2].title,
      timeline: t.phases[2].timeline,
      icon: <Crown className="w-5 h-5" />,
      description: t.phases[2].description,
      metrics: t.phases[2].metrics,
      features: t.phases[2].features,
      color: "amber",
      accentRgb: "245,158,11",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden bg-[#020617]">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, #0c1a2e 0%, #020617 70%)" }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <motion.div className="text-center mb-4 md:mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div
            className="inline-flex items-center gap-2 mb-2 md:mb-3 px-3 py-1 rounded-full border border-violet-500/25 bg-violet-500/8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TrendingUp className="w-3 h-3 text-violet-400" />
            <span className="text-[9px] md:text-xs font-mono tracking-[0.2em] uppercase text-violet-400/90">
              {t.badge}
            </span>
          </motion.div>

          <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t.title}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-violet-400 to-amber-400">
              {t.titleHighlight}
            </span>
          </h2>
        </motion.div>

        {/* Chart */}
        <div className="mb-4 lg:mb-6">
          <GrowthChart />
        </div>

        {/* Phase Cards — desktop */}
        <div className="hidden md:grid md:grid-cols-3 gap-4 lg:gap-5">
          {phases.map((p, i) => (
            <PhaseCard key={p.id} phase={p} delay={0.4 + i * 0.15} />
          ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-3">
          <PhaseCard phase={phases[0]} delay={0.4} />
          <MobileExpandButton label={t.mobileLabel} onClick={() => setMobileOpen(true)} />
        </div>
      </div>

      <MobileDetailModal open={mobileOpen} onClose={() => setMobileOpen(false)} title={t.mobileTitle}>
        <div className="space-y-4">
          {phases.map((p) => (
            <div key={p.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-cyan-400">{p.icon}</span>
                <span className="text-sm font-bold text-white">{p.title}</span>
                <span className="text-[9px] font-mono text-slate-500 ml-auto">{p.timeline}</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">{p.description}</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {p.metrics.map((m, i) => (
                  <div key={i} className="text-center p-2 rounded-lg bg-white/5">
                    <div className="text-sm font-bold text-white font-mono">{m.value}</div>
                    <div className="text-[8px] text-slate-500">{m.label}</div>
                  </div>
                ))}
              </div>
              <ul className="space-y-1">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </MobileDetailModal>
    </div>
  );
}
