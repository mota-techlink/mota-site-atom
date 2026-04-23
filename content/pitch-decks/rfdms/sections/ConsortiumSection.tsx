"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Factory, Package, Truck, Globe, Handshake } from "lucide-react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

const TIER_COLORS: Record<string, string> = {
  lead:       "border-cyan-400/60 bg-cyan-400/10 text-cyan-300",
  core:       "border-emerald-400/60 bg-emerald-400/10 text-emerald-300",
  courier:    "border-violet-400/60 bg-violet-400/10 text-violet-300",
  operations: "border-amber-400/60 bg-amber-400/10 text-amber-300",
  global:     "border-blue-400/60 bg-blue-400/10 text-blue-300",
};

const TIER_BADGE_COLORS: Record<string, string> = {
  lead:       "bg-cyan-400/20 text-cyan-300 border-cyan-400/40",
  core:       "bg-emerald-400/20 text-emerald-300 border-emerald-400/40",
  courier:    "bg-violet-400/20 text-violet-300 border-violet-400/40",
  operations: "bg-amber-400/20 text-amber-300 border-amber-400/40",
  global:     "bg-blue-400/20 text-blue-300 border-blue-400/40",
};

const TIER_GLOW: Record<string, string> = {
  lead:       "shadow-[0_0_24px_rgba(34,211,238,0.15)]",
  core:       "shadow-[0_0_24px_rgba(52,211,153,0.15)]",
  courier:    "shadow-[0_0_24px_rgba(167,139,250,0.15)]",
  operations: "shadow-[0_0_24px_rgba(251,191,36,0.15)]",
  global:     "shadow-[0_0_24px_rgba(96,165,250,0.15)]",
};

interface Partner {
  name: string;
  role: string;
  detail: string;
  tier: string;
  icon: string;
}

function PartnerCard({
  partner,
  index,
  onClick,
  isSelected,
}: {
  partner: Partner;
  index: number;
  onClick: () => void;
  isSelected: boolean;
}) {
  const colorClass = TIER_COLORS[partner.tier] ?? TIER_COLORS.global;
  const glowClass  = TIER_GLOW[partner.tier]  ?? TIER_GLOW.global;
  const badgeClass = TIER_BADGE_COLORS[partner.tier] ?? TIER_BADGE_COLORS.global;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={onClick}
      className={`
        relative text-left rounded-xl border p-2.5 cursor-pointer transition-all duration-200 w-full
        ${colorClass} ${isSelected ? glowClass + " scale-[1.02]" : "hover:scale-[1.01] hover:brightness-110"}
      `}
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-1.5">
        <span className="text-xl leading-none mt-0.5 flex-shrink-0">{partner.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white text-xs leading-tight mb-0.5">
            {partner.name}
          </div>
          <div className={`text-[9px] font-semibold px-1 py-0.5 rounded border inline-block ${badgeClass}`}>
            {partner.role}
          </div>
        </div>
      </div>
      {/* Detail */}
      <p className="text-[11px] leading-relaxed opacity-80 line-clamp-2">
        {partner.detail}
      </p>
      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-white/30"
          layoutId="partner-selector"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </motion.button>
  );
}

function HubCenterSVG() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
      {/* Outer ring */}
      <circle cx="100" cy="100" r="88" stroke="rgba(34,211,238,0.15)" strokeWidth="1" strokeDasharray="4 6" />
      <circle cx="100" cy="100" r="64" stroke="rgba(52,211,153,0.12)" strokeWidth="1" strokeDasharray="3 5" />
      <circle cx="100" cy="100" r="40" stroke="rgba(167,139,250,0.12)" strokeWidth="1" strokeDasharray="2 4" />
      {/* Center hub */}
      <circle cx="100" cy="100" r="28" fill="rgba(34,211,238,0.08)" stroke="rgba(34,211,238,0.3)" strokeWidth="1.5" />
      {/* Spoke lines */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x2 = 100 + Math.cos(rad) * 88;
        const y2 = 100 + Math.sin(rad) * 88;
        return (
          <line key={i} x1="100" y1="100" x2={x2} y2={y2}
            stroke="rgba(34,211,238,0.05)" strokeWidth="0.5" strokeDasharray="2 4" />
        );
      })}
      {/* Center text */}
      <text x="100" y="96" textAnchor="middle" fill="rgba(34,211,238,0.9)" fontSize="8" fontWeight="700" letterSpacing="1">
        RCCSCS
      </text>
      <text x="100" y="107" textAnchor="middle" fill="rgba(34,211,238,0.6)" fontSize="6" letterSpacing="0.5">
        LLC
      </text>
    </svg>
  );
}

