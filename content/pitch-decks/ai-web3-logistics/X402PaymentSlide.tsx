"use client";

import React, { useState } from "react";
import {
  Zap,
  Coins,
  Globe,
  Code2,
  Eye,
  Clock,
  Bot,
  Sparkles,
  X,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileDetailModal, MobileExpandButton } from "./MobileDetailModal";
import { useContent } from "./useContent";

// ─── Color palette for advantage cards ───────────────────────────
const cardStyles = [
  { icon: Zap, gradient: "from-amber-500 to-orange-500", bg: "bg-amber-500/10", border: "border-amber-500/25", text: "text-amber-400", glow: "rgba(245,158,11,0.15)" },
  { icon: Coins, gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-500/10", border: "border-emerald-500/25", text: "text-emerald-400", glow: "rgba(16,185,129,0.15)" },
  { icon: Globe, gradient: "from-cyan-500 to-blue-500", bg: "bg-cyan-500/10", border: "border-cyan-500/25", text: "text-cyan-400", glow: "rgba(6,182,212,0.15)" },
  { icon: Code2, gradient: "from-violet-500 to-purple-500", bg: "bg-violet-500/10", border: "border-violet-500/25", text: "text-violet-400", glow: "rgba(139,92,246,0.15)" },
  { icon: Eye, gradient: "from-pink-500 to-rose-500", bg: "bg-pink-500/10", border: "border-pink-500/25", text: "text-pink-400", glow: "rgba(236,72,153,0.15)" },
  { icon: Clock, gradient: "from-sky-500 to-indigo-500", bg: "bg-sky-500/10", border: "border-sky-500/25", text: "text-sky-400", glow: "rgba(14,165,233,0.15)" },
  { icon: Bot, gradient: "from-lime-500 to-emerald-500", bg: "bg-lime-500/10", border: "border-lime-500/25", text: "text-lime-400", glow: "rgba(132,204,22,0.15)" },
];

// ─── Detail Popup ────────────────────────────────────────────────
function DetailPopup({
  open,
  onClose,
  title,
  detail,
  colorIdx,
  closeLabel,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  detail: string;
  colorIdx: number;
  closeLabel: string;
}) {
  const style = cardStyles[colorIdx] ?? cardStyles[0];
  const Icon = style.icon;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative max-w-md w-full rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl p-6 shadow-2xl"
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${style.bg} ${style.border} border flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${style.text}`} />
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{detail}</p>
            <button
              onClick={onClose}
              className={`mt-5 w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r ${style.gradient} hover:opacity-90 transition-opacity`}
            >
              {closeLabel}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Advantage Card ──────────────────────────────────────────────
function AdvantageCard({
  title,
  brief,
  detail,
  index,
  learnMore,
  closeLabel,
}: {
  title: string;
  brief: string;
  detail: string;
  index: number;
  learnMore: string;
  closeLabel: string;
}) {
  const [popupOpen, setPopupOpen] = useState(false);
  const style = cardStyles[index] ?? cardStyles[0];
  const Icon = style.icon;

  return (
    <>
      <motion.div
        className={`group relative p-3 lg:p-4 rounded-xl border ${style.border} ${style.bg} cursor-pointer overflow-hidden`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 + index * 0.08, type: "spring", damping: 20 }}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setPopupOpen(true)}
        style={{ boxShadow: `0 0 30px ${style.glow}` }}
      >
        {/* Animated glow on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"
          style={{ background: `radial-gradient(circle at 50% 50%, ${style.glow}, transparent 70%)` }}
        />

        <div className="relative flex items-center gap-3">
          <div className={`shrink-0 w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-linear-to-br ${style.gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm lg:text-base font-bold text-white truncate">{title}</h4>
            <p className={`text-lg lg:text-xl font-black font-mono ${style.text}`}>{brief}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0" />
        </div>
      </motion.div>

      <DetailPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        title={title}
        detail={detail}
        colorIdx={index}
        closeLabel={closeLabel}
      />
    </>
  );
}

// ─── X402 Highlight ──────────────────────────────────────────────
function X402Highlight({
  title,
  brief,
  detail,
  learnMore,
  closeLabel,
}: {
  title: string;
  brief: string;
  detail: string;
  learnMore: string;
  closeLabel: string;
}) {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <>
      <motion.div
        className="relative p-4 lg:p-5 rounded-xl border border-amber-500/20 bg-linear-to-r from-amber-500/5 via-violet-500/5 to-cyan-500/5 cursor-pointer overflow-hidden"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, type: "spring", damping: 20 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setPopupOpen(true)}
      >
        {/* Animated shimmer */}
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/3 to-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ width: "50%" }}
        />

        <div className="relative flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-linear-to-br from-amber-500 via-violet-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-base lg:text-lg font-bold text-white">{title}</h4>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-bold uppercase tracking-wider">
                Protocol
              </span>
            </div>
            <p className="text-sm text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-violet-400 to-cyan-400 font-semibold">
              {brief}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500 shrink-0" />
        </div>

        {/* Animated bottom border */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-amber-500 via-violet-500 to-cyan-500"
          animate={{ width: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <DetailPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        title={title}
        detail={detail}
        colorIdx={0}
        closeLabel={closeLabel}
      />
    </>
  );
}

// ─── Floating Particles ──────────────────────────────────────────
function FloatingParticles() {
  const colors = ["bg-amber-400", "bg-emerald-400", "bg-cyan-400", "bg-violet-400", "bg-pink-400", "bg-sky-400"];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full ${color} opacity-30`}
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export function X402PaymentSlide() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useContent().slide5;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden bg-[#020617]">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 30%, #0c1a2e 0%, #020617 60%), radial-gradient(ellipse at 70% 70%, #1a0c2e 0%, transparent 50%)" }} />
      <FloatingParticles />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-4 md:mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Coins className="w-3 h-3 text-emerald-400" />
            <span className="text-[9px] md:text-xs font-mono tracking-[0.2em] uppercase text-emerald-400/90">
              {t.badge}
            </span>
          </motion.div>

          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t.title}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-cyan-400 to-violet-400">
              {t.titleHighlight}
            </span>
          </h2>

          <motion.p
            className="mt-2 text-xs md:text-sm text-slate-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t.subtitle}
          </motion.p>
        </motion.div>

        {/* Desktop: top row 4 + bottom row 3 centered + X402 bar */}
        <div className="hidden md:block space-y-3 lg:space-y-4">
          <div className="grid grid-cols-4 gap-3 lg:gap-4">
            {t.advantages
              .slice(0, 4)
              .map(
                (adv: { title: string; brief: string; detail: string }, i: number) => (
                  <AdvantageCard
                    key={i}
                    title={adv.title}
                    brief={adv.brief}
                    detail={adv.detail}
                    index={i}
                    learnMore={t.learnMore}
                    closeLabel={t.close}
                  />
                ),
              )}
          </div>
          <div className="grid grid-cols-3 gap-3 lg:gap-4 max-w-[75%] mx-auto">
            {t.advantages
              .slice(4)
              .map(
                (adv: { title: string; brief: string; detail: string }, i: number) => (
                  <AdvantageCard
                    key={i + 4}
                    title={adv.title}
                    brief={adv.brief}
                    detail={adv.detail}
                    index={i + 4}
                    learnMore={t.learnMore}
                    closeLabel={t.close}
                  />
                ),
              )}
          </div>
          <X402Highlight
            title={t.x402.title}
            brief={t.x402.brief}
            detail={t.x402.detail}
            learnMore={t.learnMore}
            closeLabel={t.close}
          />
        </div>

        {/* Mobile: 2 col grid + expand */}
        <div className="md:hidden space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {t.advantages
              .slice(0, 4)
              .map(
                (adv: { title: string; brief: string; detail: string }, i: number) => (
                  <AdvantageCard
                    key={i}
                    title={adv.title}
                    brief={adv.brief}
                    detail={adv.detail}
                    index={i}
                    learnMore={t.learnMore}
                    closeLabel={t.close}
                  />
                ),
              )}
          </div>
          <X402Highlight
            title={t.x402.title}
            brief={t.x402.brief}
            detail={t.x402.detail}
            learnMore={t.learnMore}
            closeLabel={t.close}
          />
          <div className="flex justify-center pt-1">
            <MobileExpandButton label={t.mobileLabel} onClick={() => setMobileOpen(true)} />
          </div>
        </div>
      </div>

      <MobileDetailModal open={mobileOpen} onClose={() => setMobileOpen(false)} title={t.mobileTitle}>
        <div className="space-y-3">
          {t.advantages.map(
            (adv: { title: string; brief: string; detail: string }, i: number) => (
              <AdvantageCard
                key={i}
                title={adv.title}
                brief={adv.brief}
                detail={adv.detail}
                index={i}
                learnMore={t.learnMore}
                closeLabel={t.close}
              />
            ),
          )}
        </div>
      </MobileDetailModal>
    </div>
  );
}
