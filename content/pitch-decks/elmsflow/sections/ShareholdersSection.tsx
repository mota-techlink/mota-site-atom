"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
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
        className="relative w-full h-full rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 0 1px rgba(34,211,238,0.3)" }}
        whileHover={{ boxShadow: "0 0 0 1.5px rgba(34,211,238,0.7), 0 4px 24px rgba(34,211,238,0.2)" }}
        transition={{ duration: 0.3 }}
      >
        <Image src={photo} alt={name} fill sizes={sizes} className="object-cover object-top" />
        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent pointer-events-none"
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
        {/* Subtle scan lines */}
        {[25, 50, 75].map((pct) => (
          <motion.div
            key={pct}
            className="absolute left-0 right-0 h-px bg-emerald-400/10 pointer-events-none"
            style={{ top: `${pct}%` }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: pct / 100 }}
          />
        ))}
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

// ─── Main Section ─────────────────────────────────────────────────────────────
export function ShareholdersSection() {
  const content = useContent();
  const c = content.slideShareholders;

  return (
    <section
      className={`${SECTION} bg-[#f0f4f8] dark:bg-[#0a0e15] text-slate-900 dark:text-white relative overflow-hidden`}
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
              opacity: [0, 0.8, 0],
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

        {/* Member grid */}
        <div className="ei-child grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {c.members.map((m, i) => (
            <motion.div
              key={m.name}
              className="group relative bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5 md:p-6 flex flex-col items-center text-center transition-colors overflow-hidden"
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.55, ease: "easeOut" }}
              whileHover={{
                y: -4,
                boxShadow: "0 0 30px rgba(52,211,153,0.18)",
                borderColor: "rgba(52,211,153,0.4)",
              }}
            >
              {/* Index badge */}
              <span className="absolute top-3 right-3 text-[10px] font-mono tracking-widest text-emerald-400/40 group-hover:text-emerald-400/70 transition-colors">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Shimmer scan line on hover */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                <motion.div
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent opacity-0 group-hover:opacity-100"
                  initial={{ top: "-10%" }}
                  animate={{ top: "110%" }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>

              {/* Photo frame — per-role design */}
              <PhotoFrame role={m.role} photo={m.photo} name={m.name} />

              {/* Role badge */}
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
                {m.role}
              </span>

              {/* Name */}
              <h3 className="text-white font-bold text-base md:text-lg mb-2">
                {m.name}
              </h3>

              {/* Bio */}
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                {m.bio}
              </p>

              {/* Career logos / badges */}
              {(() => {
                const entry = MEMBER_LOGOS[i];
                if (!entry || (!entry.logos?.length && !entry.badges?.length)) return null;
                return (
                  <div className="mt-3 pt-3 border-t border-white/8 w-full flex items-center gap-2 flex-wrap justify-center">
                    {entry.logos?.map((l) => (
                      <div
                        key={l.alt}
                        title={l.alt}
                        className="h-11 w-11 rounded-xl flex items-center justify-center p-2 transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 bg-slate-200/20 border border-slate-200/25 hover:bg-slate-200/30"
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
                );
              })()}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
