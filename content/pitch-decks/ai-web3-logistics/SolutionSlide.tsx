"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  User,
  Smartphone,
  Tablet,
  Monitor,
  Brain,
  MessageSquare,
  Mic,
  Camera,
  Zap,
  Package,
  Truck,
  Printer,
  BoxSelect,
  ArrowUpDown,
  Plane,
  ShieldCheck,
  Thermometer,
  Navigation,
  Leaf,
  FileText,
  Bell,
  Sparkles,
  UserCheck,
  ShoppingCart,
  Bitcoin,
  Headphones,
  Search,
  X,
  Check,
  Server,
  Wrench,
  Bot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileDetailModal } from "./MobileDetailModal";
import { useContent } from "./useContent";
import { useDeckLocale } from "@/components/pitch-deck";

/* ── Icon maps ── */
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  pickup:  <Truck className="w-6 h-6" />,
  print:   <Printer className="w-6 h-6" />,
  pack:    <BoxSelect className="w-6 h-6" />,
  sort:    <ArrowUpDown className="w-6 h-6" />,
  freight: <Plane className="w-6 h-6" />,
  customs: <ShieldCheck className="w-6 h-6" />,
};
const SERVICE_COLORS: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  pickup:  { color: "text-amber-400",   bg: "bg-amber-500/12",   border: "border-amber-500/30",   glow: "0 0 16px rgba(245,158,11,0.25)" },
  print:   { color: "text-sky-400",     bg: "bg-sky-500/12",     border: "border-sky-500/30",     glow: "0 0 16px rgba(56,189,248,0.25)" },
  pack:    { color: "text-violet-400",  bg: "bg-violet-500/12",  border: "border-violet-500/30",  glow: "0 0 16px rgba(139,92,246,0.25)" },
  sort:    { color: "text-emerald-400", bg: "bg-emerald-500/12", border: "border-emerald-500/30", glow: "0 0 16px rgba(52,211,153,0.25)" },
  freight: { color: "text-rose-400",    bg: "bg-rose-500/12",    border: "border-rose-500/30",    glow: "0 0 16px rgba(251,113,133,0.25)" },
  customs: { color: "text-teal-400",    bg: "bg-teal-500/12",    border: "border-teal-500/30",    glow: "0 0 16px rgba(45,212,191,0.25)" },
};
const MODULE_ICONS: Record<string, React.ReactNode> = {
  register: <UserCheck className="w-6 h-6" />,
  order:    <ShoppingCart className="w-6 h-6" />,
  payment:  <Bitcoin className="w-6 h-6" />,
  docs:     <FileText className="w-6 h-6" />,
  support:  <Headphones className="w-6 h-6" />,
  search:   <Search className="w-6 h-6" />,
};
const MODULE_ICONS_LG: Record<string, React.ReactNode> = {
  register: <UserCheck className="w-8 h-8" />,
  order:    <ShoppingCart className="w-8 h-8" />,
  payment:  <Bitcoin className="w-8 h-8" />,
  docs:     <FileText className="w-8 h-8" />,
  support:  <Headphones className="w-8 h-8" />,
  search:   <Search className="w-8 h-8" />,
};
const MODULE_COLORS: Record<string, { color: string; bg: string; border: string; glow: string }> = {
  register: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25", glow: "0 0 18px rgba(52,211,153,0.3)" },
  order:    { color: "text-sky-400",     bg: "bg-sky-500/10",     border: "border-sky-500/25",     glow: "0 0 18px rgba(56,189,248,0.3)" },
  payment:  { color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/25",   glow: "0 0 18px rgba(245,158,11,0.3)" },
  docs:     { color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/25",  glow: "0 0 18px rgba(139,92,246,0.3)" },
  support:  { color: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/25",    glow: "0 0 18px rgba(251,113,133,0.3)" },
  search:   { color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/25",    glow: "0 0 18px rgba(34,211,238,0.3)" },
};
const TRACK_ICONS = [
  <Package className="w-4 h-4" key="c" />,
  <Thermometer className="w-4 h-4" key="t" />,
  <Navigation className="w-4 h-4" key="g" />,
  <Leaf className="w-4 h-4" key="l" />,
];

/* ── AI Model brand styles ── */
const AI_MODELS_CONFIG: { name: string; icon: React.ReactNode; color: string; bg: string; border: string; glow: string }[] = [
  { name: "ChatGPT", icon: <Sparkles className="w-4 h-4" />, color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30", glow: "shadow-[0_0_14px_rgba(52,211,153,0.4)]" },
  { name: "Gemini",  icon: <Zap className="w-4 h-4" />,      color: "text-blue-400",    bg: "bg-blue-500/15",    border: "border-blue-500/30",    glow: "shadow-[0_0_14px_rgba(96,165,250,0.4)]" },
  { name: "Grok",    icon: <Bot className="w-4 h-4" />,       color: "text-orange-400",  bg: "bg-orange-500/15",  border: "border-orange-500/30",  glow: "shadow-[0_0_14px_rgba(251,146,60,0.4)]" },
];

/* ── Service ring positions (tighter hex around hub) ── */
const SVC_POSITIONS = [
  { left: "66%",  top: "58%" },   // pickup
  { left: "75%",  top: "53.5%" }, // print
  { left: "84%",  top: "58%" },   // pack
  { left: "84%",  top: "73%" },   // sort
  { left: "75%",  top: "77.5%" }, // freight
  { left: "66%",  top: "73%" },   // customs
];


/* ── Step Badge ── */
function StepBadge({ n, x, y, text, delay = 0, tooltipPlacement = "bottom" }: {
  n: number;
  x: string;
  y: string;
  text: string;
  delay?: number;
  tooltipPlacement?: "top" | "bottom" | "left" | "right";
}) {
  const [isHovered, setIsHovered] = useState(false);
  const tooltipPlacementClass =
    tooltipPlacement === "top"
      ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
      : tooltipPlacement === "left"
      ? "right-full mr-2 top-1/2 -translate-y-1/2"
      : tooltipPlacement === "right"
      ? "left-full ml-2 top-1/2 -translate-y-1/2"
      : "top-full mt-2 left-1/2 -translate-x-1/2";

  return (
    <motion.div
      className="absolute z-20 flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-[11px] font-black text-slate-900 shadow-[0_0_12px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/30 cursor-help"
      style={{ left: x, top: y, transform: "translate(-50%,-50%)", zIndex: isHovered ? 20000 : 20 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 20 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {n}

      <AnimatePresence>
        {isHovered && (
          <motion.div
            className={`absolute ${tooltipPlacementClass} px-3 py-1.5 rounded-md border border-amber-400/35 bg-slate-950/95 backdrop-blur-sm whitespace-nowrap pointer-events-none`}
            style={{ zIndex: 20001 }}
            initial={{ opacity: 0, y: -3, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -3, scale: 0.96 }}
            transition={{ duration: 0.12 }}
          >
            <span className="text-[20px] leading-none font-mono font-bold text-amber-200">{text}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Animated dashed arrow ── */
function DashedArrow({ x1, y1, x2, y2, delay = 0, color = "rgba(34,211,238,0.25)" }: {
  x1: number; y1: number; x2: number; y2: number; delay?: number; color?: string;
}) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeDasharray="6 5"
      vectorEffect="non-scaling-stroke"
      style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      initial={{ strokeDashoffset: 0, opacity: 0 }}
      animate={{ strokeDashoffset: -22, opacity: 1 }}
      transition={{
        strokeDashoffset: { duration: 2.5, repeat: Infinity, ease: "linear" },
        opacity: { delay, duration: 0.4 },
      }}
    />
  );
}

/* ── Step label ── */
function StepLabel({ text, x, y, delay = 0, color = "text-slate-500" }: {
  text: string; x: string; y: string; delay?: number; color?: string;
}) {
  return (
    <motion.span
      className={`absolute z-30 text-sm lg:text-base font-mono font-semibold ${color} whitespace-nowrap pointer-events-none`}
      style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.95 }}
      transition={{ delay }}
    >
      {text}
    </motion.span>
  );
}


/* ═══════════════════════════════════════════════════════════════ */
/*                       MAIN COMPONENT                          */
/* ═══════════════════════════════════════════════════════════════ */
export function SolutionSlide() {
  const t = useContent().slide3;
  const { deckLocale } = useDeckLocale();
  const [hoveredSvc, setHoveredSvc] = useState<string | null>(null);
  const [activeModId, setActiveModId] = useState<string | null>(null);
  const [hoveredMod, setHoveredMod] = useState<string | null>(null);
  const [mobileId, setMobileId] = useState<string | null>(null);

  /* Cycle active AI model (flash one-by-one) */
  const [activeModelIdx, setActiveModelIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setActiveModelIdx(p => (p + 1) % AI_MODELS_CONFIG.length), 2000);
    return () => clearInterval(iv);
  }, []);

  /* Random breathing: pick a random module or service to "pulse" every 1.8s */
  const allBreathIds = useMemo(() => {
    const mods = (t.modules || []).map((m: any) => m.id);
    const svcs = (t.services || []).map((s: any) => `svc-${s.id}`);
    return [...mods, ...svcs];
  }, [t.modules, t.services]);

  const [breathId, setBreathId] = useState<string | null>(null);
  useEffect(() => {
    if (allBreathIds.length === 0) return;
    const iv = setInterval(() => {
      setBreathId(allBreathIds[Math.floor(Math.random() * allBreathIds.length)]);
    }, 1800);
    return () => clearInterval(iv);
  }, [allBreathIds]);

  const stepTexts = useMemo(() => {
    if (deckLocale === "zh") {
      return ["输入", "处理", "选择", "审批", "发起工具调用", "执行", "输出", "返回", "生成", "响应"];
    }
    if (deckLocale === "ar") {
      return ["إدخال", "معالجة", "اختيار", "موافقة", "طلب استدعاء الأداة", "تنفيذ", "مخرجات", "إرجاع", "توليد", "استجابة"];
    }
    return ["Input", "Process", "Select", "Approval", "Request tool call", "Invoke", "Output", "Return", "Generate", "Response"];
  }, [deckLocale]);

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden bg-[#020617]">
      {/* ── Background ── */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 45%, #0c1e3a 0%, #020617 70%)" }} />
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: "radial-gradient(circle, rgba(34,211,238,0.5) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }} />

      {/* ── Header ── */}
      <motion.div
        className="relative z-30 text-center pt-2 lg:pt-3 pb-0 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 mb-1 px-5 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-base lg:text-lg font-mono uppercase text-cyan-400 tracking-widest">{t.badge}</span>
        </div>
        <h2 className="text-2xl md:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-tight">
          {t.title}{" "}
          <span className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">{t.titleHighlight}</span>
        </h2>
      </motion.div>

      {/* ═══════════ Desktop MCP Architecture Diagram ═══════════ */}
      <div className="hidden md:flex relative flex-1 mx-1 lg:mx-4 mb-0 items-center justify-center">

        {/* ═══ Master SVG: all dashed flow arrows ═══ */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-5"
          viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet">
          <DashedArrow x1={125} y1={250} x2={195} y2={250} delay={0.5} color="rgba(34,211,238,0.5)" />
          <DashedArrow x1={280} y1={210} x2={280} y2={260} delay={0.7} color="rgba(139,92,246,0.58)" />
          <DashedArrow x1={310} y1={260} x2={310} y2={210} delay={0.8} color="rgba(139,92,246,0.58)" />
          <DashedArrow x1={195} y1={310} x2={125} y2={310} delay={0.9} color="rgba(245,158,11,0.52)" />
          <DashedArrow x1={390} y1={270} x2={540} y2={270} delay={1.0} color="rgba(34,211,238,0.6)" />
          <DashedArrow x1={700} y1={320} x2={700} y2={380} delay={1.1} color="rgba(34,211,238,0.48)" />
          <DashedArrow x1={650} y1={395} x2={540} y2={340} delay={1.2} color="rgba(34,211,238,0.48)" />
          <DashedArrow x1={540} y1={310} x2={390} y2={310} delay={1.3} color="rgba(34,211,238,0.6)" />
          <DashedArrow x1={295} y1={340} x2={295} y2={410} delay={1.4} color="rgba(139,92,246,0.58)" />
          <DashedArrow x1={195} y1={430} x2={125} y2={430} delay={1.5} color="rgba(34,211,238,0.52)" />
        </svg>

        {/* ═══ Step Badges ═══ */}
        <StepBadge n={1}  x="13.2%" y="43.5%" text={stepTexts[0]} delay={0.5} tooltipPlacement="right" />
        <StepBadge n={2}  x="26%"   y="34%"   text={stepTexts[1]} delay={0.7} tooltipPlacement="bottom" />
        <StepBadge n={3}  x="33%"   y="34%"   text={stepTexts[2]} delay={0.8} tooltipPlacement="bottom" />
        <StepBadge n={4}  x="13.2%" y="56.2%" text={stepTexts[3]} delay={0.9} tooltipPlacement="right" />
        <StepBadge n={5}  x="43.5%" y="48.3%" text={stepTexts[4]} delay={1.0} tooltipPlacement="top" />
        <StepBadge n={6}  x="71%"   y="57.2%" text={stepTexts[5]} delay={1.1} tooltipPlacement="top" />
        <StepBadge n={7}  x="59.5%" y="65.2%" text={stepTexts[6]} delay={1.2} tooltipPlacement="top" />
        <StepBadge n={8}  x="42.2%" y="55.4%" text={stepTexts[7]} delay={1.3} tooltipPlacement="top" />
        <StepBadge n={9}  x="30.5%" y="62.5%" text={stepTexts[8]} delay={1.4} tooltipPlacement="top" />
        <StepBadge n={10} x="12.8%" y="75.2%" text={stepTexts[9]} delay={1.5} tooltipPlacement="right" />

        {/* ═══ Step Labels ═══ */}
        <StepLabel text={stepTexts[0]} x="16.3%" y="39.6%" delay={0.6} color="text-slate-300/85" />
        <StepLabel text={stepTexts[1]} x="24%"   y="28.2%" delay={0.8} color="text-slate-300/85" />
        <StepLabel text={stepTexts[2]} x="35.9%" y="28.2%" delay={0.9} color="text-slate-300/85" />
        <StepLabel text={stepTexts[3]} x="16.8%" y="59.5%" delay={1.0} color="text-amber-300/85" />
        <StepLabel text={stepTexts[4]} x="46.5%" y="42.3%" delay={1.1} color="text-slate-300/90" />
        <StepLabel text={stepTexts[5]} x="75.2%" y="55.5%" delay={1.2} color="text-cyan-300/85" />
        <StepLabel text={stepTexts[6]} x="58.8%" y="68.8%" delay={1.3} color="text-cyan-300/85" />
        <StepLabel text={stepTexts[7]} x="43.4%" y="59.8%" delay={1.4} color="text-slate-300/85" />
        <StepLabel text={stepTexts[8]} x="32.6%" y="69.2%" delay={1.5} color="text-violet-300/85" />
        <StepLabel text={stepTexts[9]} x="16.2%" y="72.8%" delay={1.6} color="text-slate-300/85" />


        {/* ════════════ LEFT: Shipper ════════════ */}
        <motion.div
          className="absolute z-20 flex flex-col items-center gap-1"
          style={{ left: "6%", top: "43%", transform: "translateY(-50%)" }}
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
        >
          <div className="relative p-2.5 rounded-full border-2 border-amber-500/50 bg-amber-950/30 backdrop-blur-sm shadow-[0_0_18px_rgba(245,158,11,0.15)]">
            <User className="w-6 h-6 text-amber-400" />
          </div>
          <span className="text-sm lg:text-base font-extrabold text-amber-200">{t.sender}</span>
          <div className="flex gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-amber-500/60" />
            <Tablet className="w-3.5 h-3.5 text-amber-500/60" />
            <Monitor className="w-3.5 h-3.5 text-amber-500/60" />
          </div>
        </motion.div>

        {/* Query bubble */}
        <motion.div
          className="absolute z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-600/40 backdrop-blur-sm"
          style={{ left: "13%", top: "42%", transform: "translateY(-50%)" }}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
        >
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-bold text-slate-300">Query</span>
        </motion.div>

        {/* AI Response */}
        <motion.div
          className="absolute z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/20 backdrop-blur-sm"
          style={{ left: "5.5%", top: "80%", transform: "translateY(-50%)" }}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.6 }}
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-bold text-cyan-300">AI Response</span>
        </motion.div>

        {/* Consignee */}
        <motion.div
          className="absolute z-20 flex flex-col items-center gap-1"
          style={{ left: "6%", top: "90%", transform: "translateY(-50%)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }}
        >
          <div className="relative p-2.5 rounded-full border-2 border-emerald-500/50 bg-emerald-950/30 backdrop-blur-sm shadow-[0_0_18px_rgba(52,211,153,0.15)]">
            <User className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-sm lg:text-base font-extrabold text-emerald-200">{t.receiver}</span>
        </motion.div>


        {/* ════════════ CENTER: Compact AI Agent Host ════════════ */}
        <motion.div
          className="absolute z-6 rounded-2xl border-2 border-dashed border-violet-500/30 bg-violet-950/6"
          style={{ left: "17%", top: "15%", width: "24%", height: "72%" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        >
          <div className="absolute -top-3.5 left-3 px-2.5 py-0.5 bg-[#020617] text-violet-400 text-xs font-bold font-mono flex items-center gap-1.5 rounded">
            <Brain className="w-3.5 h-3.5" />
            AI Agent Host
          </div>
        </motion.div>

        {/* Chat / Voice / Image — above Brain */}
        <motion.div
          className="absolute z-20 flex items-center gap-3"
          style={{ left: "29%", top: "27%", transform: "translate(-50%,-50%)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
        >
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400/80" />
            <span className="text-xs text-emerald-400/70 font-bold">{t.commChat}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mic className="w-3.5 h-3.5 text-amber-400/80" />
            <span className="text-xs text-amber-400/70 font-bold">{t.commVoice}</span>
          </div>
          <div className="flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-sky-400/80" />
            <span className="text-xs text-sky-400/70 font-bold">{t.commImage}</span>
          </div>
        </motion.div>

        {/* ── Single Brain ── */}
        <motion.div
          className="absolute z-20 flex flex-col items-center gap-1"
          style={{ left: "29%", top: "45%", transform: "translate(-50%,-50%)" }}
          initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
        >
          <div className="relative p-3 rounded-xl border-2 border-violet-500/40 bg-violet-950/60 backdrop-blur-sm shadow-[0_0_24px_rgba(139,92,246,0.2)]">
            <Brain className="w-8 h-8 text-violet-400" />
            <motion.div className="absolute -inset-1.5 rounded-2xl border border-violet-400/15 pointer-events-none"
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }} />
          </div>
          <span className="text-sm font-extrabold text-violet-300">{t.aiLabel}</span>
        </motion.div>

        {/* ── AI Model badges (flash one-by-one) ── */}
        <motion.div
          className="absolute z-20 flex gap-1.5"
          style={{ left: "29%", top: "60%", transform: "translate(-50%,-50%)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        >
          {AI_MODELS_CONFIG.map((m, i) => (
            <motion.div
              key={m.name}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border backdrop-blur-sm transition-all duration-500 ${m.border} ${m.bg}`}
              animate={{
                opacity: activeModelIdx === i ? 1 : 0.35,
                scale: activeModelIdx === i ? 1.08 : 0.95,
              }}
              transition={{ duration: 0.5 }}
              style={activeModelIdx === i ? { boxShadow: m.glow.match(/shadow-\[(.+)\]/)?.[1]?.replace(/_/g, " ") || "none" } : {}}
            >
              <span className={m.color}>{m.icon}</span>
              <span className={`text-[11px] font-bold ${m.color}`}>{m.name}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Approval badge */}
        <motion.div
          className="absolute z-20 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/15 backdrop-blur-sm"
          style={{ left: "20%", top: "72%", transform: "translateY(-50%)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
        >
          <Check className="w-3.5 h-3.5 text-green-400" />
          <span className="text-[10px] lg:text-xs font-mono text-amber-300/80">Approval</span>
        </motion.div>


        {/* MCP Protocol badge */}
        <motion.div
          className="absolute z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/25 backdrop-blur-sm shadow-[0_0_15px_rgba(245,158,11,0.15)]"
          style={{ left: "44%", top: "50%", transform: "translate(-50%,-50%)" }}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-base font-mono font-extrabold text-amber-400 tracking-wider">{t.mcpLabel}</span>
        </motion.div>


        {/* ════════════ RIGHT: MCP Server Box (narrower) ════════════ */}
        <motion.div
          className="absolute z-6 rounded-2xl border-2 border-dashed border-cyan-500/25 bg-cyan-950/4"
          style={{ left: "54%", top: "15%", width: "38%", height: "76%" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
        >
          <div className="absolute -top-3.5 left-3 px-2.5 py-0.5 bg-[#020617] text-cyan-400 text-xs font-bold font-mono flex items-center gap-1.5 rounded">
            <Server className="w-4 h-4" />
            MCP Server
          </div>
        </motion.div>

        {/* ── AI Modules: 2cols × 3rows, icon-left layout, colored blocks ── */}
        <motion.div
          className="absolute z-20"
          style={{ left: "54%", top: "17%", width: "38%" }}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
        >
          <div className="w-full h-full flex justify-center">
            <div className="w-[80%]">
              <div className="flex items-center gap-1 mb-1.5">
                <Wrench className="w-4 h-4 text-cyan-400/60" />
                <span className="text-xs font-mono font-bold text-cyan-400/60 uppercase tracking-wider">AI Modules · MCP Tools</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {t.modules.map((mod: any, i: number) => {
                  const mc = MODULE_COLORS[mod.id] || MODULE_COLORS.search;
                  const isBreathing = breathId === mod.id;
                  return (
                    <motion.button
                      key={mod.id}
                      onClick={() => setActiveModId(mod.id)}
                      onMouseEnter={() => setHoveredMod(mod.id)}
                      onMouseLeave={() => setHoveredMod(null)}
                      style={{ zIndex: hoveredMod === mod.id ? 20000 : 1, position: "relative" }}
                      className={`flex min-w-0 items-center justify-center gap-2 px-2 py-1.5 rounded-xl border-2 backdrop-blur-sm cursor-pointer transition-all duration-200 group text-left ${
                        activeModId === mod.id
                          ? `${mc.border} ${mc.bg} shadow-lg`
                          : "border-slate-700/40 bg-slate-900/80 hover:bg-slate-800/80"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: 1, y: 0,
                        boxShadow: isBreathing ? mc.glow : "0 0 0 transparent",
                        borderColor: isBreathing ? mc.border.replace("border-", "").replace("/25", "") : undefined,
                      }}
                      transition={{ delay: 0.8 + i * 0.06, boxShadow: { duration: 0.8 } }}
                      whileHover={{ scale: 1.03, y: -1 }}
                    >
                      <div className={`p-1.5 rounded-lg border shrink-0 ${mc.bg} ${mc.border} ${mc.color}`}>{MODULE_ICONS[mod.id]}</div>
                      <span className={`min-w-0 truncate text-sm font-bold leading-tight ${mc.color}`}>{mod.title}</span>

                      {/* Hover tooltip — high z-index */}
                      <AnimatePresence>
                        {hoveredMod === mod.id && activeModId !== mod.id && (
                          <motion.div
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72"
                            style={{ zIndex: 20001 }}
                            initial={{ opacity: 0, y: -3, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -3, scale: 0.97 }}
                            transition={{ duration: 0.12 }}
                          >
                            <div className="bg-[#0a0f1e] backdrop-blur-xl border border-cyan-500/30 rounded-xl p-3 shadow-[0_0_50px_rgba(0,0,0,0.98)]">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`p-1.5 rounded-lg ${mc.bg} ${mc.border} border ${mc.color}`}>{MODULE_ICONS[mod.id]}</div>
                                <span className="text-sm font-bold text-cyan-300">{mod.title}</span>
                              </div>
                              <div className="flex gap-2 mb-1.5">
                                <div className="flex-1 px-2 py-1.5 bg-red-500/8 rounded-lg border border-red-500/15">
                                  <div className="text-[8px] text-red-400 font-mono uppercase mb-0.5 font-bold">Pain Point</div>
                                  <p className="text-[10px] text-red-300/80 leading-snug">{mod.traditional}</p>
                                </div>
                                <div className="flex-1 px-2 py-1.5 bg-cyan-500/8 rounded-lg border border-cyan-500/15">
                                  <div className="text-[8px] text-cyan-400 font-mono uppercase mb-0.5 font-bold">Solution</div>
                                  <p className="text-[10px] text-cyan-200 leading-snug font-medium">{mod.solution}</p>
                                </div>
                              </div>
                              <div className="text-[9px] text-slate-500 font-mono text-right">Click for details →</div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tool Output badge */}
        <motion.div
          className="absolute z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/60 border border-slate-600/30 backdrop-blur-sm"
          style={{ left: "53%", top: "55%", transform: "translateY(-50%)" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400/60" />
          <span className="text-xs font-mono font-bold text-slate-400">Tool Output</span>
        </motion.div>

        {/* ── Logistics Center Hub ── */}
        <motion.div
          className="absolute z-20 flex flex-col items-center gap-0.5"
          style={{ left: "75%", top: "65.5%", transform: "translate(-50%,-50%)" }}
          initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.55 }}
        >
          <div className="relative p-2.5 rounded-2xl border-2 border-cyan-500/50 bg-cyan-950/60 backdrop-blur-xl shadow-[0_0_28px_rgba(34,211,238,0.12)]">
            <Package className="w-7 h-7 text-cyan-300" />
            <motion.div className="absolute -inset-1.5 rounded-3xl border border-cyan-400/12 pointer-events-none"
              animate={{ scale: [1, 1.06, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }} />
          </div>
          <span className="text-sm font-extrabold text-cyan-100">{t.logisticsHub}</span>
          <span className="text-[9px] font-mono text-cyan-500/50">MCP Client</span>
        </motion.div>

        {/* ── Logistics Services (tight ring, bigger icons, colored) ── */}
        {t.services.map((svc: any, i: number) => {
          const sc = SERVICE_COLORS[svc.id] || SERVICE_COLORS.pickup;
          const isSvcBreathing = breathId === `svc-${svc.id}`;
          return (
            <motion.div
              key={svc.id}
              className="absolute"
              style={{ left: SVC_POSITIONS[i].left, top: SVC_POSITIONS[i].top, transform: "translate(-50%,-50%)", zIndex: hoveredSvc === svc.id ? 20000 : 20 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1, scale: 1,
                boxShadow: isSvcBreathing ? sc.glow : "0 0 0 transparent",
              }}
              transition={{ delay: 1.1 + i * 0.05, boxShadow: { duration: 0.8 } }}
              onMouseEnter={() => setHoveredSvc(svc.id)}
              onMouseLeave={() => setHoveredSvc(null)}
            >
              <div className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl border-2 backdrop-blur-sm cursor-default transition-all duration-200 ${
                hoveredSvc === svc.id
                  ? `${sc.border} ${sc.bg} shadow-lg`
                  : `border-slate-700/30 bg-slate-900/70 hover:${sc.border}`
              }`}>
                <div className={`transition-colors ${sc.color}`}>
                  {SERVICE_ICONS[svc.id]}
                </div>
                <span className={`text-xs font-bold transition-colors whitespace-nowrap leading-tight ${sc.color}`}>{svc.title}</span>
              </div>

              {/* Service hover tooltip */}
              <AnimatePresence>
                {hoveredSvc === svc.id && (
                  <motion.div
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-52"
                    style={{ zIndex: 20001 }}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 3 }}
                    transition={{ duration: 0.1 }}
                  >
                    <div className="bg-[#0a0f1e] backdrop-blur-xl border border-cyan-500/30 rounded-xl p-2.5 shadow-[0_0_40px_rgba(0,0,0,0.98)]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`p-1 rounded-lg ${sc.bg} ${sc.border} border ${sc.color}`}>{SERVICE_ICONS[svc.id]}</div>
                        <span className="text-sm font-bold text-cyan-300">{svc.title}</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{svc.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}


        {/* ── Tracking bar ── */}
        <motion.div className="absolute z-10 left-1/2 -translate-x-1/2 bottom-6"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }}>
          <motion.div
            className="flex items-center gap-4 px-6 py-2.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.08)]"
            animate={{ boxShadow: ["0 0 20px rgba(34,211,238,0.06)", "0 0 30px rgba(34,211,238,0.18)", "0 0 20px rgba(34,211,238,0.06)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-sm lg:text-base font-mono text-cyan-400 uppercase tracking-widest mr-1 font-bold">{t.trackingTitle}</span>
            {t.tracking.map((label: string, i: number) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="text-cyan-400">{TRACK_ICONS[i]}</div>
                <span className="text-sm lg:text-base text-cyan-200 whitespace-nowrap font-semibold">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Hint */}
        <motion.div className="absolute bottom-0 right-4 z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          <span className="text-[10px] text-slate-600 font-mono">{t.hintText}</span>
        </motion.div>


        {/* ═══ Comparison Popup ═══ */}
        <AnimatePresence>
          {activeModId && (() => {
            const mod = t.modules.find((m: any) => m.id === activeModId);
            if (!mod) return null;
            const mc = MODULE_COLORS[mod.id] || MODULE_COLORS.search;
            return (
              <motion.div
                key="comparison"
                className="absolute inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <motion.div className="absolute inset-0 bg-black/65 backdrop-blur-md" onClick={() => setActiveModId(null)} />
                <motion.div
                  className="relative bg-[#020617]/97 backdrop-blur-3xl border border-cyan-500/40 rounded-2xl p-6 lg:p-8 w-full max-w-4xl shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
                  initial={{ scale: 0.93, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93, y: 15 }}
                  transition={{ type: "spring", damping: 25 }}
                >
                  <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                    <div className={`p-2.5 rounded-xl ${mc.bg} border ${mc.border} ${mc.color}`}>{MODULE_ICONS_LG[mod.id]}</div>
                    <h3 className="text-2xl lg:text-3xl font-extrabold text-white flex-1">{mod.title}</h3>
                    <button onClick={() => setActiveModId(null)} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <motion.div className="bg-red-950/15 rounded-2xl p-5 border border-red-500/15 relative"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }}>
                      <div className="absolute top-0 right-0 px-3 py-1 bg-red-500/10 rounded-bl-xl border-b border-l border-red-500/10 text-[10px] font-mono text-red-400 uppercase tracking-widest">Pain Point</div>
                      <div className="mt-3 space-y-3">
                        <p className="text-lg text-red-200/80 leading-relaxed font-medium">{mod.traditional}</p>
                        <div className="flex items-center gap-2 opacity-50 pt-1">
                          <X className="w-5 h-5 text-red-500 shrink-0" />
                          <span className="text-sm text-red-300/60 font-semibold uppercase tracking-wider">High Friction</span>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div className="bg-cyan-950/20 rounded-2xl p-5 border border-cyan-500/25 relative shadow-[0_0_25px_rgba(34,211,238,0.04)]"
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}>
                      <div className="absolute top-0 right-0 px-3 py-1 bg-cyan-500/15 rounded-bl-xl border-b border-l border-cyan-500/25 text-[10px] font-mono text-cyan-400 uppercase tracking-widest">AI Solution</div>
                      <div className="mt-3 space-y-3">
                        <p className="text-lg lg:text-xl text-cyan-50 leading-relaxed font-bold">{mod.solution}</p>
                        <ul className="space-y-2 mt-2">
                          {mod.details.map((d: string, k: number) => (
                            <motion.li key={k} className="flex items-start gap-2"
                              initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + k * 0.05 }}>
                              <div className="mt-0.5 p-0.5 rounded-full bg-cyan-400/20"><Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" /></div>
                              <span className="text-sm text-slate-300 font-medium">{d}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>


      {/* ═══════════ Mobile View ═══════════ */}
      <div className="md:hidden absolute inset-x-0 top-47 bottom-0 overflow-y-auto px-4 pt-3 pb-8 space-y-3">
        <div className="flex items-center justify-center gap-1.5 py-2 text-[10px] text-slate-500">
          <User className="w-4 h-4" /> <span>→</span>
          <Brain className="w-4 h-4 text-violet-400" /> <span>→</span>
          <Zap className="w-3.5 h-3.5 text-amber-400" /> <span>→</span>
          <Package className="w-4 h-4 text-cyan-400" /> <span>→</span>
          <Zap className="w-3.5 h-3.5 text-amber-400" /> <span>→</span>
          <Brain className="w-4 h-4 text-violet-400" /> <span>→</span>
          <User className="w-4 h-4" />
        </div>

        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">{t.logisticsHub}</div>
        {t.services.map((svc: any, i: number) => (
          <motion.div key={svc.id}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.06 }}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/15 shrink-0">{SERVICE_ICONS[svc.id]}</div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white text-base">{svc.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{svc.detail}</p>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="text-xs font-bold text-violet-400/60 uppercase tracking-wider px-1 mt-2">Modules</div>
        {t.modules.map((mod: any, i: number) => (
          <motion.div key={mod.id}
            className="bg-slate-900/60 border border-slate-800 rounded-xl p-4"
            onClick={() => setMobileId(mod.id)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.06 }}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400 border border-violet-500/15 shrink-0">{MODULE_ICONS[mod.id]}</div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white text-base">{mod.title}</h3>
                <p className="text-xs text-slate-500 truncate">{mod.solution}</p>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 mt-2">
          <div className="text-[10px] font-mono text-cyan-500/60 uppercase mb-2">{t.trackingTitle}</div>
          <div className="flex flex-wrap gap-2">
            {t.tracking.map((label: string, i: number) => (
              <span key={i} className="flex items-center gap-1 text-xs text-slate-400">
                <span className="text-cyan-500/40">{TRACK_ICONS[i]}</span> {label}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-3.5 h-3.5 text-cyan-500/50" />
            <span className="text-[10px] font-mono text-cyan-500/60 uppercase">{t.docSync}</span>
          </div>
          <p className="text-xs text-slate-500">{t.docSyncDetail}</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-3.5 h-3.5 text-amber-500/50" />
            <span className="text-[10px] font-mono text-amber-500/60 uppercase">{t.alerts}</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {t.alertItems.map((item: string, i: number) => (
              <span key={i} className="px-2 py-0.5 text-[10px] bg-amber-500/5 border border-amber-500/10 rounded text-amber-300/70">{item}</span>
            ))}
          </div>
        </div>

        <MobileDetailModal
          open={!!mobileId}
          onClose={() => setMobileId(null)}
          title={t.modules.find((m: any) => m.id === mobileId)?.title || ""}
          subtitle={t.mobileTitle}
        >
          {mobileId && (() => {
            const mod = t.modules.find((m: any) => m.id === mobileId);
            return mod ? (
              <div className="space-y-5">
                <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                  <div className="text-xs text-red-400 uppercase font-bold mb-2">Traditional</div>
                  <p className="text-red-100/90 text-lg">{mod.traditional}</p>
                </div>
                <div className="bg-cyan-500/5 p-4 rounded-xl border border-cyan-500/10">
                  <div className="text-xs text-cyan-400 uppercase font-bold mb-2">Our Solution</div>
                  <p className="text-cyan-100 font-bold text-xl mb-3">{mod.solution}</p>
                  <ul className="space-y-3">
                    {mod.details.map((d: string, k: number) => (
                      <li key={k} className="flex gap-3 text-base text-slate-300">
                        <Check className="w-5 h-5 text-cyan-500 shrink-0" /> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null;
          })()}
        </MobileDetailModal>
      </div>
    </div>
  );
}
