"use client";

import React from "react";
import { motion } from "framer-motion";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import {
  ArrowRight,
  Mail,
  Lock,
  Zap,
} from "lucide-react";

// ─── Ambient Particle Field ─────────────────────────────────────
function ParticleField() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 8,
    duration: 6 + Math.random() * 8,
    size: 1 + Math.random() * 2,
    opacity: 0.1 + Math.random() * 0.3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: 0,
          }}
          animate={{
            y: ["100vh", "-10vh"],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ─── Monolith SVG ───────────────────────────────────────────────
function Monolith() {
  return (
    <div className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 400 500"
        className="w-full max-w-3xl h-auto opacity-[0.06]"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="ei-monolith-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(56,189,248,0.8)" />
            <stop offset="50%" stopColor="rgba(59,130,246,0.4)" />
            <stop offset="100%" stopColor="rgba(15,23,42,0)" />
          </linearGradient>
          <linearGradient id="ei-stream-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(34,211,238,0.6)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </linearGradient>
        </defs>

        <path
          d="M 160 30 L 240 30 L 250 500 L 150 500 Z"
          fill="url(#ei-monolith-grad)"
        />
        <path
          d="M 150 200 L 80 500 L 150 500 Z"
          fill="rgba(56,189,248,0.15)"
        />
        <path
          d="M 250 200 L 320 500 L 250 500 Z"
          fill="rgba(56,189,248,0.15)"
        />

        {[170, 185, 200, 215, 230].map((x, i) => (
          <motion.line
            key={i}
            x1={x}
            y1={40 + i * 15}
            x2={x + (i % 2 === 0 ? -5 : 5)}
            y2={500}
            stroke="url(#ei-stream-grad)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{
              duration: 3,
              delay: 1 + i * 0.3,
              ease: "easeOut",
            }}
          />
        ))}

        <motion.circle
          cx="200"
          cy="30"
          r="3"
          fill="rgba(34,211,238,0.8)"
          animate={{ r: [3, 6, 3], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}

// ─── Horizon Line ───────────────────────────────────────────────
function HorizonLine() {
  return (
    <div className="absolute bottom-[15%] left-0 right-0 pointer-events-none">
      <motion.div
        className="w-full h-px bg-linear-to-r from-transparent via-cyan-500/20 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
      />
      <motion.div
        className="w-full h-16 bg-linear-to-b from-cyan-500/5 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
      />
    </div>
  );
}

// ─── Wireframe Ships ────────────────────────────────────────────
function WireframeVessels() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.svg
        viewBox="0 0 120 40"
        className="absolute bottom-[14%] left-[8%] w-20 lg:w-28 opacity-[0.08]"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 0.08, x: 0 }}
        transition={{ duration: 3, delay: 2 }}
      >
        <path
          d="M 5 30 L 15 15 L 105 15 L 115 30 Z"
          fill="none"
          stroke="rgba(34,211,238,0.6)"
          strokeWidth="0.8"
          strokeDasharray="3 2"
        />
        <rect x="30" y="8" width="12" height="7" fill="none" stroke="rgba(34,211,238,0.4)" strokeWidth="0.5" />
        <rect x="50" y="5" width="15" height="10" fill="none" stroke="rgba(34,211,238,0.4)" strokeWidth="0.5" />
        <rect x="75" y="8" width="12" height="7" fill="none" stroke="rgba(34,211,238,0.4)" strokeWidth="0.5" />
      </motion.svg>

      <motion.svg
        viewBox="0 0 80 30"
        className="absolute top-[25%] right-[10%] w-14 lg:w-20 opacity-[0.06]"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 0.06, x: 0 }}
        transition={{ duration: 3, delay: 2.5 }}
      >
        <path
          d="M 5 15 L 30 8 L 70 12 L 75 15 L 70 18 L 30 22 Z"
          fill="none"
          stroke="rgba(34,211,238,0.5)"
          strokeWidth="0.6"
          strokeDasharray="2 2"
        />
        <line x1="25" y1="15" x2="15" y2="5" stroke="rgba(34,211,238,0.3)" strokeWidth="0.5" />
        <line x1="25" y1="15" x2="15" y2="25" stroke="rgba(34,211,238,0.3)" strokeWidth="0.5" />
      </motion.svg>
    </div>
  );
}

// ─── Volumetric Fog Layers ──────────────────────────────────────
function FogLayers() {
  return (
    <>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none hidden dark:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
      <motion.div
        className="absolute top-0 left-0 right-0 h-1/4 bg-linear-to-b from-slate-950/60 to-transparent pointer-events-none hidden dark:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
    </>
  );
}

