"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import {
  Bot,
  ArrowRight,
  CheckCircle,
  MessageSquare,
  BarChart3,
  Globe,
  Zap,
  Target,
  ExternalLink,
  Package,
  Brain,
  ScanLine,
  Reply,
  Receipt,
} from "lucide-react";
import { TypewriterText } from "@/components/ui/typewriter-text";

// ─── Platform data (20 platforms) ─────────────────────────────────
const PLATFORM_ICONS = [
  { name: "Reddit",         src: "/icons/reddit.svg" },
  { name: "Quora",          src: "/icons/quora.svg" },
  { name: "YouTube",        src: "/icons/youtube.svg" },
  { name: "Amazon",         src: "/icons/amazon.svg" },
  { name: "LinkedIn",       src: "/icons/linkedin.svg" },
  { name: "TikTok",         src: "/icons/tiktok.svg" },
  { name: "Stack Overflow", src: "/icons/stackoverflow.svg" },
  { name: "ProductHunt",    src: "/icons/producthunt.svg" },
  { name: "X (Twitter)",    src: "/icons/twitter.svg" },
  { name: "Facebook",       src: "/icons/facebook.svg" },
  { name: "Instagram",      src: "/icons/instagram.svg" },
  { name: "Pinterest",      src: "/icons/pinterest.svg" },
  { name: "Medium",         src: "/icons/medium.svg" },
  { name: "Discord",        src: "/icons/discord.svg" },
  { name: "Google",         src: "/icons/google.svg" },
  { name: "Naver",          src: "/icons/naver.svg" },
  { name: "Hacker News",    src: "/icons/hackernews.svg" },
  { name: "Trustpilot",     src: "/icons/trustpilot.svg" },
  { name: "App Store",      src: "/icons/appstore.svg" },
  { name: "Google Play",    src: "/icons/googleplay.svg" },
];

const LANGUAGE_WORDS = ["English", "Spanish", "Portuguese", "Japanese", "Korean", "Russian"];

// ─── Platform scrolling carousel ──────────────────────────────────
const VISIBLE = 6;
const ICON_SIZE = 26;

