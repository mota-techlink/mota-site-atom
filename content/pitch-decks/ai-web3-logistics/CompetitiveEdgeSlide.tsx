"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Zap,
  Shield,
  Bot,
  Leaf,
  Cpu,
  ChevronDown,
  BarChart3,
  Coins,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "./useContent";

// ─── Types ───────────────────────────────────────────────────────
interface BentoItem {
  icon: React.ReactNode;
  title: string;
  stat: string;
  description: string;
  color: string;
  accentRgb: string;
  features: string[];
}

// ─── Floating Particles ──────────────────────────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated Border Glow ────────────────────────────────────────
function AnimatedBorderGlow({ rgb, active }: { rgb: string; active: boolean }) {
  return (
    <motion.div
      className="absolute -inset-px rounded-2xl pointer-events-none"
      style={{
        background: `linear-gradient(135deg, rgba(${rgb},${active ? 0.4 : 0.08}) 0%, transparent 50%, rgba(${rgb},${active ? 0.2 : 0.04}) 100%)`,
      }}
      animate={active ? {
        background: [
          `linear-gradient(135deg, rgba(${rgb},0.4) 0%, transparent 50%, rgba(${rgb},0.2) 100%)`,
          `linear-gradient(225deg, rgba(${rgb},0.3) 0%, transparent 50%, rgba(${rgb},0.4) 100%)`,
          `linear-gradient(315deg, rgba(${rgb},0.4) 0%, transparent 50%, rgba(${rgb},0.2) 100%)`,
        ],
      } : {}}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    />
  );
}

