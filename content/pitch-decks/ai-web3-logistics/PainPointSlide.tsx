"use client";

import React, { useState, useRef } from "react";
import {
  AlertTriangle,
  Puzzle,
  DollarSign,
  Languages,
  FileWarning,
  GraduationCap,
  TrendingUp,
  Clock,
  EyeOff,
  ShieldAlert,
  CircleAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileDetailModal, MobileExpandButton } from "./MobileDetailModal";
import { useContent } from "./useContent";

// ─── Glitch Text ─────────────────────────────────────────────────
function GlitchText({ text }: { text: string }) {
  return (
    <motion.span
      className="relative inline-block"
      animate={{
        x: [0, -1, 2, -1, 0],
        textShadow: [
          "0 0 0 transparent",
          "-2px 0 #ef4444, 2px 0 #f97316",
          "0 0 0 transparent",
          "2px 0 #ef4444, -2px 0 #f97316",
          "0 0 0 transparent",
        ],
      }}
      transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
    >
      {text}
    </motion.span>
  );
}

// ─── Floating Fragment (scattered background pieces) ─────────────
function FloatingFragments() {
  const fragments = [
    { x: "8%", y: "12%", size: 40, rotate: 15, delay: 0, opacity: 0.04 },
    { x: "82%", y: "8%", size: 55, rotate: -22, delay: 0.3, opacity: 0.03 },
    { x: "5%", y: "75%", size: 35, rotate: 30, delay: 0.7, opacity: 0.05 },
    { x: "90%", y: "70%", size: 45, rotate: -10, delay: 1.0, opacity: 0.03 },
    { x: "45%", y: "5%", size: 30, rotate: 45, delay: 0.5, opacity: 0.04 },
    { x: "70%", y: "85%", size: 50, rotate: -35, delay: 0.8, opacity: 0.03 },
    { x: "25%", y: "90%", size: 38, rotate: 20, delay: 1.2, opacity: 0.04 },
    { x: "60%", y: "15%", size: 28, rotate: -50, delay: 0.2, opacity: 0.05 },
  ];

  return (
    <>
      {fragments.map((f, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: f.x,
            top: f.y,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            rotate: f.rotate,
          }}
          animate={{
            y: [0, -8, 0, 6, 0],
            rotate: [f.rotate, f.rotate + 5, f.rotate - 3, f.rotate],
            opacity: [f.opacity, f.opacity * 1.5, f.opacity],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: f.delay,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-full h-full border border-red-500/30 rounded-lg"
            style={{
              background: "linear-gradient(135deg, rgba(239,68,68,0.06), transparent)",
              borderStyle: i % 2 === 0 ? "dashed" : "solid",
            }}
          />
        </motion.div>
      ))}
    </>
  );
}

// ─── Scattered Pain Card ─────────────────────────────────────────
interface ScatteredPainCardProps {
  icon: React.ReactNode;
  title: string;
  stat: string;
  description: string;
  details?: string[];
  delay: number;
  criticalLabel: string;
  rotation: number;
  accentColor: string;
  accentGlow: string;
  visualOverlay?: React.ReactNode;
  popupBelow?: boolean;
}

