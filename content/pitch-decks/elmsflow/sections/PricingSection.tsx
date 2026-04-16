"use client";

import React from "react";
import { motion } from "framer-motion";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { CreditCard, Check, Sparkles } from "lucide-react";

// ─── Tier Card ───────────────────────────────────────────────────
function TierCard({
  tier,
  idx,
}: {
  tier: {
    name: string;
    price: string;
    period: string;
    tagline: string;
    features: string[];
  };
  idx: number;
}) {
  const accents = [
    { border: "border-blue-500/30", glow: "bg-blue-500/10", text: "text-blue-400", ring: "ring-blue-500/20" },
    { border: "border-violet-500/30", glow: "bg-violet-500/10", text: "text-violet-400", ring: "ring-violet-500/20" },
    { border: "border-emerald-500/30", glow: "bg-emerald-500/10", text: "text-emerald-400", ring: "ring-emerald-500/20" },
  ];
  const a = accents[idx % 3];
  const isHighlight = idx === 1;

  return (
    <motion.div
      className={`relative rounded-2xl border ${a.border} ${isHighlight ? "ring-2 " + a.ring : ""} backdrop-blur-sm overflow-hidden flex flex-col`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + idx * 0.12 }}
    >
      {/* Header */}
      <div className={`${a.glow} px-4 md:px-5 py-4 md:py-5 text-center border-b border-white/5`}>
        {isHighlight && (
          <div className="absolute top-2 right-2">
            <Sparkles className={`w-4 h-4 ${a.text}`} />
          </div>
        )}
        <div className={`text-xs md:text-sm font-mono uppercase tracking-[0.2em] ${a.text} mb-1`}>
          {tier.name}
        </div>
        <div className="text-3xl md:text-4xl font-extrabold text-white">
          {tier.price}
        </div>
        {tier.period && (
          <div className="text-[10px] md:text-xs text-white/40 font-mono">
            {tier.period}
          </div>
        )}
        <div className="text-[10px] md:text-sm text-white/50 mt-1">
          {tier.tagline}
        </div>
      </div>

      {/* Features */}
      <div className="px-4 md:px-5 py-3 md:py-4 flex-1 flex flex-col gap-2.5">
        {tier.features.map((f: string, fi: number) => (
          <div key={fi} className="flex items-start gap-2">
            <Check className={`w-3.5 h-3.5 mt-0.5 ${a.text} shrink-0`} />
            <span className="text-[10px] md:text-sm text-white/60 leading-snug">
              {f}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main Section ────────────────────────────────────────────────
export function PricingSection() {
  const content = useContent();
  const c = content.slide12;

  return (
    <section
      className={`${SECTION} bg-[#f0f4f8] dark:bg-linear-to-b dark:from-[#0a0e15] dark:via-[#0d1320] dark:to-[#0a0e15]`}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-4 md:px-8 py-6 text-white overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-blue-600/[0.05] blur-[100px] rounded-full pointer-events-none" />

        {/* Badge */}
        <motion.div
          className="ei-child inline-flex items-center gap-2 mb-3 md:mb-4 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/[0.08]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CreditCard className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] md:text-sm font-mono tracking-[0.2em] uppercase text-blue-400/90">
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
          className="ei-child text-xs md:text-base text-white/50 text-center max-w-md mb-6 md:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          {c.subtitle}
        </motion.p>

        {/* Tier cards */}
        <div className="ei-child grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 w-full max-w-5xl 2xl:max-w-7xl">
          {c.tiers.map((tier: { name: string; price: string; period: string; tagline: string; features: string[] }, i: number) => (
            <TierCard key={tier.name} tier={tier} idx={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
