"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import {
  Bot,
  ArrowRight,
  CheckCircle,
  Search,
  MessageSquare,
  BarChart3,
  Globe,
  Zap,
  Target,
  ExternalLink,
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
  { accent: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10", glow: "rgba(59,130,246,0.4)" },
  { accent: "text-violet-400", border: "border-violet-500/30", bg: "bg-violet-500/10", glow: "rgba(139,92,246,0.4)" },
  { accent: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10", glow: "rgba(6,182,212,0.4)" },
  { accent: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10", glow: "rgba(16,185,129,0.4)" },
  { accent: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10", glow: "rgba(245,158,11,0.4)" },
];

const STEP_ICONS = [Target, Search, Globe, MessageSquare, BarChart3];

// ─── Auto-rotating Pipeline ─────────────────────────────────────
function PipelineCard({
  step,
  idx,
  active,
  onClick,
}: {
  step: { label: string; detail: string };
  idx: number;
  active: boolean;
  onClick: () => void;
}) {
  const theme = STEP_THEMES[idx % STEP_THEMES.length];
  const Icon = STEP_ICONS[idx % STEP_ICONS.length];

  return (
    <motion.div
      className={`relative rounded-xl border backdrop-blur-sm cursor-pointer transition-all duration-300 overflow-hidden ${
        active
          ? `${theme.border} ring-1 ring-white/10`
          : "border-white/5 hover:border-white/10"
      }`}
      style={{
        background: active
          ? `linear-gradient(135deg, rgba(${theme.glow.match(/\d+/g)?.slice(0, 3).join(",")},0.12) 0%, rgba(15,23,42,0.8) 100%)`
          : "rgba(255,255,255,0.02)",
      }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + idx * 0.08 }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
    >
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5"
            style={{ background: theme.glow }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            exit={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        )}
      </AnimatePresence>

      <div className="p-3 md:p-4 flex items-start gap-3">
        <div
          className={`shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center ${theme.bg} ${theme.border} border transition-all duration-300 ${
            active ? "scale-110" : ""
          }`}
        >
          <Icon className={`w-4 h-4 ${theme.accent}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-xs md:text-sm font-bold ${active ? "text-white" : "text-white/70"}`}>
              {step.label}
            </span>
            <span className={`text-[9px] font-mono ${theme.accent} opacity-60`}>
              0{idx + 1}
            </span>
          </div>
          <AnimatePresence>
            {active && (
              <motion.p
                className="text-[10px] md:text-xs text-white/50 leading-relaxed mt-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {step.detail}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Live Scan with scrolling platforms ──────────────────────────
function LiveScanFeed({ active }: { active: boolean }) {
  const [scanIdx, setScanIdx] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setScanIdx((i) => (i + 1) % PLATFORM_ICONS.length), 1200);
    return () => clearInterval(id);
  }, [active]);

  const visiblePlatforms = PLATFORM_ICONS.slice(0, 8);

  return (
    <motion.div
      className="rounded-xl border border-white/5 bg-white/2 p-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Search className="w-3 h-3 text-cyan-400" />
        <span className="text-[10px] font-mono text-cyan-400/70 uppercase tracking-wider">
          Live Scan — 20 Platforms
        </span>
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-cyan-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {visiblePlatforms.map((p, i) => (
          <motion.div
            key={p.name}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-mono transition-all duration-300 ${
              i === scanIdx % visiblePlatforms.length
                ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                : "border-white/5 bg-white/2 text-white/30"
            }`}
            animate={i === scanIdx % visiblePlatforms.length ? { scale: [1, 1.05, 1] } : {}}
          >
            <img src={p.src} alt={p.name} className="w-3.5 h-3.5 rounded-full" />
            <span>{p.name}</span>
          </motion.div>
        ))}
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
          className="ei-child inline-flex items-center gap-2 mb-3 md:mb-4 px-3 py-1 rounded-full border border-violet-500/25 bg-violet-500/8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Bot className="w-3.5 h-3.5 text-violet-400" />
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
          className="ei-child text-xs md:text-base text-white/50 text-center max-w-xl mb-3 md:mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {c.subtitle}
        </motion.p>

        {/* ── Language Typewriter + Platform Carousel row ── */}
        <motion.div
          className="ei-child flex flex-wrap items-center justify-center gap-3 mb-4 md:mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {/* 6 Languages typewriter */}
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

          {/* 20 Platforms carousel */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
            <span className="text-xs sm:text-sm text-violet-300 font-semibold">20</span>
            <PlatformCarousel />
          </div>
        </motion.div>

        {/* Two-column: Pipeline + Right Panel */}
        <div className="ei-child w-full max-w-5xl 2xl:max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
          {/* Pipeline Steps (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            {c.steps.map((step: { label: string; detail: string }, i: number) => (
              <PipelineCard
                key={step.label}
                step={step}
                idx={i}
                active={activeStep === i}
                onClick={() => setActiveStep(i)}
              />
            ))}
          </div>

          {/* Right Panel (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {/* Live scan simulation */}
            <LiveScanFeed active={activeStep >= 2} />

            {/* Advantages card */}
            <motion.div
              className="rounded-xl border border-emerald-500/20 bg-emerald-500/4 p-3 md:p-4 flex-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2">
                Key Advantages
              </h3>
              {c.advantages.map((adv: string, i: number) => (
                <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400/70 mt-0.5 shrink-0" />
                  <span className="text-[10px] md:text-sm text-white/60 leading-snug">
                    {adv}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Metric highlights */}
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
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <m.icon className="w-3 h-3 text-violet-400/60 mx-auto mb-1" />
                  <div className="text-sm md:text-base font-extrabold text-white">
                    {m.value}
                  </div>
                  <div className="text-[8px] md:text-[10px] text-white/30 font-mono uppercase">
                    {m.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Link button to full Mota Market Intel deck ── */}
        <motion.a
          href="/en/pitch-deck/mota-market-intel"
          target="_blank"
          rel="noopener noreferrer"
          className="ei-child mt-4 md:mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300 font-semibold text-sm md:text-base hover:bg-violet-500/25 hover:border-violet-400/50 transition-all duration-300 group"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span>Explore Full AI Marketing Deck</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </motion.a>
      </div>
    </section>
  );
}
