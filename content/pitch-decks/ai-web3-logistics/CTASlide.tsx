"use client";

import React, { useState, useRef } from "react";
import {
  Rocket,
  Mail,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Globe,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useContent } from "./useContent";

// ─── Particle Field ──────────────────────────────────────────────
function ParticleField() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ opacity: [0, 0.4, 0], y: [0, -30, -60] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

// ─── Email Form ──────────────────────────────────────────────────
function ContactForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const t = useContent().slide10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.5 }}
    >
      {/* <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-white/4 border border-white/10 backdrop-blur-sm"
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Mail className="w-4 h-4 text-slate-500 ml-2 shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none min-w-0"
              required
            />
            <button
              type="submit"
              className="shrink-0 px-4 py-2 rounded-lg text-xs font-bold text-white
                bg-linear-to-r from-cyan-500 to-violet-500
                hover:from-cyan-400 hover:to-violet-400
                transition-all duration-300 flex items-center gap-1.5"
            >
              {t.emailButton}
              <ArrowRight className="w-3 h-3" />
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">
              {t.emailSuccess}
            </span>
          </motion.div>
        )}
      </AnimatePresence> */}

      <p className="text-[9px] text-slate-600 text-center mt-2 font-mono">
        {t.emailDisclaimer}
      </p>
    </motion.div>
  );
}

// ─── Key Stats Bar ───────────────────────────────────────────────
function StatsBar() {
  const t = useContent().slide10;
  const stats = t.stats;

  return (
    <motion.div
      className="flex flex-wrap justify-center gap-3 md:gap-6 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      {stats.map((s, i) => (
        <motion.div
          key={i}
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.1 }}
        >
          <div className="text-base md:text-lg lg:text-xl font-black text-white font-mono">{s.value}</div>
          <div className="text-[8px] md:text-[9px] text-slate-500 font-mono tracking-wider">{s.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Main CTA Slide ──────────────────────────────────────────────
export function CTASlide() {
  const t = useContent().slide10;
  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden bg-[#020617]">
      {/* Background */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 60%, rgba(56,189,248,0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 40%, rgba(167,139,250,0.04) 0%, transparent 50%), #020617"
      }} />
      <ParticleField />

      {/* Converging lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 600" preserveAspectRatio="none">
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={i * 90} y1="0" x2="500" y2="300" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={`b-${i}`} x1={i * 90} y1="600" x2="500" y2="300" stroke="currentColor" strokeWidth="0.5" className="text-violet-400" />
        ))}
      </svg>

      <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 w-full text-center">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 mb-4 md:mb-5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span className="text-[9px] md:text-xs font-mono tracking-[0.2em] uppercase text-cyan-400/90">
            {t.badge}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-tight mb-3 md:mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {t.title}{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-violet-400 to-amber-400">
            {t.titleHighlight}
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          className="text-xs md:text-sm lg:text-base text-slate-400 leading-relaxed max-w-xl mx-auto mb-6 md:mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          {t.subtitle}
        </motion.p>

        {/* Stats */}
        <StatsBar />

        {/* CTA Button */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <motion.a
            href="mailto:contact@motaiot.com"
            className="inline-flex items-center justify-center gap-2.5 w-full max-w-md mx-auto
              px-6 py-3.5 rounded-xl text-sm md:text-base font-bold text-white
              bg-linear-to-r from-cyan-500 via-violet-500 to-cyan-500
              bg-size-[200%_100%] hover:bg-right
              shadow-[0_0_30px_rgba(56,189,248,0.15)]
              transition-all duration-700"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Rocket className="w-4 h-4" />
            {t.ctaButton}
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>

        {/* Email form */}
        <ContactForm />

        {/* Bottom links */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {t.links.map((link: { label: string; href: string }) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] md:text-xs text-slate-500 hover:text-cyan-400 transition-colors font-mono"
            >
              <ExternalLink className="w-3 h-3" />
              {link.label}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-cyan-500/40 to-transparent" />
    </div>
  );
}
