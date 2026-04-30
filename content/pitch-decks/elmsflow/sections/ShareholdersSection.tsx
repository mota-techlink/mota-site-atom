"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, X } from "lucide-react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

// Logos/badges per shareholder (index-aligned with locale members array)
type LogoItem = { src: string; alt: string; lightBg?: boolean };
type MemberLogos = {
  logos?: LogoItem[];
  badges?: string[];
};
const MEMBER_LOGOS: MemberLogos[] = [
  // 0: Turlough Sheehan (CEO)
  { badges: ["🚢 DDP Pioneer", "📋 Section 321", "⏳ 40+ Yrs"] },
  // 1: Harling Sun (CTO)
  {
    logos: [
      { src: "/icons/ebay.svg", alt: "eBay" },
      { src: "/icons/ibm.svg", alt: "IBM" },
      { src: "/icons/konami.svg", alt: "Konami" },
      { src: "/icons/sun-microsystems.svg", alt: "Sun Microsystems" },
    ],
    badges: ["☕ Java Certified"],
  },
  // 2: Paul Brennan (COO)
  {
    logos: [
      { src: "/icons/mcdonalds.svg", alt: "McDonald's" },
      { src: "/icons/apple-black.svg", alt: "Apple", lightBg: true },
      { src: "/icons/microsoft.svg", alt: "Microsoft" },
    ],
    badges: ["📦 Smurfit Kappa"],
  },
  // 3: Siobhain McHugh (CFO)
  { badges: ["⚖️ Matheson", "📊 CIMA", "🏢 McHugh & Assoc."] },
];

// ─── Per-role theme tokens ────────────────────────────────────────────────────
type RoleTheme = {
  topBar: string;
  cardBg: string;
  halo: string;
  badge: string;
  hoverShadow: string;
  hoverBorder: string;
  ringColor: string;
  dotColor: string;
};
const ROLE_THEME: Record<string, RoleTheme> = {
  CEO: {
    topBar: "bg-gradient-to-r from-amber-400 to-yellow-500",
    cardBg: "bg-gradient-to-b from-amber-500/[0.08] to-transparent",
    halo: "bg-amber-400/20",
    badge: "border-l-2 border-amber-400 bg-amber-500/15 text-amber-300",
    hoverShadow:
      "0 0 35px rgba(245,158,11,0.22), 0 8px 32px rgba(245,158,11,0.1)",
    hoverBorder: "rgba(245,158,11,0.45)",
    ringColor: "ring-amber-400/60",
    dotColor: "bg-amber-400",
  },
  CTO: {
    topBar: "bg-gradient-to-r from-cyan-400 to-blue-500",
    cardBg: "bg-gradient-to-b from-cyan-500/[0.08] to-transparent",
    halo: "bg-cyan-400/20",
    badge: "border-l-2 border-cyan-400 bg-cyan-500/15 text-cyan-300",
    hoverShadow:
      "0 0 35px rgba(34,211,238,0.22), 0 8px 32px rgba(34,211,238,0.1)",
    hoverBorder: "rgba(34,211,238,0.45)",
    ringColor: "ring-cyan-400/60",
    dotColor: "bg-cyan-400",
  },
  COO: {
    topBar: "bg-gradient-to-r from-emerald-400 to-teal-500",
    cardBg: "bg-gradient-to-b from-emerald-500/[0.08] to-transparent",
    halo: "bg-emerald-400/20",
    badge: "border-l-2 border-emerald-400 bg-emerald-500/15 text-emerald-300",
    hoverShadow:
      "0 0 35px rgba(52,211,153,0.22), 0 8px 32px rgba(52,211,153,0.1)",
    hoverBorder: "rgba(52,211,153,0.45)",
    ringColor: "ring-emerald-400/60",
    dotColor: "bg-emerald-400",
  },
  CFO: {
    topBar: "bg-gradient-to-r from-violet-400 to-purple-500",
    cardBg: "bg-gradient-to-b from-violet-500/[0.08] to-transparent",
    halo: "bg-violet-400/20",
    badge: "border-l-2 border-violet-400 bg-violet-500/15 text-violet-300",
    hoverShadow:
      "0 0 35px rgba(167,139,250,0.22), 0 8px 32px rgba(167,139,250,0.1)",
    hoverBorder: "rgba(167,139,250,0.45)",
    ringColor: "ring-violet-400/60",
    dotColor: "bg-violet-400",
  },
};

const DEFAULT_THEME = ROLE_THEME.COO;