// ─── Pulsing Stat ────────────────────────────────────────────────
function PulsingStat({ value, colorClass }: { value: string; colorClass: string }) {
  return (
    <motion.div
      className={`text-xl lg:text-2xl xl:text-3xl font-black font-mono ${colorClass}`}
      animate={{ textShadow: ["0 0 8px currentColor", "0 0 20px currentColor", "0 0 8px currentColor"] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {value}
    </motion.div>
  );
}

// ─── Single Bento Card (click to expand) ─────────────────────────
function BentoCard({
  item,
  index,
  expanded,
  onToggle,
}: {
  item: BentoItem;
  index: number;
  expanded: boolean;
  onToggle: () => void;
}) {
  const colorMap: Record<string, { icon: string; border: string; bg: string; stat: string; dot: string; glow: string }> = {
    cyan:    { icon: "text-cyan-400",    border: "border-cyan-500/20",    bg: "from-cyan-500/8 to-transparent",    stat: "text-cyan-400",    dot: "bg-cyan-400",    glow: "shadow-cyan-500/20" },
    emerald: { icon: "text-emerald-400", border: "border-emerald-500/20", bg: "from-emerald-500/8 to-transparent", stat: "text-emerald-400", dot: "bg-emerald-400", glow: "shadow-emerald-500/20" },
    amber:   { icon: "text-amber-400",   border: "border-amber-500/20",   bg: "from-amber-500/8 to-transparent",   stat: "text-amber-400",   dot: "bg-amber-400",   glow: "shadow-amber-500/20" },
    violet:  { icon: "text-violet-400",  border: "border-violet-500/20",  bg: "from-violet-500/8 to-transparent",  stat: "text-violet-400",  dot: "bg-violet-400",  glow: "shadow-violet-500/20" },
  };
  const c = colorMap[item.color] || colorMap.cyan;

  return (
    <motion.div
      className={`relative group cursor-pointer rounded-2xl border ${c.border} bg-linear-to-br ${c.bg}
        backdrop-blur-sm transition-shadow duration-500
        ${expanded ? `shadow-lg ${c.glow}` : "hover:shadow-md"}`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.25 + index * 0.1, duration: 0.5, type: "spring", stiffness: 120 }}
      onClick={onToggle}
      layout
    >
      <AnimatedBorderGlow rgb={item.accentRgb} active={expanded} />

      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: `inset 0 0 60px rgba(${item.accentRgb},0.06)` }}
        animate={expanded ? { opacity: 1 } : { opacity: 0 }}
        whileHover={{ opacity: 0.8 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative z-10 p-5 lg:p-6">
        {/* Top row: Icon + Title + Stat */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-4">
            <motion.div
              className={`p-2.5 lg:p-3 rounded-xl bg-white/5 ${c.icon}`}
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              {item.icon}
            </motion.div>
            <h4 className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white">
              {item.title}
            </h4>
          </div>
          <div className="flex items-center gap-3">
            <PulsingStat value={item.stat} colorClass={c.stat} />
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-slate-500"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-white/5 mt-4">
                {/* Description */}
                <motion.p
                  className="text-xs md:text-sm lg:text-base text-slate-400 leading-relaxed mb-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {item.description}
                </motion.p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2">
                  {item.features.map((f, i) => (
                    <motion.span
                      key={i}
                      className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-mono px-3 py-1
                        rounded-full border border-white/10 bg-white/5 text-slate-300"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + i * 0.06 }}
                    >
                      <motion.span
                        className={`w-1.5 h-1.5 rounded-full ${c.dot}`}
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                      />
                      {f}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Animated Comparison Bar ─────────────────────────────────────
function ComparisonRow({
  label,
  us,
  them,
  delay,
  visible,
}: {
  label: string;
  us: number;
  them: number;
  delay: number;
  visible: boolean;
}) {
  return (
    <motion.div
      className="flex items-center gap-3 text-xs lg:text-sm"
      initial={{ opacity: 0, x: -20 }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ delay, duration: 0.4 }}
    >
      <span className="w-28 lg:w-36 text-slate-500 font-mono shrink-0">{label}</span>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #06b6d4, #8b5cf6)" }}
            initial={{ width: 0 }}
            animate={visible ? { width: `${us}%` } : { width: 0 }}
            transition={{ delay: delay + 0.15, duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <motion.span
          className="text-cyan-400 font-mono font-bold w-12 text-right"
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay + 0.5 }}
        >
          {us}%
        </motion.span>
      </div>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-slate-600"
            initial={{ width: 0 }}
            animate={visible ? { width: `${them}%` } : { width: 0 }}
            transition={{ delay: delay + 0.15, duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <motion.span
          className="text-slate-500 font-mono w-12 text-right"
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay + 0.5 }}
        >
          {them}%
        </motion.span>
      </div>
    </motion.div>
  );
}

// ─── Main Slide ──────────────────────────────────────────────────
export function CompetitiveEdgeSlide() {
  const t = useContent().slide9;
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Auto-cycle cards when none is manually selected
  const [autoCycle, setAutoCycle] = useState(true);
  useEffect(() => {
    if (!autoCycle) return;
    const timer = setInterval(() => {
      setExpandedCard((prev) => {
        const next = prev === null ? 0 : (prev + 1) % 4;
        return next;
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [autoCycle]);

  const handleToggle = useCallback((index: number) => {
    setAutoCycle(false);
    setExpandedCard((prev) => (prev === index ? null : index));
  }, []);

  const bentoItems: BentoItem[] = [
    {
      icon: <Coins className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: t.bentoItems[0].title,
      stat: t.bentoItems[0].stat,
      description: t.bentoItems[0].description,
      color: "cyan",
      accentRgb: "56,189,248",
      features: t.bentoItems[0].features,
    },
    {
      icon: <Shield className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: t.bentoItems[1].title,
      stat: t.bentoItems[1].stat,
      description: t.bentoItems[1].description,
      color: "emerald",
      accentRgb: "52,211,153",
      features: t.bentoItems[1].features,
    },
    {
      icon: <Leaf className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: t.bentoItems[2].title,
      stat: t.bentoItems[2].stat,
      description: t.bentoItems[2].description,
      color: "amber",
      accentRgb: "245,158,11",
      features: t.bentoItems[2].features,
    },
    {
      icon: <Bot className="w-6 h-6 lg:w-7 lg:h-7" />,
      title: t.bentoItems[3].title,
      stat: t.bentoItems[3].stat,
      description: t.bentoItems[3].description,
      color: "violet",
      accentRgb: "167,139,250",
      features: t.bentoItems[3].features,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden bg-[#020617]">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 30%, #0f172a 0%, #020617 65%)" }} />
      <div className="absolute bottom-0 left-0 w-full h-[30%] bg-linear-to-t from-violet-900/5 to-transparent pointer-events-none" />
      <FloatingParticles />

      {/* Animated grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(rgba(56,189,248,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <motion.div className="text-center mb-5 lg:mb-8" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <motion.div
            className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: "spring" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            </motion.div>
            <span className="text-xs md:text-sm font-mono tracking-[0.2em] uppercase text-emerald-400/90">
              {t.badge}
            </span>
          </motion.div>

          <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {t.title}{" "}
            <motion.span
              className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-emerald-400"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              {t.titleHighlight}
            </motion.span>
          </h2>
        </motion.div>

        {/* Bento cards - vertical stack, click to expand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 mb-4 lg:mb-5">
          {bentoItems.map((item, i) => (
            <BentoCard
              key={item.title}
              item={item}
              index={i}
              expanded={expandedCard === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </div>

        {/* Comparison toggle */}
        <motion.div className="hidden md:block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <motion.button
            className="mx-auto flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/3
              text-xs font-mono text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer"
            onClick={() => setShowComparison((v) => !v)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{showComparison ? "Hide" : "Show"} {t.comparisonMetric}</span>
            <motion.div animate={{ rotate: showComparison ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {showComparison && (
              <motion.div
                className="mt-3 p-5 lg:p-6 rounded-2xl border border-white/5 bg-white/2 backdrop-blur-sm"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3 text-xs lg:text-sm mb-4">
                  <span className="w-28 lg:w-36 text-slate-600 font-mono shrink-0">{t.comparisonMetric}</span>
                  <span className="flex-1 text-center text-cyan-400 font-mono font-bold">{t.comparisonUs}</span>
                  <span className="flex-1 text-center text-slate-500 font-mono">{t.comparisonThem}</span>
                </div>
                <div className="space-y-3">
                  {t.comparisonRows.map((row, i) => (
                    <ComparisonRow key={row.label} label={row.label} us={row.us} them={row.them} delay={0.1 + i * 0.1} visible={showComparison} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