function PlatformCarousel() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setOffset((o) => o + 1), 900);
    return () => clearInterval(id);
  }, []);

  const slots: { icon: (typeof PLATFORM_ICONS)[number]; key: number }[] = [];
  for (let i = 0; i < VISIBLE + 1; i++) {
    const idx = (offset + i) % PLATFORM_ICONS.length;
    slots.push({ icon: PLATFORM_ICONS[idx], key: offset + i });
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: VISIBLE * ICON_SIZE, height: 28 }}
    >
      {slots.map((s, i) => {
        const left = (i - 1) * ICON_SIZE;
        const isLeaving = i === 0;
        return (
          <img
            key={s.key}
            src={s.icon.src}
            alt={s.icon.name}
            title={s.icon.name}
            className="absolute top-0 rounded-full ring-1 ring-white/10 bg-white/10 object-cover transition-all duration-500 ease-in-out"
            style={{
              width: 22,
              height: 22,
              top: 3,
              left,
              opacity: isLeaving ? 0 : 1,
              transform: isLeaving ? "translateX(-12px) scale(0.7)" : "translateX(0) scale(1)",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Step colors ──────────────────────────────────────────────────
const STEP_THEMES = [
  { accent: "text-blue-400", border: "border-blue-500/40", bg: "bg-blue-500/15", ring: "ring-blue-500/30", glow: "59,130,246" },
  { accent: "text-violet-400", border: "border-violet-500/40", bg: "bg-violet-500/15", ring: "ring-violet-500/30", glow: "139,92,246" },
  { accent: "text-cyan-400", border: "border-cyan-500/40", bg: "bg-cyan-500/15", ring: "ring-cyan-500/30", glow: "6,182,212" },
  { accent: "text-emerald-400", border: "border-emerald-500/40", bg: "bg-emerald-500/15", ring: "ring-emerald-500/30", glow: "16,185,129" },
  { accent: "text-amber-400", border: "border-amber-500/40", bg: "bg-amber-500/15", ring: "ring-amber-500/30", glow: "245,158,11" },
];

const STEP_ICONS = [Package, Brain, ScanLine, Reply, Receipt];

// ─── Horizontal Step Node ─────────────────────────────────────────
function StepNode({
  step, idx, active, total, onClick,
}: {
  step: { label: string; detail: string };
  idx: number; active: boolean; total: number; onClick: () => void;
}) {
  const t = STEP_THEMES[idx % STEP_THEMES.length];
  const Icon = STEP_ICONS[idx % STEP_ICONS.length];
  return (
    <div className="relative flex flex-col items-center" style={{ minWidth: 0, flex: 1 }}>
      {/* Connector line — left side (skip first) */}
      {idx > 0 && (
        <div className="absolute left-0 top-[28px] w-1/2 h-px"
          style={{ background: active ? `rgba(${t.glow},0.5)` : "rgba(255,255,255,0.08)" }} />
      )}
      {/* Connector line — right side (skip last) */}
      {idx < total - 1 && (
        <div className="absolute right-0 top-[28px] w-1/2 h-px"
          style={{ background: "rgba(255,255,255,0.08)" }} />
      )}

      {/* Circle icon */}
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={`relative z-10 w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer ${
          active ? `${t.border} ${t.bg} ring-2 ${t.ring}` : "border-white/10 bg-white/3 hover:border-white/20"
        }`}
        style={active ? { boxShadow: `0 0 20px rgba(${t.glow},0.35)` } : {}}
      >
        <Icon className={`w-5 h-5 ${active ? t.accent : "text-white/30"}`} />
        {/* Step number badge */}
        <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${
          active ? `${t.bg} ${t.accent} border ${t.border}` : "bg-white/5 text-white/20 border border-white/10"
        }`}>
          {idx + 1}
        </span>
      </motion.button>

      {/* Label */}
      <span className={`mt-2 text-[10px] md:text-xs font-semibold text-center leading-tight transition-colors duration-300 ${
        active ? "text-white" : "text-white/35"
      }`}>
        {step.label}
      </span>
    </div>
  );
}

// ─── Tech Stack Snapshot (mirrors CoverSection topology style) ────
const STACK_NODES = {
  fe:      { icon: "🖥️",  label: "Frontend",    accent: "text-cyan-300/80" },
  deploy:  { icon: "☁️",  label: "Deployment",  accent: "text-teal-300/80" },
  backend: { icon: "⚙️",  label: "Backend",     accent: "text-indigo-300/80" },
  ai:      { icon: "🧠",  label: "AI / LLM",    accent: "text-purple-300/80" },
  scraper: { icon: "🕷️",  label: "Scraping",    accent: "text-emerald-300/80" },
  pay:     { icon: "💳",  label: "Payments",    accent: "text-amber-300/80" },
  db:      { icon: "🗄️",  label: "Database",    accent: "text-cyan-300/80" },
} as const;

function TechStackSnapshot() {
  const zoneBorder = "border-white/8";
  const zoneBg = "bg-white/[0.025]";
  const zoneLabel = "text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-white/25";
  const nodeBorder = "border-white/10";
  const nodeBg = "bg-white/[0.05]";

  const TNode = ({ k }: { k: keyof typeof STACK_NODES }) => {
    const n = STACK_NODES[k];
    return (
      <div className={`rounded-lg border ${nodeBorder} ${nodeBg} px-2 py-1.5 text-center`}>
        <div className="text-base mb-0.5">{n.icon}</div>
        <div className={`text-[9px] md:text-[10px] font-bold leading-tight ${n.accent}`}>{n.label}</div>
      </div>
    );
  };

  const HArrow = ({ label, dashed }: { label: string; dashed?: boolean }) => (
    <div className="flex flex-col items-center justify-center px-0.5 shrink-0">
      <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full mb-0.5 whitespace-nowrap bg-teal-500/10 text-teal-300/60">{label}</span>
      <div className="flex items-center">
        <div className={`w-4 md:w-6 h-0 ${dashed ? "border-t border-dashed" : "border-t-2"} border-teal-400/30`} />
        <div className="w-0 h-0 border-t-[3px] border-b-[3px] border-l-[5px] border-t-transparent border-b-transparent border-l-teal-400/40" />
      </div>
    </div>
  );

  return (
    <motion.div
      className="rounded-xl border border-white/5 bg-white/2 p-2.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[9px] font-mono text-violet-400/60 uppercase tracking-wider">Core Tech Stack</span>
      </div>

      <div className="flex items-stretch gap-0 overflow-x-auto pb-0.5">
        {/* Zone 1: User */}
        <div className={`rounded-l-lg border ${zoneBorder} ${zoneBg} px-2 py-2 flex flex-col shrink-0`}>
          <div className={`${zoneLabel} mb-1.5`}>User</div>
          <div className="flex flex-col gap-1.5 flex-1 justify-center">
            <TNode k="fe" />
            <div className="flex flex-col items-center">
              <div className="w-px h-2 bg-teal-400/20" />
              <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-t-[4px] border-l-transparent border-r-transparent border-t-teal-400/30" />
            </div>
            <TNode k="deploy" />
          </div>
        </div>

        <HArrow label="API" />

        {/* Zone 2: Application */}
        <div className={`border ${zoneBorder} ${zoneBg} px-2 py-2 flex flex-col flex-1`}>
          <div className={`${zoneLabel} mb-1.5`}>Application</div>
          <div className="flex flex-col items-center gap-1">
            <TNode k="backend" />
            <svg viewBox="0 0 180 14" className="w-full max-w-[180px] h-3.5" preserveAspectRatio="xMidYMid meet">
              <line x1="90" y1="0" x2="25" y2="14" stroke="rgba(94,234,212,0.25)" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="90" y1="0" x2="90" y2="14" stroke="rgba(94,234,212,0.25)" strokeWidth="1.5" strokeDasharray="3 2" />
              <line x1="90" y1="0" x2="155" y2="14" stroke="rgba(94,234,212,0.25)" strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
            <div className="grid grid-cols-3 gap-1 w-full">
              <TNode k="ai" />
              <TNode k="scraper" />
              <TNode k="pay" />
            </div>
          </div>
        </div>

        <HArrow label="R/W" dashed />

        {/* Zone 3: Data */}
        <div className={`rounded-r-lg border ${zoneBorder} ${zoneBg} px-2 py-2 flex flex-col shrink-0`}>
          <div className={`${zoneLabel} mb-1.5`}>Data</div>
          <div className="flex items-center justify-center flex-1">
            <TNode k="db" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}


// ─── Main Section ────────────────────────────────────────────────
export function AIMarketingSection() {
  const content = useContent();
  const c = content.slide13;
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((s) => (s + 1) % c.steps.length);
    }, 5000);
    return () => clearInterval(id);
  }, [c.steps.length]);

  return (
    <section
      className={`${SECTION} bg-[#f0f4f8] dark:bg-linear-to-b dark:from-[#0a0e15] dark:via-[#0d1320] dark:to-[#0a0e15]`}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4 md:px-8 py-6 text-white overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 right-1/4 w-100 h-100 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-75 h-75 bg-cyan-600/4 blur-[100px] rounded-full pointer-events-none" />

        {/* Badge */}
        <motion.div
          className="ei-child inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-violet-500/25 bg-violet-500/8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Bot className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[10px] md:text-sm font-mono tracking-[0.2em] uppercase text-violet-400/90">
            {c.badge}
          </span>
        </motion.div>

        {/* Title + subtitle */}
        <motion.h2
          className="ei-child text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-center mb-1"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {c.title}
        </motion.h2>
        <motion.p
          className="ei-child text-xs md:text-sm text-white/50 text-center max-w-xl mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {c.subtitle}
        </motion.p>

        {/* ── Language Typewriter + Platform Carousel row ── */}
        <motion.div
          className="ei-child flex flex-wrap items-center justify-center gap-3 mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32 }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 min-w-[160px]">
            <span className="text-sm">🌐</span>
            <TypewriterText
              words={LANGUAGE_WORDS}
              className="text-xs sm:text-sm text-indigo-300! font-medium!"
              cursorClassName="!bg-indigo-400/50"
              typingSpeed={90}
              deletingSpeed={50}
              pauseTime={1400}
              startOnIdle
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
            <span className="text-xs sm:text-sm text-violet-300 font-semibold">20</span>
            <PlatformCarousel />
          </div>
          <motion.a
            href="/en/pitch-deck/mota-market-intel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 font-semibold text-xs md:text-sm hover:bg-violet-500/25 hover:border-violet-400/50 transition-all duration-300 group"
            animate={{ y: [0, -10, 2, -6, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.8, ease: "easeOut" }}
            whileHover={{ scale: 1.05, y: 0 }}
            whileTap={{ scale: 0.96 }}
          >
            <span>Explore Full AI Marketing Deck</span>
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </motion.a>
        </motion.div>

        {/* ── Horizontal Step Pipeline ── */}
        <motion.div
          className="ei-child w-full max-w-5xl mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
        >
          {/* Step nodes row */}
          <div className="flex items-start gap-0 px-2">
            {c.steps.map((step: { label: string; detail: string }, i: number) => (
              <StepNode
                key={step.label}
                step={step}
                idx={i}
                active={activeStep === i}
                total={c.steps.length}
                onClick={() => setActiveStep(i)}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-3 mx-2 h-px bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `rgba(${STEP_THEMES[activeStep % STEP_THEMES.length].glow},0.6)` }}
              animate={{ width: `${((activeStep + 1) / c.steps.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {/* Detail popup card for active step */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              className={`mt-3 mx-2 rounded-xl border p-3 md:p-4 ${STEP_THEMES[activeStep % STEP_THEMES.length].border} ${STEP_THEMES[activeStep % STEP_THEMES.length].bg}`}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              style={{ boxShadow: `0 4px 24px rgba(${STEP_THEMES[activeStep % STEP_THEMES.length].glow},0.15)` }}
            >
              <div className="flex items-center gap-2 mb-1">
                {(() => {
                  const Icon = STEP_ICONS[activeStep % STEP_ICONS.length];
                  return <Icon className={`w-4 h-4 ${STEP_THEMES[activeStep % STEP_THEMES.length].accent}`} />;
                })()}
                <span className={`text-xs md:text-sm font-bold ${STEP_THEMES[activeStep % STEP_THEMES.length].accent}`}>
                  {c.steps[activeStep].label}
                </span>
                <span className={`text-[9px] font-mono ${STEP_THEMES[activeStep % STEP_THEMES.length].accent} opacity-50 ml-auto`}>
                  0{activeStep + 1} / 0{c.steps.length}
                </span>
              </div>
              <p className="text-xs md:text-sm text-white/65 leading-relaxed">
                {c.steps[activeStep].detail}
              </p>
              {/* Scan bar (active animation) */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 rounded-full"
                style={{ background: `rgba(${STEP_THEMES[activeStep % STEP_THEMES.length].glow},0.7)` }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* ── Bottom 2-col: Notes+Advantages | LiveScan+Metrics ── */}
        <div className="ei-child w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-4 mt-1">

          {/* LEFT: poweredBy note + advantages */}
          <motion.div
            className="rounded-xl border border-emerald-500/20 bg-emerald-500/4 p-4 flex flex-col gap-3"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
          >
            {c.poweredBy && (
              <p className="text-xs md:text-sm text-emerald-300/80 italic leading-relaxed border-l-2 border-emerald-500/40 pl-3">
                {c.poweredBy}
              </p>
            )}
            <div>
              <h3 className="text-[10px] md:text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                Key Advantages
              </h3>
              {c.advantages.map((adv: string, i: number) => (
                <div key={i} className="flex items-start gap-2 mb-1.5 last:mb-0">
                  <span className="text-xs md:text-sm text-white/70 leading-snug">{adv}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: LiveScan + metrics */}
          <div className="flex flex-col gap-3">
            <TechStackSnapshot />
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Platforms", value: "20+", icon: Globe },
                { label: "Languages", value: "6", icon: MessageSquare },
                { label: "Ban Risk", value: "0%", icon: CheckCircle },
              ].map((m, i) => (
                <motion.div
                  key={m.label}
                  className="text-center p-2 rounded-lg border border-white/5 bg-white/2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 + i * 0.1 }}
                >
                  <m.icon className="w-3 h-3 text-violet-400/60 mx-auto mb-1" />
                  <div className="text-sm md:text-base font-extrabold text-white">{m.value}</div>
                  <div className="text-[8px] md:text-[10px] text-white/30 font-mono uppercase">{m.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