// Deterministic pseudo-random so SSR & client match
const PARTICLES = Array.from({ length: 24 }, (_, i) => {
  const seed = (i + 1) * 9301;
  const rand = (n: number) => ((Math.sin(seed * (n + 1)) + 1) / 2);
  return {
    left: rand(1) * 100,
    top: rand(2) * 100,
    delay: rand(3) * 6,
    duration: 6 + rand(4) * 8,
    size: 1 + rand(5) * 2,
  };
});

// ─── Per-role Photo Frame ─────────────────────────────────────────────────────
function PhotoFrame({ role, photo, name }: { role: string; photo: string; name: string }) {
  const W = "w-28 md:w-32";
  const H = "h-[9.3rem] md:h-[10.7rem]";
  const sizes = "(max-width: 768px) 112px, 128px";

  // CEO — gold authority: double border + corner ornaments + warm glow
  if (role === "CEO") return (
    <div className={`relative ${W} ${H} mb-4`}>
      {/* Outer gold ring */}
      <div className="absolute -inset-[3px] rounded-2xl border border-amber-400/50" />
      {/* Inner glow ring */}
      <div className="absolute -inset-[6px] rounded-3xl border border-amber-400/15" />
      {/* Corner ornaments */}
      {(["-top-2 -left-2", "-top-2 -right-2", "-bottom-2 -left-2", "-bottom-2 -right-2"] as const).map((pos, idx) => (
        <div key={idx} className={`absolute ${pos} w-3 h-3`}>
          <div className="absolute top-0 left-0 w-full h-[2px] bg-amber-400/80 rounded-full" />
          <div className="absolute top-0 left-0 w-[2px] h-full bg-amber-400/80 rounded-full" />
        </div>
      ))}
      {/* Warm bottom glow */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full blur-lg bg-amber-400/30 pointer-events-none" />
      {/* Photo */}
      <motion.div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 0 0 1.5px rgba(251,191,36,0.4), inset 0 0 20px rgba(251,191,36,0.04)" }}
        whileHover={{ boxShadow: "0 0 0 1.5px rgba(251,191,36,0.8), 0 6px 28px rgba(251,191,36,0.22)" }}
        transition={{ duration: 0.3 }}
      >
        <Image src={photo} alt={name} fill sizes={sizes} className="object-cover object-top" />
        {/* Top gold shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-amber-300/10 via-transparent to-transparent pointer-events-none"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );

  // CTO — tech blue: circuit corners + scan line
  if (role === "CTO") return (
    <div className={`relative ${W} ${H} mb-4`}>
      {/* Circuit corner decorations */}
      {([
        { pos: "-top-2 -left-2", h: "top-0 left-3", v: "left-0 top-3" },
        { pos: "-top-2 -right-2", h: "top-0 right-3", v: "right-0 top-3" },
        { pos: "-bottom-2 -left-2", h: "bottom-0 left-3", v: "left-0 bottom-3" },
        { pos: "-bottom-2 -right-2", h: "bottom-0 right-3", v: "right-0 bottom-3" },
      ] as const).map(({ pos, h, v }, idx) => (
        <div key={idx} className={`absolute ${pos} w-5 h-5`}>
          <div className={`absolute ${h} w-2 h-[1.5px] bg-cyan-400/70`} />
          <div className={`absolute ${v} w-[1.5px] h-2 bg-cyan-400/70`} />
          <div className="absolute top-[3px] left-[3px] w-1.5 h-1.5 rounded-full border border-cyan-400/60 bg-cyan-400/10" />
        </div>
      ))}
      {/* Cool cyan bottom glow */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full blur-lg bg-cyan-400/25 pointer-events-none" />
      {/* Photo */}
      <motion.div
        className="group/cto relative w-full h-full rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 0 1px rgba(34,211,238,0.3)" }}
        whileHover={{ boxShadow: "0 0 0 1.5px rgba(34,211,238,0.7), 0 4px 24px rgba(34,211,238,0.2)" }}
        transition={{ duration: 0.3 }}
      >
        <Image src={photo} alt={name} fill sizes={sizes} className="object-cover object-top" />
        {/* Scan line — only on hover */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent pointer-events-none opacity-0 group-hover/cto:opacity-100 transition-opacity"
          animate={{ top: ["-5%", "105%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
        />
        {/* Top tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/8 via-transparent to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );

  // COO — operational green: dashed border + industrial corner bolts
  if (role === "COO") return (
    <div className={`relative ${W} ${H} mb-4`}>
      {/* Dashed outer frame */}
      <div className="absolute -inset-[4px] rounded-2xl border-2 border-dashed border-emerald-500/40" />
      {/* Corner bolts */}
      {(["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"] as const).map((pos, idx) => (
        <div key={idx} className={`absolute ${pos} w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center`}>
          <div className="w-1 h-1 rounded-full bg-emerald-400/80" />
        </div>
      ))}
      {/* Green bottom glow */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full blur-lg bg-emerald-500/30 pointer-events-none" />
      {/* Photo */}
      <motion.div
        className="relative w-full h-full rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 0 1px rgba(52,211,153,0.3)" }}
        whileHover={{ boxShadow: "0 0 0 1.5px rgba(52,211,153,0.7), 0 4px 24px rgba(52,211,153,0.2)" }}
        transition={{ duration: 0.3 }}
      >
        <Image src={photo} alt={name} fill sizes={sizes} className="object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/6 via-transparent to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );

  // CFO — elegant violet: gradient ring + diamond ornament
  return (
    <div className={`relative ${W} ${H} mb-4`}>
      {/* Gradient border */}
      <div
        className="absolute -inset-[2px] rounded-2xl pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(167,139,250,0.65) 0%, rgba(236,72,153,0.25) 50%, rgba(167,139,250,0.2) 100%)",
          padding: "1.5px",
          borderRadius: "1rem",
        }}
      >
        <div className="w-full h-full rounded-2xl bg-transparent" />
      </div>
      {/* Diamond top ornament */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border border-violet-400/60 bg-[#0a0e15]" />
      <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-violet-400/50" />
      {/* Violet bottom glow */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full blur-lg bg-violet-500/30 pointer-events-none" />
      {/* Photo */}
      <motion.div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{ boxShadow: "0 0 0 1px rgba(167,139,250,0.35)" }}
        whileHover={{ boxShadow: "0 0 0 1.5px rgba(167,139,250,0.75), 0 4px 28px rgba(167,139,250,0.2)" }}
        transition={{ duration: 0.3 }}
      >
        <Image src={photo} alt={name} fill sizes={sizes} className="object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-b from-violet-400/8 via-transparent to-transparent pointer-events-none" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-violet-300/10 via-transparent to-pink-400/8 pointer-events-none"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}

// ─── Bottom-sheet Modal for compact (< lg) view ───────────────────────────────
type Member = { name: string; role: string; photo: string; bio: string; responsibilities?: string[] };

function MemberSheet({
  member,
  entry,
  theme,
  onClose,
}: {
  member: Member;
  entry: MemberLogos | undefined;
  theme: RoleTheme;
  onClose: () => void;
}) {
  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[60]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />
      {/* Panel */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[61] bg-[#0d1117] rounded-t-3xl max-h-[85vh] landscape:max-h-[92vh] overflow-y-auto border-t border-white/10 shadow-2xl"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        role="dialog"
        aria-modal="true"
        aria-label={`${member.name} details`}
      >
        {/* Drag handle */}
        <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-5" />

        <div className="px-5 pb-5">
          {/* Hero row */}
          <div className="flex gap-4 items-start">
            <div
              className={`relative w-24 h-32 shrink-0 rounded-2xl overflow-hidden ring-2 ${theme.ringColor}`}
            >
              <Image
                src={member.photo}
                alt={member.name}
                fill
                sizes="96px"
                className="object-cover object-top"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                {member.name}
              </h3>
              <span
                className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-md ${theme.badge}`}
              >
                {member.role}
              </span>
              <p className="text-sm text-slate-400 mt-2 line-clamp-4 leading-relaxed">
                {member.bio}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-4" />

          {/* Career Highlights */}
          {entry && (entry.logos?.length || entry.badges?.length) ? (
            <div>
              <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/30 mb-3">
                Career · Highlights
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {entry.logos?.map((l) => (
                  <div
                    key={l.alt}
                    title={l.alt}
                    className="h-12 w-12 rounded-xl flex items-center justify-center p-2 bg-slate-300 border border-slate-200/25"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={l.src}
                      alt={l.alt}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ))}
                {entry.badges?.map((b) => (
                  <span
                    key={b}
                    className="text-[13px] font-medium px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-slate-300"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-white/8 text-white/60 text-sm mt-4 flex items-center justify-center gap-2 hover:bg-white/12 hover:text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export function ShareholdersSection() {
  const content = useContent();
  const c = content.slideShareholders;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const [sectionHovered, setSectionHovered] = useState(false);

  // Auto-carousel: cycle through cards showing bio tooltip, pause when mouse hovers
  const [autoIndex, setAutoIndex] = useState<number | null>(null);
  const memberCount = (c.members as Member[]).length;

  useEffect(() => {
    if (sectionHovered) {
      setAutoIndex(null);
      return;
    }
    // Start with first card after a short delay
    const start = setTimeout(() => setAutoIndex(0), 1500);
    return () => clearTimeout(start);
  }, [sectionHovered]);

  useEffect(() => {
    if (sectionHovered || autoIndex === null) return;
    const timer = setTimeout(() => {
      setAutoIndex((prev) => {
        let next = Math.floor(Math.random() * memberCount);
        // avoid repeating the same card
        if (memberCount > 1 && next === prev) next = (next + 1) % memberCount;
        return next;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [autoIndex, sectionHovered, memberCount]);

  // activeIndex: mouse hover takes priority over auto
  const activeIndex = sectionHovered ? null : autoIndex;

  const openMember =
    openIndex !== null ? (c.members[openIndex] as Member) : null;
  const openTheme =
    openMember ? (ROLE_THEME[openMember.role] ?? DEFAULT_THEME) : null;
  const openEntry = openIndex !== null ? MEMBER_LOGOS[openIndex] : undefined;

  return (
    <section
      className={`${SECTION} bg-[#f0f4f8] dark:bg-[#0a0e15] text-slate-900 dark:text-white relative overflow-hidden`}
      onMouseEnter={() => setSectionHovered(true)}
      onMouseLeave={() => setSectionHovered(false)}
    >
      {/* Animated dot grid background */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(52,211,153,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-emerald-400/40"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: sectionHovered ? 0 : [0, 0.8, 0],
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

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/[0.06] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/[0.05] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <div className="ei-child text-center mb-6 md:mb-10">
          <motion.div
            className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-emerald-400/90">
              Leadership
            </span>
          </motion.div>

          <motion.h2
            className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {c.title}
          </motion.h2>

          <motion.p
            className="text-sm md:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {c.subtitle}
          </motion.p>
        </div>

        {/* Member grid:
            < sm  -> 2 cols (compact)
            sm-md -> 4 cols (compact)
            >= lg -> 4 cols (full) */}
        <div className="ei-child grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {c.members.map((m, i) => {
            const theme = ROLE_THEME[m.role] ?? DEFAULT_THEME;
            return (
            <motion.div
              key={m.name}
              role="button"
              tabIndex={0}
              onClick={() => {
                // Only treat clicks as "open" on compact (< lg). On lg+ the click is a no-op
                // since the full card already shows everything.
                if (typeof window !== "undefined" && window.innerWidth < 1024) {
                  setOpenIndex(i);
                }
              }}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && typeof window !== "undefined" && window.innerWidth < 1024) {
                  e.preventDefault();
                  setOpenIndex(i);
                }
              }}
              className={`group relative bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-3 md:p-4 lg:p-6 pt-5 md:pt-5 lg:pt-7 flex flex-col items-center text-center transition-colors overflow-hidden cursor-pointer lg:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30`}
              onMouseEnter={(e) => {
                setSectionHovered(true);
                const card = e.currentTarget;
                const divider = card.querySelector('[data-ch-divider]') as HTMLElement | null;
                if (divider) {
                  const pct = ((divider.offsetTop) / card.offsetHeight) * 100;
                  card.style.setProperty('--tooltip-top', `${pct}%`);
                }
              }}
              onMouseLeave={() => setSectionHovered(false)}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{
                opacity: 1,
                y: activeIndex === i ? -6 : 0,
                filter: "blur(0px)",
                boxShadow: activeIndex === i ? theme.hoverShadow : "none",
                borderColor: activeIndex === i ? theme.hoverBorder : "rgba(255,255,255,0.1)",
              }}
              transition={activeIndex !== null
                ? { duration: 0.15, ease: "easeOut" }
                : { delay: 0.5 + i * 0.12, duration: 0.55, ease: "easeOut" }
              }
              whileHover={{
                y: -4,
                boxShadow: theme.hoverShadow,
                borderColor: theme.hoverBorder,
                transition: { duration: 0.1, ease: "easeOut" },
              }}
            >
              {/* Role-colored top accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${theme.topBar} rounded-t-2xl pointer-events-none`} />

              {/* Role-tinted background wash */}
              <div className={`absolute inset-0 ${theme.cardBg} pointer-events-none rounded-2xl`} />

              {/* Index badge — desktop only to keep compact tiles clean */}
              <span className="hidden lg:inline absolute top-3 right-3 z-10 text-[10px] font-mono tracking-widest text-white/30 group-hover:text-white/60 transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* "Tap for details" affordance — compact only */}
              <span className="lg:hidden absolute bottom-2 right-2 z-10 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-white/60 backdrop-blur-sm">
                <Plus className="w-3.5 h-3.5" />
              </span>

              {/* Shimmer scan line on hover (desktop) */}
              <div className="hidden lg:block pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                <motion.div
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100"
                  initial={{ top: "-10%" }}
                  animate={{ top: "110%" }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>

              {/* Photo frame — per-role design, with role-colored halo behind */}
              <div className="relative z-10 isolate flex items-center justify-center">
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full ${theme.halo} blur-2xl -z-10 pointer-events-none`}
                />
                <PhotoFrame role={m.role} photo={m.photo} name={m.name} />
              </div>

              {/* Role badge — left-bar style */}
              <span className={`relative z-10 inline-block text-[10px] sm:text-[11px] md:text-xs font-semibold px-2 sm:px-3 py-1 rounded-md mb-2 ${theme.badge}`}>
                {m.role}
              </span>

              {/* Name */}
              <h3 className="relative z-10 text-white text-sm sm:text-base lg:text-xl font-extrabold tracking-tight mb-2 leading-tight">
                {m.name}
              </h3>

              {/* Bio — hidden (kept for compact sheet only); shown as hover tooltip on lg */}
              <p className="hidden relative z-10 text-slate-400 text-xs md:text-sm leading-relaxed">
                {m.bio}
              </p>

              {/* Career logos / badges — desktop only */}
              {(() => {
                const entry = MEMBER_LOGOS[i];
                if (!entry || (!entry.logos?.length && !entry.badges?.length)) return null;
                return (
                  <div className="hidden lg:flex relative z-10 mt-3 pt-3 border-t border-white/8 w-full flex-col items-center" data-ch-divider>
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                    {entry.logos?.map((l) => (
                      <div
                        key={l.alt}
                        title={l.alt}
                        className="h-11 w-11 rounded-xl flex items-center justify-center p-2 transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 bg-slate-200 border border-slate-200/25 hover:bg-slate-200/30"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={l.src}
                          alt={l.alt}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    ))}
                    {entry.badges?.map((b) => (
                      <span
                        key={b}
                        className="text-[13px] font-medium px-3 py-1.5 rounded-full bg-white/8 border border-white/12 text-slate-300 hover:bg-white/14 hover:text-white transition-all"
                      >
                        {b}
                      </span>
                    ))}
                    </div>
                  </div>
                );
              })()}

              {/* Responsibilities — desktop only */}
              {m.responsibilities && m.responsibilities.length > 0 ? (
                <div className="hidden lg:flex relative z-10 mt-3 w-full flex-col gap-1.5">
                  {m.responsibilities.map((r) => (
                    <div key={r} className="flex items-center gap-2 text-left">
                      <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor} shrink-0`} />
                      <span className="text-xs text-slate-400">{r}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Bio hover tooltip — from Career Highlights divider down */}
              <div
                className={`hidden lg:flex flex-col absolute left-0 right-0 bottom-0 z-20 px-5 pb-5 pt-4 pointer-events-none translate-y-1 transition-all duration-150 rounded-b-2xl border-t border-black/8 dark:border-white/8 bg-white/95 dark:bg-[#0d1117] backdrop-blur-sm overflow-hidden
                  opacity-0 group-hover:opacity-100 group-hover:translate-y-0`}
                style={{ top: 'var(--tooltip-top, 60%)' }}
              >
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-md mb-2 self-start shrink-0 ${theme.badge}`}>
                  About
                </span>
                <p className="text-[0.8rem] text-slate-700 dark:text-slate-200 leading-relaxed overflow-y-auto flex-1 flex items-center justify-center text-center">
                  {m.bio}
                </p>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom-sheet detail modal — only mounts on compact (< lg) via wrapper class */}
      <AnimatePresence>
        {openMember && openTheme ? (
          <MemberSheet
            key={openMember.name}
            member={openMember}
            entry={openEntry}
            theme={openTheme}
            onClose={close}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}
