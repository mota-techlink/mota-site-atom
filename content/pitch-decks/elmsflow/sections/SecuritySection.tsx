"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldCheck,
  Gavel,
  Lock,
  Leaf,
  ClipboardCheck,
  Globe,
  Sparkles,
  CheckCircle2,
  Zap,
  BarChart3,
  TrendingDown,
  BrainCircuit,
  Fingerprint,
  Server,
  Eye,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  MobileDetailModal,
  MobileExpandButton,
} from "@/components/pitch-deck";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

/* ── Radar timing ─────────────────────────────────────────── */
const CYCLE = 16_000;
const PHASE = CYCLE / 4;
const PHASE_MAP = [1, 3, 2, 0] as const;

const CSS = `
@keyframes rSweep{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes rPulse{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.08)}}
@keyframes scanDown{0%{top:0;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:100%;opacity:0}}
`;

/* ── Radar card accent palette ────────────────────────────── */
const ACC = [
  { hi: "border-cyan-400/50 bg-cyan-500/[0.08] shadow-[0_0_20px_rgba(6,182,212,0.18)]",   lo: "border-white/[0.06] bg-white/[0.02]", ic: "text-cyan-400"    },
  { hi: "border-emerald-400/50 bg-emerald-500/[0.08] shadow-[0_0_20px_rgba(16,185,129,0.18)]", lo: "border-white/[0.06] bg-white/[0.02]", ic: "text-emerald-400" },
  { hi: "border-violet-400/50 bg-violet-500/[0.08] shadow-[0_0_20px_rgba(139,92,246,0.18)]",  lo: "border-white/[0.06] bg-white/[0.02]", ic: "text-violet-400"  },
  { hi: "border-amber-400/50 bg-amber-500/[0.08] shadow-[0_0_20px_rgba(245,158,11,0.18)]",   lo: "border-white/[0.06] bg-white/[0.02]", ic: "text-amber-400"   },
];

const RADAR_ICONS = [
  <ClipboardCheck key="0" className="w-3.5 h-3.5" />,
  <ShieldCheck    key="1" className="w-3.5 h-3.5" />,
  <Sparkles       key="2" className="w-3.5 h-3.5" />,
  <Globe          key="3" className="w-3.5 h-3.5" />,
];

/* ── Security card definitions ────────────────────────────── */
interface SecCard { id: string; Icon: React.ElementType; color: string; accentRgb: string; badgeLabel: string; }
const SEC_CARDS: SecCard[] = [
  { id: "gdpr",     Icon: ShieldCheck, color: "text-emerald-400", accentRgb: "16,185,129", badgeLabel: "EU COMPLIANT" },
  { id: "legal",    Icon: Gavel,       color: "text-blue-400",    accentRgb: "59,130,246", badgeLabel: "SECURED"      },
  { id: "security", Icon: Lock,        color: "text-cyan-400",    accentRgb: "34,211,238", badgeLabel: "ZERO-TRUST"   },
  { id: "eco",      Icon: Leaf,        color: "text-green-400",   accentRgb: "34,197,94",  badgeLabel: "ISO 14067"    },
];

/* ── EU Flag ──────────────────────────────────────────────── */
function EUFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={className} fill="none">
      <rect width="24" height="16" rx="2" fill="#003399" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return <circle key={i} cx={12 + Math.cos(angle) * 5} cy={8 + Math.sin(angle) * 4} r="0.7" fill="#FFD700" />;
      })}
    </svg>
  );
}

