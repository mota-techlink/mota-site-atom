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
      { src: "/icons/oracle.svg", alt: "Oracle" },
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

              {/* Photo with pulsing ring */}
              <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4">
                {/* Pulse ring (animates on hover) */}
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-emerald-400/0 group-hover:border-emerald-400/60"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
                <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-emerald-500/30 group-hover:ring-emerald-500/70 transition-all">
                  <Image
                    src={m.photo}
                    alt={m.name}
                    fill
                    sizes="(max-width: 768px) 96px, 112px"
                    className="object-cover object-top"
                  />
                </div>
              </div>

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
                        className="h-9 w-9 rounded-xl flex items-center justify-center p-1.5 transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 bg-white border border-black/8 shadow-sm shadow-black/10"
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
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/8 border border-white/12 text-slate-300 hover:bg-white/14 hover:text-white transition-all"
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
