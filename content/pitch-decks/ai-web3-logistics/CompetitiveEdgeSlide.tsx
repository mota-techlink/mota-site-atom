"use client";

import React from "react";
import {
  Zap,
  Shield,
  Globe2,
  Bot,
  Leaf,
  Coins,
  Clock,
  Network,
  Lock,
  Cpu,
} from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "./useContent";

// ─── Bento Cards ─────────────────────────────────────────────────
interface BentoItem {
  icon: React.ReactNode;
  title: string;
  stat: string;
  description: string;
  color: string;
  accentRgb: string;
  span: "normal" | "wide" | "tall";
  features: string[];
}

// ─── Single Bento Card ───────────────────────────────────────────
function BentoCard({ item, index }: { item: BentoItem; index: number }) {
  const colorMap: Record<string, { icon: string; border: string; bg: string; stat: string; dot: string }> = {
    cyan: { icon: "text-cyan-400", border: "border-cyan-500/15 hover:border-cyan-500/40", bg: "from-cyan-500/5 to-transparent", stat: "text-cyan-400", dot: "bg-cyan-400" },
    emerald: { icon: "text-emerald-400", border: "border-emerald-500/15 hover:border-emerald-500/40", bg: "from-emerald-500/5 to-transparent", stat: "text-emerald-400", dot: "bg-emerald-400" },
    amber: { icon: "text-amber-400", border: "border-amber-500/15 hover:border-amber-500/40", bg: "from-amber-500/5 to-transparent", stat: "text-amber-400", dot: "bg-amber-400" },
    violet: { icon: "text-violet-400", border: "border-violet-500/15 hover:border-violet-500/40", bg: "from-violet-500/5 to-transparent", stat: "text-violet-400", dot: "bg-violet-400" },
  };
  const c = colorMap[item.color] || colorMap.cyan;

  return (
    <motion.div
      className={`relative group p-5 lg:p-6 rounded-2xl border ${c.border} bg-linear-to-br ${c.bg}
        backdrop-blur-sm transition-all duration-500 hover:rotate-1 hover:scale-[1.02]
        ${item.span === "wide" ? "md:col-span-2" : ""}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.12, duration: 0.5 }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ boxShadow: `inset 0 0 40px rgba(${item.accentRgb},0.05)` }}
      />

      <div className="relative z-10">
        {/* Icon + Stat */}
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2.5 rounded-xl bg-white/5 ${c.icon}`}>{item.icon}</div>
          <div className={`text-right`}>
            <div className={`text-lg lg:text-xl font-black font-mono ${c.stat}`}>{item.stat}</div>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm md:text-base lg:text-lg font-bold text-white mb-1.5">
          {item.title}
        </h4>

        {/* Description */}
        <p className="text-[10px] md:text-xs lg:text-sm text-slate-400 leading-relaxed mb-3">
          {item.description}
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-1.5">
          {item.features.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-[8px] md:text-[9px] lg:text-[10px] font-mono px-2 py-0.5
                rounded-full border border-white/10 bg-white/3 text-slate-400"
            >
              <span className={`w-1 h-1 rounded-full ${c.dot}`} />
              {f}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Comparison Bar ──────────────────────────────────────────────
function ComparisonRow({ label, us, them, delay }: { label: string; us: number; them: number; delay: number }) {
  return (
    <motion.div
      className="flex items-center gap-3 text-[10px] lg:text-xs"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <span className="w-24 lg:w-32 text-slate-500 font-mono shrink-0">{label}</span>
      <div className="flex-1 flex items-center gap-1.5">
        <div className="flex-1 h-2 rounded bg-white/4 overflow-hidden">
          <motion.div
            className="h-full rounded bg-linear-to-r from-cyan-500 to-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${us}%` }}
            transition={{ delay: delay + 0.2, duration: 0.6 }}
          />
        </div>
        <span className="text-cyan-400 font-mono w-10 text-right">{us}%</span>
      </div>
      <div className="flex-1 flex items-center gap-1.5">
        <div className="flex-1 h-2 rounded bg-white/4 overflow-hidden">
          <motion.div
            className="h-full rounded bg-slate-600"
            initial={{ width: 0 }}
            animate={{ width: `${them}%` }}
            transition={{ delay: delay + 0.2, duration: 0.6 }}
          />
        </div>
        <span className="text-slate-500 font-mono w-10 text-right">{them}%</span>
      </div>
    </motion.div>
  );
}

// ─── Main Slide ──────────────────────────────────────────────────
export function CompetitiveEdgeSlide() {
  const t = useContent().slide9;

  const bentoItems: BentoItem[] = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: t.bentoItems[0].title,
      stat: t.bentoItems[0].stat,
      description: t.bentoItems[0].description,
      color: "cyan",
      accentRgb: "56,189,248",
      span: "wide",
      features: t.bentoItems[0].features,
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t.bentoItems[1].title,
      stat: t.bentoItems[1].stat,
      description: t.bentoItems[1].description,
      color: "emerald",
      accentRgb: "52,211,153",
      span: "normal",
      features: t.bentoItems[1].features,
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: t.bentoItems[2].title,
      stat: t.bentoItems[2].stat,
      description: t.bentoItems[2].description,
      color: "amber",
      accentRgb: "245,158,11",
      span: "normal",
      features: t.bentoItems[2].features,
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: t.bentoItems[3].title,
      stat: t.bentoItems[3].stat,
      description: t.bentoItems[3].description,
      color: "violet",
      accentRgb: "167,139,250",
      span: "wide",
      features: t.bentoItems[3].features,
    },
  ];
  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden bg-[#020617]">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 30%, #0f172a 0%, #020617 65%)" }} />
      <div className="absolute bottom-0 left-0 w-full h-[30%] bg-linear-to-t from-violet-900/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <motion.div className="text-center mb-4 md:mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div
            className="inline-flex items-center gap-2 mb-2 md:mb-3 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span className="text-[9px] md:text-xs font-mono tracking-[0.2em] uppercase text-emerald-400/90">
              {t.badge}
            </span>
          </motion.div>

          <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t.title}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-emerald-400">
              {t.titleHighlight}
            </span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mb-4 lg:mb-6">
          {bentoItems.map((item, i) => (
            <BentoCard key={item.title} item={item} index={i} />
          ))}
        </div>

        {/* Mini comparison */}
        <motion.div
          className="hidden md:block p-4 lg:p-5 rounded-2xl border border-white/5 bg-white/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-3 text-[10px] lg:text-xs mb-3">
            <span className="w-24 lg:w-32 text-slate-600 font-mono shrink-0">{t.comparisonMetric}</span>
            <span className="flex-1 text-center text-cyan-400 font-mono font-bold">{t.comparisonUs}</span>
            <span className="flex-1 text-center text-slate-500 font-mono">{t.comparisonThem}</span>
          </div>
          <div className="space-y-2.5">
            <ComparisonRow label={t.comparisonRows[0].label} us={t.comparisonRows[0].us} them={t.comparisonRows[0].them} delay={1.1} />
            <ComparisonRow label={t.comparisonRows[1].label} us={t.comparisonRows[1].us} them={t.comparisonRows[1].them} delay={1.2} />
            <ComparisonRow label={t.comparisonRows[2].label} us={t.comparisonRows[2].us} them={t.comparisonRows[2].them} delay={1.3} />
            <ComparisonRow label={t.comparisonRows[3].label} us={t.comparisonRows[3].us} them={t.comparisonRows[3].them} delay={1.4} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
