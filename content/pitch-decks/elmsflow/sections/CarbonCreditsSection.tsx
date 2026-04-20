"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Factory,
  BarChart3,
  Globe,
  Recycle,
  Scale,
  Eye,
  FileCheck,
  TreePine,
  Zap,
} from "lucide-react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

/* ═══════════════════════════════════════════════════════════════
   ADAPTIVE FONT HELPERS
   ═══════════════════════════════════════════════════════════════ */
const F = {
  badge: "text-[10px] md:text-xs font-mono tracking-[0.18em] uppercase",
  sectionTitle: "text-lg md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight",
  subtitle: "text-[10px] md:text-sm text-slate-500 dark:text-white/50",
  tabLabel: "text-[10px] md:text-xs font-bold uppercase tracking-wider",
  cardTitle: "text-xs md:text-sm lg:text-base font-extrabold",
  cardBody: "text-[9px] md:text-xs lg:text-sm leading-relaxed",
  statValue: "text-sm md:text-lg 2xl:text-xl font-bold",
  statLabel: "text-[8px] md:text-[9px] 2xl:text-xs font-mono uppercase tracking-wider",
  listItem: "text-[9px] md:text-xs lg:text-sm leading-snug",
  chartLabel: "text-[8px] md:text-[10px] 2xl:text-xs",
};

/* ═══════════════════════════════════════════════════════════════
   TAB DATA
   ═══════════════════════════════════════════════════════════════ */
const TAB_ICONS = [
  <Leaf key="0" className="w-3.5 h-3.5" />,
  <BarChart3 key="1" className="w-3.5 h-3.5" />,
  <TrendingUp key="2" className="w-3.5 h-3.5" />,
  <ShieldCheck key="3" className="w-3.5 h-3.5" />,
];

const TAB_ACCENTS = [
  { border: "border-emerald-500/30", bg: "bg-emerald-500/8", text: "text-emerald-400", glow: "rgba(16,185,129,0.15)" },
  { border: "border-cyan-500/30", bg: "bg-cyan-500/8", text: "text-cyan-400", glow: "rgba(6,182,212,0.15)" },
  { border: "border-amber-500/30", bg: "bg-amber-500/8", text: "text-amber-400", glow: "rgba(245,158,11,0.15)" },
  { border: "border-violet-500/30", bg: "bg-violet-500/8", text: "text-violet-400", glow: "rgba(139,92,246,0.15)" },
];

/* ═══════════════════════════════════════════════════════════════
   EXEC-BRIEF TAB — Donut chart + key definition
   ═══════════════════════════════════════════════════════════════ */