export function ConsortiumSection() {
  const c = useContent();
  const slide = c.slide4;
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const partners: Partner[] = slide.partners ?? [];
  const tiers = slide.tiers ?? [];
  const primaryPartners = partners.filter((p) => ["lead", "core"].includes(p.tier));
  const networkPartners = partners.filter((p) => !["lead", "core"].includes(p.tier));

  return (
    <section id="s-consortium" className="h-full flex flex-col justify-center overflow-y-auto py-12 sm:pt-16 sm:pb-4">
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col">
        {/* Header */}
        <div className="text-center mb-2 lg:mb-3">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block text-xs font-semibold tracking-widest text-cyan-400/80 uppercase mb-2"
          >
            {slide.badge}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
          >
            {slide.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-slate-400 mt-1 max-w-2xl mx-auto"
          >
            {slide.subtitle}
          </motion.p>
        </div>

        {/* Tier legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex flex-wrap justify-center gap-2 mb-2"
        >
          {tiers.map((tier) => (
            <span
              key={tier.id}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${TIER_BADGE_COLORS[tier.id] ?? TIER_BADGE_COLORS.global}`}
            >
              {tier.label}
            </span>
          ))}
        </motion.div>

        {/* Main layout */}
        <div className="flex gap-4 flex-1 min-h-0 max-h-[420px]">
          {/* Partner grid by category */}
          <div className="flex-1 min-h-0 pr-1 flex flex-col gap-2">
            <div className="rounded-xl border border-slate-700/50 bg-slate-900/30 p-2">
              <p className="text-[10px] font-semibold text-cyan-300/80 uppercase tracking-wider mb-1.5">Core Alliance</p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {primaryPartners.map((partner, i) => (
                  <PartnerCard
                    key={partner.name}
                    partner={partner}
                    index={i}
                    isSelected={selectedPartner?.name === partner.name}
                    onClick={() =>
                      setSelectedPartner(
                        selectedPartner?.name === partner.name ? null : partner
                      )
                    }
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-700/50 bg-slate-900/20 p-2 flex-1">
              <p className="text-[10px] font-semibold text-violet-300/80 uppercase tracking-wider mb-1.5">Logistics & Network</p>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {networkPartners.map((partner, i) => (
                  <PartnerCard
                    key={partner.name}
                    partner={partner}
                    index={i + primaryPartners.length}
                    isSelected={selectedPartner?.name === partner.name}
                    onClick={() =>
                      setSelectedPartner(
                        selectedPartner?.name === partner.name ? null : partner
                      )
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Hub diagram + detail panel + stats */}
          <div className="hidden lg:flex flex-col gap-3 w-64 flex-shrink-0">
            {/* Hub SVG */}
            <div className="relative w-40 h-40 mx-auto">
              <HubCenterSVG />
              {/* Floating partner dots */}
              {partners.slice(0, 8).map((p, i) => {
                const angle = (i / 8) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                const r = 72;
                const x = 50 + (Math.cos(rad) * r) / 2;
                const y = 50 + (Math.sin(rad) * r) / 2;
                return (
                  <motion.div
                    key={p.name}
                    className={`absolute w-6 h-6 rounded-full flex items-center justify-center text-sm border ${TIER_COLORS[p.tier] ?? TIER_COLORS.global}`}
                    style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                  >
                    {p.icon}
                  </motion.div>
                );
              })}
            </div>

            {/* Detail panel */}
            <AnimatePresence mode="wait">
              {selectedPartner ? (
                <motion.div
                  key={selectedPartner.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-xl border p-3 h-60 ${TIER_COLORS[selectedPartner.tier] ?? TIER_COLORS.global}`}
                >
                  <div className="text-lg mb-1">{selectedPartner.icon}</div>
                  <div className="font-bold text-white text-sm leading-tight">{selectedPartner.name}</div>
                  <div className="text-xs opacity-70 mt-1">{selectedPartner.role}</div>
                  <div className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-4">{selectedPartner.detail}</div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-3 h-36 flex items-center justify-center"
                >
                  <p className="text-xs text-slate-500 text-center">
                    Select a partner to view details
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats moved to right side */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "11", label: "Partners" },
                { value: "5", label: "Tiers" },
                { value: "4", label: "Global Corridors" },
                { value: "1", label: "Unified Entity" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-slate-700/50 bg-slate-800/30 px-2 py-1.5 text-center">
                  <div className="text-lg font-bold text-cyan-400 leading-none">{stat.value}</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
