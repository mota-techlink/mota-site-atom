"use client";

import React, { useState } from "react";
import {
  Globe,
  ShieldCheck,
  Clock,
  Leaf,
  CheckCircle2,
  MapPin,
  Plane,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileDetailModal, MobileExpandButton } from "./MobileDetailModal";
import { useContent } from "./useContent";

// ─── Flag Image (cross-browser safe) ──────────────────────────────
const FLAG_IMAGES: Record<string, string> = {
  eu: "/images/flags/eu.svg",
  us: "/images/flags/us.svg",
  my: "/images/flags/my.svg",
  sa: "/images/flags/sa.svg",
};

function FlagImage({ code, className = "" }: { code: string; className?: string }) {
  return (
    <img
      src={FLAG_IMAGES[code] ?? FLAG_IMAGES.eu}
      alt={`${code.toUpperCase()} flag`}
      className={`inline-block rounded-sm object-cover ${className}`}
      draggable={false}
    />
  );
}

// ─── Region Card ─────────────────────────────────────────────────
interface RegionData {
  id: string;
  flag: string;
  name: string;
  regulation: string;
  badge: string;
  clearanceTime: string;
  traditionalTime: string;
  features: string[];
  color: string;
  borderColor: string;
}

const regionColors = {
  eu: { color: "from-blue-500/10 to-blue-500/5", borderColor: "border-blue-500/25 hover:border-blue-500/40" },
  us: { color: "from-red-500/10 to-red-500/5", borderColor: "border-red-500/25 hover:border-red-500/40" },
  my: { color: "from-emerald-500/10 to-emerald-500/5", borderColor: "border-emerald-500/25 hover:border-emerald-500/40" },
  me: { color: "from-amber-500/10 to-amber-500/5", borderColor: "border-amber-500/25 hover:border-amber-500/40" },
};