function ExecBriefPanel({ data }: { data: any }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
      {/* Left — definition card */}
      <motion.div
        className="rounded-xl border border-emerald-500/15 bg-white/2 p-3 lg:p-5 flex flex-col gap-3"
        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 border border-emerald-500/25">
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className={`${F.cardTitle} text-emerald-400`}>{data.definitionTitle}</h3>
        </div>
        <p className={`${F.cardBody} text-slate-300`}>{data.definition}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-auto">
          {data.stats.map((s: { value: string; label: string }, i: number) => (
            <motion.div
              key={i}
              className="rounded-lg border border-emerald-500/10 bg-emerald-500/4 p-2 text-center"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.08 }}
            >
              <div className={`${F.statValue} text-emerald-400`}>{s.value}</div>
              <div className={`${F.statLabel} text-white/40 mt-0.5`}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right — interactive donut: compliance vs voluntary */}
      <motion.div
        className="rounded-xl border border-emerald-500/15 bg-white/2 p-3 lg:p-5 flex flex-col items-center gap-2"
        initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
      >
        <h3 className={`${F.cardTitle} text-white/80 self-start`}>{data.donutTitle}</h3>
        <div className="relative">
          <svg viewBox="0 0 120 120" className="w-32 h-32 md:w-40 md:h-40 2xl:w-48 2xl:h-48">
            {data.donutSegments.map((seg: { value: number; color: string; label: string }, i: number) => {
              const total = data.donutSegments.reduce((s: number, x: any) => s + x.value, 0);
              const r = 48;
              const cx = 60, cy = 60;
              let cumAngle = -90;
              for (let j = 0; j < i; j++) cumAngle += (data.donutSegments[j].value / total) * 360;
              const angle = (seg.value / total) * 360;
              const startRad = (cumAngle * Math.PI) / 180;
              const endRad = ((cumAngle + angle) * Math.PI) / 180;
              const largeArc = angle > 180 ? 1 : 0;
              const x1 = cx + r * Math.cos(startRad);
              const y1 = cy + r * Math.sin(startRad);
              const x2 = cx + r * Math.cos(endRad);
              const y2 = cy + r * Math.sin(endRad);
              const inner = 30;
              const ix1 = cx + inner * Math.cos(endRad);
              const iy1 = cy + inner * Math.sin(endRad);
              const ix2 = cx + inner * Math.cos(startRad);
              const iy2 = cy + inner * Math.sin(startRad);
              const d = `M${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} L${ix1},${iy1} A${inner},${inner} 0 ${largeArc},0 ${ix2},${iy2} Z`;
              return (
                <motion.path
                  key={i} d={d} fill={seg.color}
                  className="cursor-pointer transition-all"
                  style={{ opacity: hovered !== null && hovered !== i ? 0.3 : 1, filter: hovered === i ? "brightness(1.3)" : "none" }}
                  onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
                />
              );
            })}
            <circle cx="60" cy="60" r="26" fill="#0d1320" />
            <text x="60" y="57" textAnchor="middle" className="fill-emerald-400 text-[8px] font-bold" dominantBaseline="middle">
              {hovered !== null ? `${data.donutSegments[hovered].value}%` : "CO₂e"}
            </text>
            <text x="60" y="67" textAnchor="middle" className="fill-white/40 text-[5px]" dominantBaseline="middle">
              {hovered !== null ? data.donutSegments[hovered].label : "1 credit = 1t"}
            </text>
          </svg>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {data.donutSegments.map((seg: { label: string; color: string; value: number }, i: number) => (
            <div key={i} className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${hovered !== null && hovered !== i ? "opacity-30" : ""}`}
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className={`${F.chartLabel} text-white/60`}>{seg.label} ({seg.value}%)</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOW MARKET WORKS TAB — lifecycle flow + key concepts
   ═══════════════════════════════════════════════════════════════ */
function MarketWorksPanel({ data }: { data: any }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % (data.lifecycleSteps?.length ?? 4));
    }, 3000);
    return () => clearInterval(timer);
  }, [data.lifecycleSteps?.length]);

  const LIFECYCLE_ICONS = [
    <FileCheck key="0" className="w-5 h-5" />,
    <Eye key="1" className="w-5 h-5" />,
    <CheckCircle2 key="2" className="w-5 h-5" />,
    <Recycle key="3" className="w-5 h-5" />,
  ];
  const STEP_COLORS = [
    { text: "text-cyan-400", border: "border-cyan-400/40", bg: "bg-cyan-500/10", glow: "shadow-cyan-500/20", ring: "ring-cyan-400/30", bar: "bg-cyan-400" },
    { text: "text-violet-400", border: "border-violet-400/40", bg: "bg-violet-500/10", glow: "shadow-violet-500/20", ring: "ring-violet-400/30", bar: "bg-violet-400" },
    { text: "text-emerald-400", border: "border-emerald-400/40", bg: "bg-emerald-500/10", glow: "shadow-emerald-500/20", ring: "ring-emerald-400/30", bar: "bg-emerald-400" },
    { text: "text-amber-400", border: "border-amber-400/40", bg: "bg-amber-500/10", glow: "shadow-amber-500/20", ring: "ring-amber-400/30", bar: "bg-amber-400" },
  ];

  return (
    <div className="flex flex-col gap-3 lg:gap-4">
      {/* Key concepts — horizontal cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {data.concepts.map((c: { icon: string; title: string; body: string }, i: number) => {
          const icons = [<Scale key="u" className="w-4 h-4" />, <Globe key="m" className="w-4 h-4" />, <TreePine key="c" className="w-4 h-4" />];
          const colors = ["text-cyan-400", "text-violet-400", "text-amber-400"];
          const borders = ["border-cyan-500/15", "border-violet-500/15", "border-amber-500/15"];
          const bgs = ["bg-cyan-500/[0.04]", "bg-violet-500/[0.04]", "bg-amber-500/[0.04]"];
          return (
            <motion.div key={i}
              className={`rounded-xl border ${borders[i]} ${bgs[i]} p-3 lg:p-4 flex flex-col gap-1.5`}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="flex items-center gap-2">
                <span className={colors[i]}>{icons[i]}</span>
                <h4 className={`${F.cardTitle} ${colors[i]}`}>{c.title}</h4>
              </div>
              <p className={`${F.cardBody} text-white/60`}>{c.body}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Lifecycle — animated pipeline */}
      <motion.div
        className="rounded-xl border border-cyan-500/15 bg-white/2 p-3 lg:p-5"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
      >
        <h4 className={`${F.cardTitle} text-cyan-400 mb-4`}>{data.lifecycleTitle}</h4>

        {/* Timeline bar */}
        <div className="relative flex items-start gap-0 mb-4">
          {/* Connecting line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/8 rounded-full" />
          <motion.div
            className="absolute top-4 left-4 h-0.5 rounded-full bg-linear-to-r from-cyan-400 via-violet-400 to-emerald-400"
            animate={{ width: `${((activeStep + 1) / data.lifecycleSteps.length) * 100 - 4}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {data.lifecycleSteps.map((step: { label: string; detail: string }, i: number) => {
            const sc = STEP_COLORS[i];
            const isActive = activeStep === i;
            const isDone = i < activeStep;
            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => setActiveStep(i)}
                className="flex-1 flex flex-col items-center gap-1.5 relative z-10 cursor-pointer group"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
              >
                {/* Step circle */}
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive
                      ? `${sc.border} ${sc.bg} ${sc.glow} shadow-lg ring-2 ${sc.ring} scale-110`
                      : isDone
                        ? "border-emerald-400/40 bg-emerald-500/15"
                        : "border-white/15 bg-white/5 group-hover:border-white/30"
                  }`}
                  animate={isActive ? { scale: [1.1, 1.2, 1.1] } : {}}
                  transition={isActive ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className={isActive ? sc.text : "text-white/40"}>{LIFECYCLE_ICONS[i]}</span>
                  )}
                </motion.div>
                {/* Step label */}
                <span className={`${F.tabLabel} transition-colors ${
                  isActive ? sc.text : isDone ? "text-emerald-400/70" : "text-white/40"
                }`}>
                  {step.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Active step detail card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            className={`rounded-lg border ${STEP_COLORS[activeStep].border} ${STEP_COLORS[activeStep].bg} p-3 lg:p-4`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={STEP_COLORS[activeStep].text}>{LIFECYCLE_ICONS[activeStep]}</span>
              <h4 className={`${F.cardTitle} ${STEP_COLORS[activeStep].text}`}>
                {data.lifecycleSteps[activeStep].label}
              </h4>
            </div>
            <p className={`${F.cardBody} text-white/60`}>{data.lifecycleSteps[activeStep].detail}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WHY EXECUTIVES CARE TAB — interactive cards
   ═══════════════════════════════════════════════════════════════ */
function ExecCarePanel({ data }: { data: any }) {
  const [highlighted, setHighlighted] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHighlighted((prev) => (prev + 1) % (data.reasons?.length ?? 6));
    }, 2200);
    return () => clearInterval(timer);
  }, [data.reasons?.length]);

  const CARE_ICONS = [
    <TrendingUp key="0" className="w-4 h-4" />,
    <DollarSign key="1" className="w-4 h-4" />,
    <AlertTriangle key="2" className="w-4 h-4" />,
    <Factory key="3" className="w-4 h-4" />,
    <Zap key="4" className="w-4 h-4" />,
    <Globe key="5" className="w-4 h-4" />,
  ];
  const CARE_COLORS = [
    "text-emerald-400", "text-cyan-400", "text-rose-400",
    "text-violet-400", "text-amber-400", "text-blue-400",
  ];
  const CARE_BORDERS = [
    "border-emerald-500/15", "border-cyan-500/15", "border-rose-500/15",
    "border-violet-500/15", "border-amber-500/15", "border-blue-500/15",
  ];
  const CARE_BGS = [
    "bg-emerald-500/4", "bg-cyan-500/[0.04]", "bg-rose-500/[0.04]",
    "bg-violet-500/[0.04]", "bg-amber-500/[0.04]", "bg-blue-500/[0.04]",
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 p-1">
      {data.reasons.map((r: { title: string; body: string }, i: number) => (
        <motion.div
          key={i}
          className={`rounded-xl border ${CARE_BORDERS[i]} ${CARE_BGS[i]} p-3 lg:p-4 text-left transition-all duration-500 ${
            highlighted === i ? "ring-2 ring-white/20 scale-[1.02] shadow-lg shadow-white/5" : "scale-100"
          }`}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className={CARE_COLORS[i]}>{CARE_ICONS[i]}</span>
            <h4 className={`${F.cardTitle} ${CARE_COLORS[i]} leading-tight`}>{r.title}</h4>
          </div>
          <p className={`${F.cardBody} text-white/60`}>{r.body}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   QUALITY & GOVERNANCE TAB — interactive checklist
   ═══════════════════════════════════════════════════════════════ */
function GovernancePanel({ data }: { data: any }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [autoIdx, setAutoIdx] = useState(0);
  const totalItems = data.checklist?.length ?? 6;

  useEffect(() => {
    const timer = setInterval(() => {
      setAutoIdx((prev) => {
        const next = prev + 1;
        if (next <= totalItems) {
          /* Add next item */
          setChecked(new Set(Array.from({ length: next }, (_, k) => k)));
          return next;
        }
        /* All checked — pause briefly then restart */
        setChecked(new Set());
        return 0;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [totalItems]);

  const allChecked = checked.size === data.checklist.length;

  const CHECK_ICONS = [
    <Zap key="0" className="w-4 h-4" />,
    <Eye key="1" className="w-4 h-4" />,
    <TreePine key="2" className="w-4 h-4" />,
    <Globe key="3" className="w-4 h-4" />,
    <Scale key="4" className="w-4 h-4" />,
    <FileCheck key="5" className="w-4 h-4" />,
  ];
  const CHECK_COLORS = [
    "text-violet-400", "text-cyan-400", "text-emerald-400",
    "text-amber-400", "text-rose-400", "text-blue-400",
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Progress bar */}
      <motion.div
        className="rounded-xl border border-violet-500/15 bg-white/2 p-3 lg:p-4"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className={`${F.tabLabel} text-violet-400`}>{data.progressLabel}</span>
          <span className={`${F.statLabel} text-white/50`}>
            {checked.size}/{data.checklist.length}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-linear-to-r from-violet-500 via-emerald-400 to-cyan-400"
            animate={{ width: `${(checked.size / data.checklist.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <AnimatePresence>
          {allChecked && (
            <motion.div
              className="mt-2 flex items-center gap-2 text-emerald-400"
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className={`${F.cardBody} font-bold`}>{data.allPassedLabel}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Checklist grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {data.checklist.map((item: { title: string; body: string }, i: number) => {
          const done = checked.has(i);
          return (
            <motion.div
              key={i}
              className={`rounded-xl border p-3 lg:p-4 text-left transition-all ${
                done
                  ? "border-emerald-500/30 bg-emerald-500/6 ring-1 ring-emerald-500/20"
                  : "border-white/8 bg-white/2"
              }`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.06 }}
            >
              <div className="flex items-start gap-2.5">
                <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                  done ? "bg-emerald-500/20 border-emerald-500/40" : "bg-white/5 border-white/15"
                }`}>
                  {done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className={CHECK_COLORS[i]}>{CHECK_ICONS[i]}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`${F.cardTitle} ${done ? "text-emerald-400" : "text-white/80"} leading-tight`}>{item.title}</h4>
                  <p className={`${F.listItem} text-white/45 mt-1`}>{item.body}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN SECTION
   ═══════════════════════════════════════════════════════════════ */
export function CarbonCreditsSection() {
  const content = useContent();
  const c = content.slide17;
  const [activeTab, setActiveTab] = useState(0);

  const panels = useMemo(
    () => [
      <ExecBriefPanel key="brief" data={c.tabs[0]} />,
      <MarketWorksPanel key="market" data={c.tabs[1]} />,
      <ExecCarePanel key="exec" data={c.tabs[2]} />,
      <GovernancePanel key="gov" data={c.tabs[3]} />,
    ],
    [c],
  );

  return (
    <section
      className={`${SECTION} bg-[#f0f4f8] dark:bg-linear-to-b dark:from-[#0a0e15] dark:via-[#0d1320] dark:to-[#0a0e15]`}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-3 md:px-6 lg:px-8 py-4 md:py-6 text-white overflow-y-auto overflow-x-hidden scrollbar-none">
        {/* Background glow */}
        <div className="absolute top-1/4 right-1/4 w-100 h-100 bg-emerald-600/4 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/3 w-87.5 h-87.5 bg-cyan-500/3 blur-[100px] rounded-full pointer-events-none" />

        {/* Badge */}
        <motion.div
          className="ei-child inline-flex items-center gap-2 mb-2 md:mb-3 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/8"
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        >
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          <span className={`${F.badge} text-emerald-400/90`}>{c.badge}</span>
        </motion.div>

        {/* Title */}
        <motion.h2
          className={`ei-child ${F.sectionTitle} text-center mb-0.5`}
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
        >
          <span className="text-slate-800 dark:text-white">{c.title} </span>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">
            {c.titleHighlight}
          </span>
        </motion.h2>
        <motion.p
          className={`ei-child ${F.subtitle} text-center max-w-2xl mb-3 md:mb-4`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
        >
          {c.subtitle}
        </motion.p>

        {/* Tabs */}
        <motion.div
          className="ei-child flex flex-wrap items-center justify-center gap-1.5 md:gap-2 mb-3 md:mb-4 w-full max-w-3xl"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
        >
          {c.tabLabels.map((label: string, i: number) => {
            const a = TAB_ACCENTS[i];
            const active = activeTab === i;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full border transition-all cursor-pointer ${
                  active
                    ? `${a.border} ${a.bg} ${a.text} scale-105 shadow-lg`
                    : "border-white/10 bg-white/2 text-white/50 hover:text-white/70 hover:bg-white/4"
                }`}
                style={active ? { boxShadow: `0 0 16px ${a.glow}` } : undefined}
              >
                <span className={active ? a.text : "text-white/40"}>{TAB_ICONS[i]}</span>
                <span className={F.tabLabel}>{label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tab hint — per-character color wave */}
        <div className="ei-child text-[9px] md:text-xs text-center mb-2 md:mb-3 font-mono tracking-wide font-bold flex items-center justify-center flex-wrap">
          {Array.from(String(c.tabHint)).map((ch: string, i: number) => (
            <motion.span
              key={i}
              initial={{ color: "#22d3ee" }}
              animate={{ color: ["#22d3ee", "#fbbf24", "#a78bfa"] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.06,
              }}
              style={{ display: "inline-block", whiteSpace: ch === " " ? "pre" : undefined }}
            >
              {ch}
            </motion.span>
          ))}
        </div>

        {/* Content area */}
        <div className="ei-child w-full max-w-5xl 2xl:max-w-6xl" data-scrollable>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {panels[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom note */}
        <motion.p
          className="ei-child text-[9px] md:text-xs text-emerald-400/50 font-mono text-center mt-2 md:mt-3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        >
          {c.bottomNote}
        </motion.p>
      </div>
    </section>
  );
}