function ScatteredPainCard({
  icon,
  title,
  stat,
  description,
  details,
  delay,
  criticalLabel,
  rotation,
  accentColor,
  accentGlow,
  visualOverlay,
  popupBelow = false,
}: ScatteredPainCardProps) {
  const [hovered, setHovered] = useState(false);
  const [zIndexHigh, setZIndexHigh] = useState(false);
  const timerRef = useRef<any>(null);

  return (
    <motion.div
      className={`relative flex flex-col items-center p-4 lg:p-5 rounded-2xl border border-dashed bg-slate-800/40 backdrop-blur-sm group hover:border-opacity-70 transition-all duration-500 cursor-default overflow-visible ${
        zIndexHigh ? "z-50" : "z-0"
      }`}
      style={{
        borderColor: accentColor,
        rotate: `${rotation}deg`,
      }}
      initial={{ opacity: 0, scale: 0.7, y: 30, rotate: rotation * 2 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: rotation }}
      transition={{ delay, duration: 0.7, ease: "easeOut" }}
      whileHover={{
        scale: 1.06,
        rotate: 0,
        transition: { duration: 0.3 },
      }}
      onMouseEnter={() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setHovered(true);
        setZIndexHigh(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        timerRef.current = setTimeout(() => setZIndexHigh(false), 300);
      }}
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]" />

      {/* Glow */}
      <div
        className="absolute -inset-1 rounded-2xl blur-xl pointer-events-none opacity-20"
        style={{ background: accentGlow }}
      />

      {/* Visual overlay specific to each pain */}
      {visualOverlay}

      {/* Icon */}
      <div className="relative mb-2">
        <div
          className="p-2.5 rounded-xl border"
          style={{
            borderColor: accentColor,
            background: `${accentColor}15`,
          }}
        >
          <div style={{ color: accentColor }}>{icon}</div>
        </div>
        <motion.div
          className="absolute -inset-1 rounded-xl border"
          style={{ borderColor: accentColor }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: delay + 0.3 }}
        />
      </div>

      {/* Stat */}
      <motion.div
        className="text-lg lg:text-xl font-black font-mono mb-0.5"
        style={{ color: accentColor }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.3 }}
      >
        {stat}
      </motion.div>

      {/* Title */}
      <h3 className="text-xs lg:text-sm font-bold text-slate-200 mb-1 tracking-wide text-center leading-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[9px] lg:text-[10px] text-slate-400/80 text-center leading-relaxed">
        {description}
      </p>

      {/* Error badge */}
      <motion.div
        className="flex items-center gap-1.5 px-2 py-0.5 mt-2 rounded-full text-[8px] lg:text-[9px] font-mono font-bold tracking-wider uppercase border"
        style={{
          borderColor: accentColor,
          background: `${accentColor}12`,
          color: accentColor,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.6, duration: 0.4 }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: accentColor }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        {criticalLabel}
      </motion.div>

      {/* Hover detail popup */}
      <AnimatePresence>
        {hovered && details && details.length > 0 && (
          <motion.div
            className={`absolute left-1/2 z-50 w-80 lg:w-96 ${
              popupBelow ? "top-full mt-3" : "bottom-full mb-3"
            }`}
            style={{ transform: "translateX(-50%)" }}
            initial={{ opacity: 0, y: popupBelow ? -8 : 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: popupBelow ? -8 : 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Arrow (top — when popup is below card) */}
            {popupBelow && (
              <div
                className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3.5 h-3.5 rotate-45"
                style={{
                  background: "rgba(2,6,23,0.92)",
                  borderLeft: `1px solid ${accentColor}`,
                  borderTop: `1px solid ${accentColor}`,
                }}
              />
            )}
            <div
              className="rounded-xl border p-4 backdrop-blur-xl shadow-2xl"
              style={{
                borderColor: accentColor,
                background: "rgba(2,6,23,0.92)",
                boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${accentColor}`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <CircleAlert className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                <span className="text-sm font-mono font-bold tracking-wider uppercase" style={{ color: accentColor }}>
                  {title}
                </span>
              </div>
              <ul className="space-y-2">
                {details.map((d, i) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-2.5 text-sm lg:text-base text-slate-300 leading-relaxed"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                  >
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: accentColor }}
                    />
                    {d}
                  </motion.li>
                ))}
              </ul>
            </div>
            {/* Arrow (bottom — when popup is above card) */}
            {!popupBelow && (
              <div
                className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3.5 h-3.5 rotate-45"
                style={{
                  background: "rgba(2,6,23,0.92)",
                  borderRight: `1px solid ${accentColor}`,
                  borderBottom: `1px solid ${accentColor}`,
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Fee Bar Visual (for the pricing card) ───────────────────────
function FeeBarOverlay() {
  return (
    <div className="absolute top-2 right-2 flex flex-col gap-0.5 opacity-20 pointer-events-none">
      {[85, 60, 95, 45, 75].map((w, i) => (
        <motion.div
          key={i}
          className="h-1 rounded-full bg-orange-400"
          style={{ width: w * 0.3 }}
          animate={{ opacity: [0.3, 0.8, 0.3], width: [w * 0.3, w * 0.4, w * 0.3] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

// ─── Clock Overlay (for timezone card) ───────────────────────────
function TimezoneOverlay() {
  return (
    <div className="absolute top-2 left-2 opacity-15 pointer-events-none">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <Clock className="w-8 h-8 text-yellow-400" />
      </motion.div>
    </div>
  );
}

// ─── Document Stack Overlay ──────────────────────────────────────
function DocStackOverlay() {
  return (
    <div className="absolute bottom-2 right-2 opacity-15 pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-6 h-8 border border-purple-400 rounded-sm bg-purple-400/5 absolute"
          style={{
            bottom: i * 3,
            right: i * 4,
            rotate: `${-5 + i * 4}deg`,
          }}
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export function PainPointSlide() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useContent().slide2;

  const painPoints = [
    {
      icon: <Puzzle className="w-5 h-5 lg:w-6 lg:h-6" />,
      title: t.painPoints[0].title,
      stat: t.painPoints[0].stat,
      description: t.painPoints[0].description,
      details: t.painPoints[0].details,
      rotation: -3,
      accentColor: "rgba(239,68,68,0.6)",
      accentGlow: "radial-gradient(circle, rgba(239,68,68,0.15), transparent 70%)",
    },
    {
      icon: <DollarSign className="w-5 h-5 lg:w-6 lg:h-6" />,
      title: t.painPoints[1].title,
      stat: t.painPoints[1].stat,
      description: t.painPoints[1].description,
      details: t.painPoints[1].details,
      rotation: 2,
      accentColor: "rgba(251,146,60,0.7)",
      accentGlow: "radial-gradient(circle, rgba(251,146,60,0.15), transparent 70%)",
      visualOverlay: <FeeBarOverlay />,
    },
    {
      icon: <Languages className="w-5 h-5 lg:w-6 lg:h-6" />,
      title: t.painPoints[2].title,
      stat: t.painPoints[2].stat,
      description: t.painPoints[2].description,
      details: t.painPoints[2].details,
      rotation: -2,
      accentColor: "rgba(250,204,21,0.6)",
      accentGlow: "radial-gradient(circle, rgba(250,204,21,0.12), transparent 70%)",
      visualOverlay: <TimezoneOverlay />,
    },
    {
      icon: <FileWarning className="w-5 h-5 lg:w-6 lg:h-6" />,
      title: t.painPoints[3].title,
      stat: t.painPoints[3].stat,
      description: t.painPoints[3].description,
      details: t.painPoints[3].details,
      rotation: 3,
      accentColor: "rgba(192,132,252,0.6)",
      accentGlow: "radial-gradient(circle, rgba(192,132,252,0.12), transparent 70%)",
      visualOverlay: <DocStackOverlay />,
    },
    {
      icon: <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6" />,
      title: t.painPoints[4].title,
      stat: t.painPoints[4].stat,
      description: t.painPoints[4].description,
      details: t.painPoints[4].details,
      rotation: -1,
      accentColor: "rgba(248,113,113,0.6)",
      accentGlow: "radial-gradient(circle, rgba(248,113,113,0.12), transparent 70%)",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden bg-[#020617]">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, #1a0a0a 0%, #020617 70%)" }} />

      {/* Cracked / fragmented grid — irregular, scattered feel */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(239,68,68,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.2) 1px, transparent 1px), linear-gradient(45deg, rgba(239,68,68,0.08) 1px, transparent 1px)",
          backgroundSize: "60px 60px, 80px 80px, 40px 40px",
        }}
      />

      {/* Floating scattered fragments */}
      <FloatingFragments />

      {/* Multiple scattered glow spots */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-900/8 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-orange-900/6 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-purple-900/5 blur-[90px] rounded-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-4 md:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full border border-red-500/25 bg-red-500/8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span className="text-[9px] md:text-xs font-mono tracking-[0.2em] uppercase text-red-400/90">
              {t.badge}
            </span>
          </motion.div>

          <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t.title}{" "}
            <span className="text-red-400">
              <GlitchText text={t.titleHighlight} />
            </span>
          </h2>

          <motion.p
            className="mt-1.5 text-[10px] md:text-sm lg:text-base text-slate-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {t.subtitle}
          </motion.p>
        </motion.div>

        {/* ── Scattered Bento Grid (desktop) ── */}
        <div className="hidden md:grid grid-cols-5 grid-rows-2 gap-3 lg:gap-4 max-w-5xl mx-auto">
          {/* Row 1: popup goes BELOW (toward center) */}
          <div className="col-span-2">
            <ScatteredPainCard
              {...painPoints[0]}
              criticalLabel={t.criticalFriction}
              delay={0.3}
              popupBelow
            />
          </div>
          <div className="col-span-1 mt-4">
            <ScatteredPainCard
              {...painPoints[1]}
              criticalLabel={t.criticalFriction}
              delay={0.5}
              popupBelow
            />
          </div>
          <div className="col-span-2 -mt-2">
            <ScatteredPainCard
              {...painPoints[2]}
              criticalLabel={t.criticalFriction}
              delay={0.7}
              popupBelow
            />
          </div>

          {/* Row 2: popup goes UP (toward center) */}
          <div className="col-span-2 col-start-1 ml-8 -mt-2">
            <ScatteredPainCard
              {...painPoints[3]}
              criticalLabel={t.criticalFriction}
              delay={0.9}
            />
          </div>
          <div className="col-span-2 col-start-4 -ml-4 mt-1">
            <ScatteredPainCard
              {...painPoints[4]}
              criticalLabel={t.criticalFriction}
              delay={1.1}
            />
          </div>
        </div>

        {/* ── Connecting broken lines between cards ── */}
        <motion.div
          className="hidden md:block absolute inset-0 pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <svg className="absolute inset-0 w-full h-full" fill="none">
            <motion.line
              x1="25%" y1="40%" x2="45%" y2="38%"
              stroke="rgba(239,68,68,0.12)"
              strokeWidth="1"
              strokeDasharray="4 6"
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.line
              x1="55%" y1="35%" x2="75%" y2="38%"
              stroke="rgba(251,146,60,0.1)"
              strokeWidth="1"
              strokeDasharray="3 8"
              animate={{ strokeDashoffset: [0, -22] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <motion.line
              x1="30%" y1="55%" x2="65%" y2="58%"
              stroke="rgba(192,132,252,0.08)"
              strokeWidth="1"
              strokeDasharray="5 7"
              animate={{ strokeDashoffset: [0, -24] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </motion.div>

        {/* Mobile: stacked with first card visible + expand */}
        <div className="md:hidden flex flex-col items-center gap-4">
          <ScatteredPainCard
            {...painPoints[0]}
            rotation={0}
            criticalLabel={t.criticalFriction}
            delay={0.4}
          />
          <MobileExpandButton label={t.mobileLabel} onClick={() => setMobileOpen(true)} />
        </div>

        {/* Bottom warning strip */}
        <motion.div
          className="hidden md:flex items-center justify-center mt-6 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            className="flex items-center gap-3"
            animate={{
              opacity: [1, 0.3, 1],
              textShadow: [
                "0 0 0px rgba(239,68,68,0)",
                "0 0 12px rgba(239,68,68,0.6)",
                "0 0 0px rgba(239,68,68,0)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span className="text-xs lg:text-sm font-mono font-bold text-red-400 tracking-wider uppercase">
              {t.warningStrip}
            </span>
            <motion.span
              className="inline-block w-2 h-2 rounded-full bg-red-500"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Mobile modal */}
      <MobileDetailModal open={mobileOpen} onClose={() => setMobileOpen(false)} title={t.mobileTitle} subtitle={t.mobileSubtitle}>
        <div className="space-y-4">
          {painPoints.map((p, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/5 border border-red-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div style={{ color: p.accentColor }}>{p.icon}</div>
                <span className="text-sm font-bold text-white">{p.title}</span>
                <span className="font-mono text-xs ml-auto" style={{ color: p.accentColor }}>{p.stat}</span>
              </div>
              <p className="text-xs text-slate-400">{p.description}</p>
            </div>
          ))}
        </div>
      </MobileDetailModal>
    </div>
  );
}