function RegionCard({ region, delay }: { region: RegionData; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const t = useContent().slide6;

  const improvementPct = Math.round(
    ((parseInt(region.traditionalTime) - parseInt(region.clearanceTime)) / parseInt(region.traditionalTime)) * 100
  );

  return (
    <motion.div
      className={`relative p-4 lg:p-5 rounded-2xl border bg-linear-to-b ${region.color} ${region.borderColor} backdrop-blur-sm transition-all duration-500 cursor-default`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <FlagImage code={region.id} className="w-6 h-4 lg:w-8 lg:h-5" />
        <div>
          <h3 className="text-sm lg:text-base font-bold text-white">{region.name}</h3>
          <span className="text-[9px] lg:text-[10px] font-mono text-slate-400">{region.regulation}</span>
        </div>
        <motion.div
          className="ml-auto px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[8px] lg:text-[9px] font-mono font-bold text-emerald-400"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.3 }}
        >
          {region.badge}
        </motion.div>
      </div>

      {/* Clearance time comparison */}
      <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-white/3">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-slate-500" />
          <span className="text-[9px] lg:text-[10px] text-slate-500 font-mono">{t.traditional}</span>
          <span className="text-[9px] lg:text-[10px] text-red-400/70 font-mono line-through">{region.traditionalTime}</span>
        </div>
        <motion.div className="text-[9px] text-slate-600">→</motion.div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] lg:text-[10px] text-emerald-400 font-mono font-bold">{region.clearanceTime}</span>
          <span className="text-[8px] lg:text-[9px] text-emerald-400/70 font-mono">(-{improvementPct}%)</span>
        </div>
      </div>

      {/* Features — show on hover (desktop) or always first 2 */}
      <ul className="space-y-1">
        {region.features.slice(0, hovered ? 4 : 2).map((f, i) => (
          <motion.li
            key={i}
            className="flex items-center gap-1.5 text-[9px] lg:text-[10px] text-slate-300/80"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.4 + i * 0.08 }}
          >
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
            {f}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─── Route Visualization ─────────────────────────────────────────
function RouteVisualization() {
  return (
    <motion.div
      className="hidden lg:block absolute inset-0 pointer-events-none overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice" fill="none">
        {/* Route arcs */}
        {[
          { d: "M480 270 Q350 180 200 250", color: "rgba(59,130,246,0.15)" },
          { d: "M480 270 Q600 180 750 220", color: "rgba(239,68,68,0.15)" },
          { d: "M480 270 Q550 350 700 380", color: "rgba(52,211,153,0.15)" },
          { d: "M480 270 Q400 350 250 400", color: "rgba(245,158,11,0.15)" },
        ].map((route, i) => (
          <g key={i}>
            <path d={route.d} stroke={route.color} strokeWidth="1" strokeDasharray="4 6" />
            <motion.circle r="2" fill={route.color.replace("0.15", "0.6")}>
              <animateMotion dur={`${5 + i}s`} repeatCount="indefinite" begin={`${i * 0.5}s`}>
                <mpath href={`#global-route-${i}`} />
              </animateMotion>
            </motion.circle>
            <path id={`global-route-${i}`} d={route.d} fill="none" />
          </g>
        ))}

        {/* Center hub */}
        <motion.circle
          cx="480" cy="270" r="4"
          fill="rgba(56,189,248,0.4)"
          animate={{ r: [4, 6, 4], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export function GlobalRoutesSlide() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useContent().slide6;

  const regions: RegionData[] = [
    {
      id: "eu",
      flag: "🇪🇺",
      name: t.regions[0].name,
      regulation: t.regions[0].regulation,
      badge: t.regions[0].badge,
      clearanceTime: "24h",
      traditionalTime: "72h",
      features: t.regions[0].features,
      color: "from-blue-500/10 to-blue-500/5",
      borderColor: "border-blue-500/25 hover:border-blue-500/40",
    },
    {
      id: "us",
      flag: "🇺🇸",
      name: t.regions[1].name,
      regulation: t.regions[1].regulation,
      badge: t.regions[1].badge,
      clearanceTime: "18h",
      traditionalTime: "72h",
      features: t.regions[1].features,
      color: "from-red-500/10 to-red-500/5",
      borderColor: "border-red-500/25 hover:border-red-500/40",
    },
    {
      id: "my",
      flag: "🇲🇾",
      name: t.regions[2].name,
      regulation: t.regions[2].regulation,
      badge: t.regions[2].badge,
      clearanceTime: "12h",
      traditionalTime: "48h",
      features: t.regions[2].features,
      color: "from-emerald-500/10 to-emerald-500/5",
      borderColor: "border-emerald-500/25 hover:border-emerald-500/40",
    },
    {
      id: "me",
      flag: "🇸🇦",
      name: t.regions[3].name,
      regulation: t.regions[3].regulation,
      badge: t.regions[3].badge,
      clearanceTime: "20h",
      traditionalTime: "60h",
      features: t.regions[3].features,
      color: "from-amber-500/10 to-amber-500/5",
      borderColor: "border-amber-500/25 hover:border-amber-500/40",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden bg-[#020617]">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, #0c1a2e 0%, #020617 70%)" }} />

      <RouteVisualization />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <motion.div className="text-center mb-4 md:mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div
            className="inline-flex items-center gap-2 mb-2 md:mb-3 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Globe className="w-3 h-3 text-blue-400" />
            <span className="text-[9px] md:text-xs font-mono tracking-[0.2em] uppercase text-blue-400/90">
              {t.badge}
            </span>
          </motion.div>

          <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t.title}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
              {t.titleHighlight}
            </span>
          </h2>

          <motion.p
            className="mt-2 text-[10px] md:text-sm text-slate-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t.subtitle}
          </motion.p>
        </motion.div>

        {/* Region grid — desktop */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {regions.map((r, i) => (
            <RegionCard key={r.id} region={r} delay={0.3 + i * 0.12} />
          ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-3">
          <RegionCard region={regions[0]} delay={0.3} />
          <RegionCard region={regions[2]} delay={0.5} />
          <MobileExpandButton label={t.mobileLabel} onClick={() => setMobileOpen(true)} />
        </div>
      </div>

      <MobileDetailModal open={mobileOpen} onClose={() => setMobileOpen(false)} title={t.mobileTitle}>
        <div className="space-y-4">
          {regions.map((r) => (
            <div key={r.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <FlagImage code={r.id} className="w-6 h-4" />
                <span className="text-sm font-bold text-white">{r.name}</span>
                <span className="text-[9px] font-mono text-slate-400 ml-auto">{r.regulation}</span>
              </div>
              <div className="text-xs text-emerald-400 font-mono mb-2">
                Clearance: {r.clearanceTime} (was {r.traditionalTime})
              </div>
              <ul className="space-y-1">
                {r.features.map((f, j) => (
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