// ─── Main CTA Section ───────────────────────────────────────────
export function CTASection() {
  const content = useContent();
  const c = content.slide10;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-[#f0f4f8] dark:bg-linear-to-b dark:from-[#030712] dark:via-[#0a1628] dark:to-[#030712] text-white relative overflow-hidden">
      {/* Deep background layers */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-linear-to-b dark:from-slate-950 dark:via-[#071020] dark:to-[#020617]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(56,189,248,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Central glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] lg:w-[700px] lg:h-[700px] bg-blue-600/[0.08] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 lg:w-96 lg:h-96 bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Side accent glows */}
      <div className="absolute top-1/2 left-0 w-48 h-96 bg-blue-900/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-48 h-96 bg-indigo-900/10 blur-[80px] rounded-full pointer-events-none" />

      {/* Atmospheric elements */}
      <Monolith />
      <HorizonLine />
      <WireframeVessels />
      <ParticleField />
      <FogLayers />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 text-center flex flex-col items-center justify-center">

        {/* Badge */}
        <motion.div
          className="ei-child inline-flex items-center gap-2 mb-4 md:mb-6 px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-blue-500/25 bg-blue-500/[0.08]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] md:text-sm font-mono tracking-[0.2em] uppercase text-blue-400/90">
            {c.badge}
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h2
          className="ei-child text-2xl md:text-4xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white mb-4 md:mb-6 leading-[1.15]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {c.headline.prefix}{" "}
          <span className="text-white/30 line-through decoration-red-500/50">
            {c.headline.strikethrough}
          </span>
          .
          <br />
          <span>{c.headline.only} </span>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-300">
            {c.headline.architects}
          </span>{" "}
          {c.headline.and}{" "}
          <span className="text-red-500/80">{c.headline.obsolete}</span>.
        </motion.h2>

        {/* Two-column logic blocks */}
        <div className="ei-child grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left w-full max-w-4xl 2xl:max-w-6xl mb-6 md:mb-10 mt-2 md:mt-6">
          <motion.div
            className="border-l-2 border-blue-500/40 pl-4 md:pl-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <h3 className="text-sm md:text-lg lg:text-xl font-bold text-white mb-1 md:mb-2">
              {c.leftBlock.heading}
            </h3>
            <p className="text-[10px] md:text-sm lg:text-base text-slate-400 leading-relaxed">
              {c.leftBlock.text1}{" "}
              <strong className="text-white/80">{c.leftBlock.bold1}</strong>{" "}
              {c.leftBlock.text2}{" "}
              <strong className="text-blue-300/80">{c.leftBlock.bold2}</strong>{" "}
              {c.leftBlock.text3}
            </p>
          </motion.div>

          <motion.div
            className="border-l-2 border-cyan-500/40 pl-4 md:pl-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <h3 className="text-sm md:text-lg lg:text-xl font-bold text-white mb-1 md:mb-2">
              {c.rightBlock.heading}
            </h3>
            <p className="text-[10px] md:text-sm lg:text-base text-slate-400 leading-relaxed">
              {c.rightBlock.text1}{" "}
              <strong className="text-cyan-300/80">{c.rightBlock.bold1}</strong>
              {c.rightBlock.text2}
            </p>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          className="ei-child flex flex-col items-center gap-4 md:gap-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <motion.a
            href="/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-6 md:px-8 py-3 md:py-3.5 bg-white text-slate-950 font-bold rounded-xl text-sm md:text-base overflow-hidden transition-all inline-block"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              boxShadow:
                "0 0 30px rgba(59,130,246,0.15), 0 0 60px rgba(59,130,246,0.08)",
            }}
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-blue-200/30 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "200%" }}
              transition={{ duration: 0.8 }}
            />
            <span className="relative flex items-center gap-2">
              {c.cta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </motion.a>

          {/* Contact info */}
          <motion.div
            className="flex items-center justify-center gap-3 md:gap-5 text-[10px] md:text-sm font-mono text-slate-500 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <span className="flex items-center gap-1.5 hover:text-blue-400/70 transition-colors cursor-pointer">
              <Mail className="w-3 h-3" />
              {c.email}
            </span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <a
              href="https://atom.motaiot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium tracking-wider text-blue-500 hover:text-blue-400 transition-colors"
            >
              <span className="text-[10px] font-bold">◆</span>
              {c.brand}
            </a>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <span className="flex items-center gap-1.5 text-slate-600">
              <Lock className="w-3 h-3" />
              {c.confidential}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