/* ── Floating Particles ───────────────────────────────────── */
function FloatingParticles() {
  const particles = useMemo(
    () => Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: `${5 + Math.random() * 90}%`,
      y: `${5 + Math.random() * 90}%`,
      size: 1.5 + Math.random() * 2.5,
      duration: 5 + Math.random() * 8,
      delay: Math.random() * 4,
      color: i % 4 === 0 ? "16,185,129" : i % 4 === 1 ? "59,130,246" : i % 4 === 2 ? "34,211,238" : "34,197,94",
    })),
    [],
  );
  return (
    <>
      {particles.map((p) => (
        <motion.div key={p.id} className="absolute rounded-full pointer-events-none hidden md:block"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size, background: `rgba(${p.color},0.4)` }}
          animate={{ y: [0, -18, 8, -12, 0], x: [0, 6, -4, 3, 0], opacity: [0.2, 0.6, 0.3, 0.5, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </>
  );
}

/* ── Orbiting Ring ────────────────────────────────────────── */
function OrbitRing() {
  return (
    <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 lg:w-200 lg:h-200 rounded-full border border-emerald-500/4 pointer-events-none hidden md:block"
      animate={{ rotate: [0, 360] }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>
      <motion.div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-400/30" style={{ boxShadow: "0 0 12px rgba(16,185,129,0.4)" }} />
      <motion.div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400/20" style={{ boxShadow: "0 0 10px rgba(34,211,238,0.3)" }} />
    </motion.div>
  );
}

/* ── Live Status ──────────────────────────────────────────── */
function LiveStatus({ color, label }: { color: string; label?: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="relative flex h-1.5 w-1.5">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${color.replace("text-", "bg-")}`} />
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${color.replace("text-", "bg-")}`} />
      </span>
      <span className="text-[9px] font-mono font-bold text-emerald-400/80 uppercase tracking-widest">{label ?? "Active"}</span>
    </div>
  );
}

/* ── Security Card (slide-up reveal) ─────────────────────── */
function ScrollLock({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop === 0 && e.deltaY < 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight && e.deltaY > 0;
      if (!atTop && !atBottom) e.stopPropagation();
      e.stopPropagation(); // always trap — prevent page from moving while box is hovered
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);
  return (
    <div ref={ref} className="overflow-y-auto flex-1 pr-0.5">
      {children}
    </div>
  );
}

function SecurityCard({ card, index, loc, activeStatus }: { card: SecCard; index: number; loc: { title: string; subtitle: string; description: string; details: string[] }; activeStatus?: string }) {
  const [hovered, setHovered] = useState(false);
  const { Icon } = card;
  return (
    <motion.div
      className="relative rounded-xl overflow-hidden cursor-default flex flex-col"
      style={{ background: `linear-gradient(135deg,rgba(${card.accentRgb},0.07) 0%,rgba(15,23,42,0.8) 60%,rgba(${card.accentRgb},0.04) 100%)`, backdropFilter: "blur(18px)" }}
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 + index * 0.1, type: "spring", stiffness: 120, damping: 14 }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    >
      {/* border */}
      <div className="absolute inset-0 rounded-xl border pointer-events-none z-10"
        style={{ borderColor: `rgba(${card.accentRgb},${hovered ? 0.5 : 0.18})`, transition: "border-color 0.3s" }} />

      {/* Normal face */}
      <div className="relative z-20 p-3 lg:p-4 flex flex-col h-full gap-2">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0"
            style={{ backgroundColor: `rgba(${card.accentRgb},0.14)`, borderColor: `rgba(${card.accentRgb},0.32)` }}>
            <Icon className={`w-5 h-5 ${card.color}`} />
          </div>
          <LiveStatus color={card.color} label={activeStatus} />
        </div>
        <div className={`text-sm lg:text-base font-extrabold leading-tight ${card.color}`}>{loc.title}</div>
        <div className="text-xs lg:text-sm font-mono text-slate-400 uppercase tracking-wide leading-snug">{loc.subtitle}</div>
        <div className="flex-1" />
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] lg:text-xs font-mono font-bold uppercase tracking-widest self-start"
          style={{ backgroundColor: `rgba(${card.accentRgb},0.1)`, borderColor: `rgba(${card.accentRgb},0.3)`, color: `rgba(${card.accentRgb},0.9)` }}>
          <ShieldCheck className="w-3 h-3" />{card.badgeLabel}
        </div>
      </div>

      {/* Slide-up detail overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 z-30 rounded-xl flex flex-col p-3 lg:p-4"
            style={{ background: `linear-gradient(to top, rgba(7,11,18,0.97) 60%, rgba(7,11,18,0.88) 100%)`, backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0, y: "100%" }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className={`text-sm font-bold mb-1.5 shrink-0 ${card.color}`}>{loc.title}</div>
            <ScrollLock>
              <p className="text-xs lg:text-sm text-slate-300 leading-relaxed mb-2">{loc.description}</p>
              <div className="space-y-1.5">
                {loc.details.map((d, j) => (
                  <div key={j} className="flex items-start gap-2 text-xs lg:text-sm text-slate-200">
                    <span className="shrink-0">✅</span><span className="leading-snug">{d}</span>
                  </div>
                ))}
              </div>
            </ScrollLock>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── IoT Strip (compact clickable + modal) ────────────────── */
function IoTStrip({ banner }: { banner: { title: string; description: string; pills: string[]; tag?: string; items?: { emoji: string; label: string; body: string }[] } }) {
  const [open, setOpen] = useState(false);
  const PILL_EMOJIS = ["📡", "🌡️", "📋"];
  const modalItems = banner.items ?? [
    { emoji: "📡", label: "IoT Sensor Integration",     body: "Real-time sensor data ingestion from cold-chain hardware, GPS trackers, and environmental monitors across the shipment corridor." },
    { emoji: "🌡️", label: "Temperature Monitoring",      body: "Continuous end-to-end temperature logging with configurable alert thresholds. Breach events are timestamped and signed for regulatory evidence." },
    { emoji: "📋", label: "Insurance & Compliance Logs",  body: "Automated breach reports generated in HACCP-compliant format, ready for insurance claims and regulatory audits with full chain-of-custody." },
    { emoji: "🏥", label: "Pharma Cold-Chain (IND→CHN)", body: "Supports GMP/GDP-aligned shipments from America & Ireland to China, with digitally sealed provenance records accepted by Chinese customs portals." },
  ];
  return (
    <>
      {/* Compact clickable bar */}
      <motion.button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-cyan-500/25 flex items-center justify-between gap-3 px-4 py-3 mt-1.5 text-left group cursor-pointer"
        style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.08) 0%,rgba(15,23,42,0.6) 100%)", backdropFilter: "blur(12px)" }}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏭</span>
          <div>
            <div className="text-sm lg:text-base font-extrabold text-cyan-300 leading-tight">{banner.title}</div>
            <div className="flex items-center gap-2 mt-1">
              {PILL_EMOJIS.map((em, i) => (
                <span key={i} className="text-base">{em}</span>
              ))}
              <span className="text-xs text-slate-400 font-mono">{banner.tag ?? "Pharma · IoT · Cold-Chain"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-xs font-bold text-cyan-300 group-hover:bg-cyan-500/20 transition-colors shrink-0">
          <span>🔍</span> Details
        </div>
      </motion.button>

      {/* Detail modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* backdrop */}
            <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            {/* panel */}
            <motion.div
              className="relative z-10 w-full max-w-lg rounded-2xl border border-cyan-500/30 shadow-2xl overflow-hidden"
              style={{ background: "rgba(7,11,18,0.97)", backdropFilter: "blur(24px)" }}
              initial={{ opacity: 0, y: 32, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}>
              {/* header */}
              <div className="flex items-center justify-between p-5 border-b border-cyan-500/15">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏭</span>
                  <div>
                    <div className="text-lg font-extrabold text-cyan-300">{banner.title}</div>
                    <div className="text-sm text-slate-400 mt-0.5">{banner.description}</div>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 transition-colors text-base">
                  ✕
                </button>
              </div>
              {/* body */}
              <div className="p-5 space-y-4">
                {modalItems.map((item, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                    <span className="text-2xl shrink-0">{item.emoji}</span>
                    <div>
                      <div className="text-sm font-bold text-cyan-300 mb-1">{item.label}</div>
                      <p className="text-sm text-slate-300 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Trust Score ──────────────────────────────────────────── */
function TrustScore({ label, certBadges }: { label: string; certBadges: string[] }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(count, 100, { duration: 2.5, delay: 1.2, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [count, rounded]);
  return (
    <motion.div className="flex items-center gap-3 lg:gap-5"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0, type: "spring", stiffness: 100 }}>
      <span className="text-[10px] lg:text-xs font-mono text-slate-500 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-white/5 overflow-hidden">
        <motion.div className="h-full rounded-full bg-linear-to-r from-emerald-500 via-cyan-400 to-blue-500"
          initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 1.2, duration: 2.5, ease: "easeOut" }} />
      </div>
      <motion.span className="text-sm lg:text-base font-mono font-black text-emerald-400 w-10 text-right"
        animate={{ scale: display === 100 ? [1, 1.15, 1] : 1 }} transition={{ duration: 0.3 }}>
        {display}%
      </motion.span>
      <div className="hidden lg:flex items-center gap-2">
        {certBadges.map((cert, i) => (
          <motion.span key={cert} className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-500/25 bg-emerald-50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400/70 tracking-wider"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.8 + i * 0.15, type: "spring" }}>
            {cert}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   Main merged section: AI Compliance Radar ＋ Security ＋ IoT
   ════════════════════════════════════════════════════════════ */
export function SecuritySection() {
  const content = useContent();
  const c9  = content.slide9;   // security / IoT / badge
  const c15 = content.slide15;  // AI compliance radar content

  const [phase, setPhase] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 4), PHASE);
    return () => clearInterval(id);
  }, []);

  const activeIdx = PHASE_MAP[phase];
  const displayIdx = hoveredFeature !== null ? hoveredFeature : activeIdx;

  const secCards = SEC_CARDS.map((card, i) => ({ ...card, loc: c9.cards[i] }));

  const statIcons = [
    <TrendingDown key="0" className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-emerald-400" />,
    <Zap          key="1" className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-cyan-400" />,
    <Globe        key="2" className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-violet-400" />,
    <BarChart3    key="3" className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-amber-400" />,
  ];
  const statAccents = [
    "border-emerald-500/25 bg-emerald-500/[0.06]",
    "border-cyan-500/25 bg-cyan-500/[0.06]",
    "border-violet-500/25 bg-violet-500/[0.06]",
    "border-amber-500/25 bg-amber-500/[0.06]",
  ];

  return (
    <div className={SECTION}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="w-full h-full flex flex-col justify-center items-center bg-slate-50 dark:bg-linear-to-br dark:from-slate-950 dark:via-[#060a14] dark:to-slate-950 text-slate-800 dark:text-white relative overflow-hidden px-3 py-2 md:px-5 md:py-3">

        {/* ── Background FX ── */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-cyan-600/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-emerald-500/4 blur-[100px] rounded-full pointer-events-none" />
        <FloatingParticles />
        <OrbitRing />
        {[
          { Icon: Fingerprint, x: "6%",  y: "20%", size: 20, delay: 0   },
          { Icon: Eye,         x: "91%", y: "25%", size: 18, delay: 1   },
          { Icon: Server,      x: "8%",  y: "75%", size: 16, delay: 2   },
          { Icon: Activity,    x: "88%", y: "72%", size: 18, delay: 1.5 },
        ].map(({ Icon, x, y, size, delay }, i) => (
          <motion.div key={i} className="absolute text-slate-600/40 hidden md:block" style={{ left: x, top: y }}
            animate={{ opacity: [0.03, 0.09, 0.04, 0.07, 0.03], rotate: [0, 6, -6, 3, 0], y: [0, -5, 3, -2, 0] }}
            transition={{ opacity: { duration: 5 + i, repeat: Infinity, delay }, rotate: { duration: 8 + i * 2, repeat: Infinity, delay }, y: { duration: 6 + i, repeat: Infinity, delay, ease: "easeInOut" } }}>
            <Icon style={{ width: size, height: size }} />
          </motion.div>
        ))}

        {/* ── Badge ── */}
        <motion.div className="ei-child inline-flex items-center gap-2 mb-1.5 px-3 py-0.5 rounded-full border border-cyan-500/25 bg-cyan-500/8 relative z-10"
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] md:text-xs font-mono tracking-[0.18em] uppercase text-cyan-400/90">{c9.badge}</span>
        </motion.div>

        {/* ── Title ── */}
        <motion.h2 className="ei-child text-lg md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-center mb-0.5 relative z-10"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <span className="text-slate-800 dark:text-white">{c9.title} </span>
          <span className="text-cyan-400">{c9.titleHighlight}</span>
        </motion.h2>
        <motion.p className="ei-child text-[10px] md:text-sm text-slate-500 dark:text-white/50 text-center max-w-2xl mb-1.5 md:mb-2 relative z-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}>
          {c9.subtitle}
        </motion.p>

        {/* ── Stats row (from AI compliance) ── */}
        <motion.div className="ei-child relative z-10 grid grid-cols-4 gap-1.5 md:gap-2 w-full max-w-4xl mb-2 md:mb-2.5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
          {c15.stats.map((s: { value: string; label: string }, i: number) => (
            <div key={i} className={`rounded-xl border ${statAccents[i]} backdrop-blur-sm p-1.5 md:p-2 flex flex-col gap-0.5 items-center text-center`}>
              <div>{statIcons[i]}</div>
              <div className="text-sm md:text-lg font-extrabold text-slate-800 dark:text-white">{s.value}</div>
              <div className="text-[8px] md:text-[9px] text-slate-500 dark:text-white/50 font-mono uppercase tracking-wider leading-tight">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ████ DESKTOP: two-column layout ████ */}
        <div className="relative z-10 hidden md:grid grid-cols-2 gap-3 lg:gap-4 w-full max-w-4xl xl:max-w-5xl">

          {/* ── LEFT: AI Compliance Radar ── */}
          <motion.div className="relative rounded-2xl border border-slate-200 dark:border-cyan-500/10 bg-[#070b12]/70 backdrop-blur-md overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>

            {/* Radar rings */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-70" viewBox="0 0 500 400" preserveAspectRatio="xMidYMid slice">
              {[60, 100, 140, 180].map((r) => (
                <ellipse key={r} cx={250} cy={200} rx={r * 1.45} ry={r} fill="none" stroke="rgba(6,182,212,0.06)" strokeWidth={0.7} />
              ))}
              <line x1={250} y1={8}   x2={250} y2={392} stroke="rgba(6,182,212,0.05)" strokeWidth={0.5} strokeDasharray="4 5" />
              <line x1={8}   y1={200} x2={492} y2={200} stroke="rgba(6,182,212,0.05)" strokeWidth={0.5} strokeDasharray="4 5" />
              <circle cx={250} cy={200} r={2} fill="rgba(6,182,212,0.3)" />
            </svg>

            {/* Sweep beam */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <div style={{ position: "absolute", top: "50%", left: "50%", width: 1400, height: 1400, marginTop: -700, marginLeft: -700,
                background: `conic-gradient(from 0deg at 50% 50%, rgba(6,182,212,0.22) 0deg, transparent 4deg, transparent 300deg, rgba(6,182,212,0.01) 330deg, rgba(6,182,212,0.10) 355deg, rgba(6,182,212,0.22) 360deg)`,
                animation: `rSweep ${CYCLE}ms linear infinite` }} />
            </div>

            {/* 2×2 feature grid */}
            <div className="relative z-10 p-2.5 lg:p-3 grid grid-cols-2 gap-2 lg:gap-2.5 flex-1">
              {c15.features.map((f: { title: string; description: string; items: string[] }, i: number) => {
                const on = i === displayIdx;
                const a = ACC[i];
                return (
                  <motion.div key={i}
                    className={`relative rounded-xl border backdrop-blur-sm p-2 lg:p-2.5 transition-all duration-700 flex flex-col cursor-default ${on ? a.hi : a.lo}`}
                    animate={{ opacity: on ? 1 : 0.38 }} transition={{ duration: 0.6 }}
                    onMouseEnter={() => setHoveredFeature(i)}
                    onMouseLeave={() => setHoveredFeature(null)}>
                    {on && (
                      <div key={`sl-${phase}`} className="absolute inset-x-0 h-px pointer-events-none z-20"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.6), transparent)", animation: `scanDown ${PHASE}ms linear forwards` }} />
                    )}
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className={`${a.ic} [&>svg]:w-4 [&>svg]:h-4`}>{RADAR_ICONS[i]}</span>
                      <h3 className="text-sm lg:text-base font-extrabold text-white leading-tight">{f.title}</h3>
                    </div>
                    <ul className="space-y-1.5 flex-1">
                      {f.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-1.5 text-xs lg:text-sm text-white/70">
                          <span >{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            {/* Centre "AI DRIVEN" circle — sits at 4-card intersection */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div className="w-11 h-11 lg:w-13 lg:h-13 rounded-full flex flex-col items-center justify-center gap-0"
                style={{
                  background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(7,11,18,0.80) 70%)",
                  border: "1.5px solid rgba(6,182,212,0.45)",
                  backdropFilter: "blur(6px)",
                  boxShadow: "0 0 18px rgba(6,182,212,0.25), inset 0 0 10px rgba(6,182,212,0.08)",
                  animation: "rPulse 3s ease-in-out infinite"
                }}>
                <BrainCircuit className="w-5 h-5 lg:w-6 lg:h-6 text-cyan-400" />
                <span className="text-[7px] font-black tracking-[0.15em] text-cyan-300/80 uppercase leading-none mt-0.5">AI</span>
              </div>
            </div>

            {/* Bottom note */}
            <p className="relative z-10 text-[9px] text-cyan-400/60 font-mono text-center pb-2 px-3">{c15.bottomNote}</p>
          </motion.div>

          {/* ── RIGHT: Security Cards + IoT Strip + Trust Score ── */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2 flex-1">
              {secCards.map((card, i) => (
                <SecurityCard key={card.id} card={card} index={i} loc={card.loc} activeStatus={c9.activeStatus} />
              ))}
            </div>
            {c9.iotBanner && <IoTStrip banner={c9.iotBanner} />}
            <TrustScore label={c9.trustScoreLabel} certBadges={c9.certBadges} />
          </div>
        </div>

        {/* ████ MOBILE ████ */}
        <div className="relative z-10 flex md:hidden flex-col items-center gap-2.5 w-full mt-1">
          {/* Compact radar stub */}
          <div className="w-full rounded-xl border border-cyan-500/12 bg-[#070b12]/60 p-2 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
              <div style={{ position: "absolute", top: "50%", left: "50%", width: 800, height: 800, marginTop: -400, marginLeft: -400,
                background: "conic-gradient(from 0deg at 50% 50%, rgba(6,182,212,0.18) 0deg, transparent 5deg, transparent 355deg, rgba(6,182,212,0.18) 360deg)",
                animation: `rSweep ${CYCLE}ms linear infinite` }} />
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-1.5">
              {c15.features.map((f: { title: string }, i: number) => {
                const on = i === activeIdx;
                const a = ACC[i];
                return (
                  <div key={i} className={`rounded-lg border p-1.5 text-[9px] font-semibold text-white transition-all duration-700 ${on ? a.hi : a.lo}`}>
                    <div className="flex items-center gap-1"><span className={a.ic}>{RADAR_ICONS[i]}</span>{f.title}</div>
                  </div>
                );
              })}
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <div className="w-9 h-9 rounded-full flex flex-col items-center justify-center"
                style={{ background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(7,11,18,0.82) 70%)", border: "1.5px solid rgba(6,182,212,0.45)", backdropFilter: "blur(6px)", animation: "rPulse 3s ease-in-out infinite" }}>
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span className="text-[6px] font-black tracking-widest text-cyan-300/80 uppercase leading-none">AI</span>
              </div>
            </div>
          </div>

          {/* Mini security cards */}
          <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
            {secCards.map((card, i) => {
              const { Icon } = card;
              return (
                <motion.div key={card.id} className="relative rounded-xl p-2 border"
                  style={{ background: `linear-gradient(135deg,rgba(${card.accentRgb},0.06) 0%,rgba(15,23,42,0.6) 100%)`, borderColor: `rgba(${card.accentRgb},0.15)` }}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.2 + i * 0.08, type: "spring" }}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: `rgba(${card.accentRgb},0.12)` }}>
                      <Icon className={`w-3 h-3 ${card.color}`} />
                    </div>
                    <LiveStatus color={card.color} label={c9.activeStatus} />
                  </div>
                  <div className={`text-[9px] font-bold ${card.color}`}>{card.loc.title}</div>
                  <div className="text-[8px] text-slate-600 font-mono">{card.loc.subtitle}</div>
                </motion.div>
              );
            })}
          </div>

          <MobileExpandButton label={c9.mobileExpand} onClick={() => setMobileOpen(true)} />
        </div>

        {/* ── Mobile Detail Modal ── */}
        <MobileDetailModal open={mobileOpen} onClose={() => setMobileOpen(false)} title={c9.mobileModal.title} subtitle={c9.mobileModal.subtitle}>
          <div className="space-y-4">
            {/* Compliance features */}
            <div className="text-[10px] font-mono text-cyan-400/80 uppercase tracking-wider border-b border-white/5 pb-2">{c9.radarSectionLabel}</div>
            {c15.features.map((f: { title: string; description: string; items: string[] }, i: number) => {
              const a = ACC[i];
              return (
                <div key={i} className={`rounded-lg border p-2.5 ${a.lo}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={a.ic}>{RADAR_ICONS[i]}</span>
                    <div className="text-xs font-bold text-white">{f.title}</div>
                  </div>
                  <p className="text-[10px] text-slate-400 mb-1.5">{f.description}</p>
                  {f.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500/50 shrink-0" /><span>{item}</span>
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Security cards */}
            <div className="text-[10px] font-mono text-emerald-400/80 uppercase tracking-wider border-b border-white/5 pb-2 pt-1">{c9.secSectionLabel}</div>
            {secCards.map((card) => {
              const { Icon } = card;
              return (
                <div key={card.id}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center border"
                      style={{ backgroundColor: `rgba(${card.accentRgb},0.1)`, borderColor: `rgba(${card.accentRgb},0.2)` }}>
                      <Icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className={`text-xs font-bold ${card.color}`}>{card.loc.title}</div>
                      <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{card.loc.subtitle}</div>
                    </div>
                    <LiveStatus color={card.color} label={c9.activeStatus} />
                  </div>
                  {card.id === "gdpr" && (
                    <div className="flex items-center gap-2 mb-1.5">
                      <EUFlag className="w-6 h-4" />
                      <span className="text-[9px] font-mono text-blue-400/60">{c9.euDataLabel}</span>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 leading-relaxed mb-1.5">{card.loc.description}</p>
                  {card.loc.details.map((d: string, j: number) => (
                    <div key={j} className="flex items-center gap-1.5 text-[9px] text-slate-500">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500/50 shrink-0" /><span>{d}</span>
                    </div>
                  ))}
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[8px] font-mono font-bold uppercase tracking-widest"
                    style={{ backgroundColor: `rgba(${card.accentRgb},0.08)`, borderColor: `rgba(${card.accentRgb},0.2)`, color: `rgba(${card.accentRgb},0.8)` }}>
                    <ShieldCheck className="w-2.5 h-2.5" />{card.badgeLabel}
                  </div>
                </div>
              );
            })}

            {/* IoT banner */}
            {c9.iotBanner && (
              <div className="rounded-lg border border-cyan-500/20 p-2.5 bg-cyan-500/5">
                <div className="text-xs font-bold text-cyan-300 mb-1">{c9.iotBanner.title}</div>
                <p className="text-[10px] text-slate-400 mb-2">{c9.iotBanner.description}</p>
                {c9.iotBanner.pills.map((pill: string, i: number) => (
                  <div key={i} className="text-[9px] text-cyan-300/80 font-mono">• {pill}</div>
                ))}
              </div>
            )}

            {/* Trust score */}
            <div className="pt-3 border-t border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">{c9.trustScoreLabel}</span>
                <span className="text-base font-mono font-black text-emerald-400">100%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden mt-1.5">
                <div className="h-full w-full rounded-full bg-linear-to-r from-emerald-500 via-cyan-400 to-blue-500" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                {c9.certBadges.map((cert: string) => (
                  <span key={cert} className="text-[8px] font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-500/20 bg-emerald-500/5 text-emerald-400/70 tracking-wider">{cert}</span>
                ))}
              </div>
            </div>
          </div>
        </MobileDetailModal>
      </div>
    </div>
  );
}
