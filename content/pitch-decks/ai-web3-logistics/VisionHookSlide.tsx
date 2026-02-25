"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import {
  Bot,
  Brain,
  Globe,
  Wallet,
  Cpu,
  Zap,
  Network,
  Container,
  Ship,
  Truck,
  PackageCheck,
  Factory,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useContent } from "./useContent";

// ─── Mouse Parallax ──────────────────────────────────────────────
function useMouseParallax() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springConfig = { damping: 30, stiffness: 80 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);

  return { springX, springY };
}

// ─── Data Stream Background ─────────────────────────────────────
function DataStreamBackground({
  springX,
  springY,
}: {
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
}) {
  const x = useTransform(springX, [0, 1], [-15, 15]);
  const y = useTransform(springY, [0, 1], [-10, 10]);

  const routes = [
    { d: "M0 180 Q240 150 480 170 Q720 190 960 150", delay: 0 },
    { d: "M0 300 Q200 275 400 290 Q600 305 800 280 Q960 260 960 260", delay: 0.4 },
    { d: "M0 370 Q300 345 600 355 Q800 365 960 335", delay: 0.8 },
    { d: "M0 120 Q240 100 480 110 Q720 125 960 100", delay: 1.2 },
    { d: "M0 430 Q320 410 640 420 Q960 435 960 410", delay: 0.6 },
    { d: "M0 240 Q480 215 960 230", delay: 1.0 },
  ];

  const nodes = [
    { cx: 80, cy: 180, label: "SZX" },
    { cx: 250, cy: 275, label: "KUL" },
    { cx: 420, cy: 170, label: "DXB" },
    { cx: 560, cy: 355, label: "AMS" },
    { cx: 700, cy: 290, label: "LAX" },
    { cx: 880, cy: 150, label: "NRT" },
    { cx: 160, cy: 430, label: "JED" },
    { cx: 640, cy: 110, label: "FRA" },
  ];

  return (
    <motion.div className="absolute inset-0 overflow-hidden" style={{ x, y }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 960 540"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {routes.map((route, i) => (
          <g key={i}>
            <path
              d={route.d}
              stroke="rgba(56,189,248,0.08)"
              strokeWidth="1.5"
              strokeDasharray="6 10"
              fill="none"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-48"
                dur={`${3 + i * 0.2}s`}
                repeatCount="indefinite"
              />
            </path>
            {[0, 0.33, 0.66].map((offset, j) => (
              <circle
                key={j}
                r={1.5 + j * 0.3}
                fill={`rgba(56,189,248,${0.3 + j * 0.1})`}
                filter="url(#nodeGlow)"
              >
                <animateMotion
                  dur={`${4 + i * 0.3}s`}
                  repeatCount="indefinite"
                  begin={`${route.delay + offset * (4 + i * 0.3)}s`}
                >
                  <mpath href={`#stream-route-${i}`} />
                </animateMotion>
              </circle>
            ))}
            <path id={`stream-route-${i}`} d={route.d} fill="none" />
          </g>
        ))}

        {nodes.map((node, i) => (
          <g key={`node-${i}`}>
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r="2"
              fill="rgba(56,189,248,0.3)"
              animate={{ r: [2, 3, 2], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
            />
            <circle
              cx={node.cx}
              cy={node.cy}
              r="8"
              fill="none"
              stroke="rgba(56,189,248,0.08)"
              strokeWidth="0.5"
            />
          </g>
        ))}

        {Array.from({ length: 20 }).map((_, row) =>
          Array.from({ length: 35 }).map((_, col) => (
            <circle
              key={`dot-${row}-${col}`}
              cx={col * 28 + 10}
              cy={row * 28 + 10}
              r="0.5"
              fill="rgba(148,163,184,0.08)"
            />
          ))
        )}
      </svg>
    </motion.div>
  );
}

// ─── Floating Icons (desktop) ────────────────────────────────────
function FloatingIcons({
  springX,
  springY,
}: {
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
}) {
  const icons = [
    { Icon: Bot, x: "12%", y: "18%", size: 18, parallax: 1.5, delay: 0 },
    { Icon: Ship, x: "85%", y: "22%", size: 20, parallax: 2.0, delay: 0.5 },
    { Icon: Globe, x: "8%", y: "72%", size: 22, parallax: 1.8, delay: 1.0 },
    { Icon: Wallet, x: "88%", y: "68%", size: 16, parallax: 1.2, delay: 1.5 },
    { Icon: Container, x: "20%", y: "45%", size: 14, parallax: 2.5, delay: 0.3 },
    { Icon: Network, x: "78%", y: "42%", size: 16, parallax: 1.6, delay: 0.8 },
  ];

  return (
    <>
      {icons.map(({ Icon, x: posX, y: posY, size, parallax, delay }, i) => {
        const moveX = useTransform(springX, [0, 1], [-8 * parallax, 8 * parallax]);
        const moveY = useTransform(springY, [0, 1], [-6 * parallax, 6 * parallax]);

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: posX, top: posY, x: moveX, y: moveY }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.06, 0.12, 0.06],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              opacity: { duration: 5 + i, repeat: Infinity, delay },
              rotate: { duration: 8 + i * 2, repeat: Infinity, delay },
            }}
          >
            <Icon className="text-slate-400" style={{ width: size, height: size }} />
          </motion.div>
        );
      })}
    </>
  );
}

// ─── Flow Connector (electric current effect) ───────────────────
function FlowConnector({ delay }: { delay: number }) {
  return (
    <div className="relative flex-1 min-w-6 md:min-w-10 lg:min-w-15 h-px self-center -mt-4 md:-mt-5">
      {/* Base line */}
      <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 via-cyan-400/15 to-cyan-500/10 rounded-full" />
      {/* Flowing light pulses */}
      {[0, 0.5, 1.0].map((stagger, i) => (
        <motion.div
          key={i}
          className="absolute -inset-y-0.5 w-4 md:w-8 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(56,189,248,0.6), transparent)",
            filter: "blur(1px)",
          }}
          animate={{ left: ["-10%", "110%"] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: delay + stagger,
            ease: "linear",
          }}
        />
      ))}
      {/* Bright dot particles */}
      {[0.15, 0.75].map((stagger, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute top-[-1.5px] w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-cyan-300"
          style={{ boxShadow: "0 0 6px rgba(56,189,248,0.9)" }}
          animate={{ left: ["-4%", "104%"] }}
          transition={{
            duration: 1.0 + i * 0.2,
            repeat: Infinity,
            delay: delay + stagger,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ─── Logistics Flow Animation ────────────────────────────────────
function LogisticsFlowAnimation({ labels }: { labels: string[] }) {
  const stages = [
    {
      Icon: Factory,
      label: labels[0] ?? "ORIGIN",
      color: "text-emerald-400",
      glowColor: "#34d399",
      borderColor: "rgba(52,211,153,0.3)",
      bgGlow:
        "radial-gradient(circle, rgba(52,211,153,0.08) 0%, rgba(2,6,23,0.9) 70%)",
    },
    {
      Icon: Brain,
      label: labels[1] ?? "AI AGENT",
      color: "text-cyan-400",
      glowColor: "#22d3ee",
      borderColor: "rgba(34,211,238,0.3)",
      bgGlow:
        "radial-gradient(circle, rgba(34,211,238,0.08) 0%, rgba(2,6,23,0.9) 70%)",
    },
    {
      Icon: Truck,
      label: labels[2] ?? "TRANSIT",
      color: "text-blue-400",
      glowColor: "#60a5fa",
      borderColor: "rgba(96,165,250,0.3)",
      bgGlow:
        "radial-gradient(circle, rgba(96,165,250,0.08) 0%, rgba(2,6,23,0.9) 70%)",
    },
    {
      Icon: PackageCheck,
      label: labels[3] ?? "DELIVER",
      color: "text-violet-400",
      glowColor: "#a78bfa",
      borderColor: "rgba(167,139,250,0.3)",
      bgGlow:
        "radial-gradient(circle, rgba(167,139,250,0.08) 0%, rgba(2,6,23,0.9) 70%)",
    },
  ];

  return (
    <motion.div
      className="relative w-full max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto mb-4 md:mb-6 lg:mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.8 }}
    >
      {/* Ambient glow behind the flow */}
      <div
        className="absolute inset-x-0 -inset-y-4 blur-2xl pointer-events-none opacity-60"
        style={{
          background:
            "linear-gradient(90deg, rgba(52,211,153,0.03), rgba(34,211,238,0.05), rgba(96,165,250,0.03), rgba(167,139,250,0.03))",
        }}
      />

      <div className="relative flex items-start justify-center px-2 md:px-0">
        {stages.map((stage, i) => (
          <React.Fragment key={i}>
            {/* Stage Node */}
            <motion.div
              className="flex flex-col items-center z-10"
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: 0.3 + i * 0.15,
                duration: 0.5,
                ease: "easeOut",
              }}
            >
              <motion.div
                className="relative"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              >
                {/* Outer pulse ring */}
                <motion.div
                  className="absolute -inset-2 md:-inset-3 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${stage.glowColor}15, transparent 70%)`,
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                />

                {/* Icon Circle */}
                <div
                  className="relative w-11 h-11 md:w-14 md:h-14 lg:w-18 lg:h-18 rounded-full flex items-center justify-center"
                  style={{
                    border: `1px solid ${stage.borderColor}`,
                    background: stage.bgGlow,
                    boxShadow: `inset 0 0 12px ${stage.glowColor}08, 0 0 20px ${stage.glowColor}06`,
                  }}
                >
                  <stage.Icon
                    className={`w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 ${stage.color}`}
                    strokeWidth={1.5}
                  />
                </div>
              </motion.div>

              {/* Label */}
              <motion.span
                className={`mt-1.5 md:mt-2 text-sm md:text-lg lg:text-xl font-mono tracking-[0.15em] ${stage.color} opacity-60`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.6 + i * 0.15, duration: 0.4 }}
              >
                {stage.label}
              </motion.span>
            </motion.div>

            {/* Flow connector between stages */}
            {i < stages.length - 1 && (
              <FlowConnector delay={0.5 + i * 0.2} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Bottom flow indicator line */}
      <motion.div
        className="mt-4 md:mt-6 mx-auto w-3/4 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(52,211,153,0.2), rgba(34,211,238,0.3), rgba(96,165,250,0.2), rgba(167,139,250,0.2), transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
      />
    </motion.div>
  );
}

// ─── Shimmer Title ───────────────────────────────────────────────
function ShimmerTitle({ text, sub }: { text: string; sub: string }) {
  return (
    <motion.div
      className="relative inline-block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      <h1
        className="text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-normal"
        style={{
          background: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 25%, #7dd3fc 50%, #e0f2fe 75%, #bae6fd 100%)",
          backgroundSize: "200% 200%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {text}
      </h1>

      {/* Shimmer overlay */}
      <motion.div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute top-0 bottom-0 w-20 lg:w-32"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
          animate={{ left: ["-20%", "120%"] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.5), transparent)",
          boxShadow: "0 0 8px rgba(56,189,248,0.3)",
        }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
      />

      {/* Sub-line */}
      <motion.p
        className="mt-1 md:mt-2 text-sm md:text-base lg:text-lg text-cyan-300/60 font-mono tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        {sub}
      </motion.p>
    </motion.div>
  );
}

// ─── Glass Badge ─────────────────────────────────────────────────
function GlassBadge({
  icon,
  text,
  delay,
  pulse,
}: {
  icon: string;
  text: string;
  delay: number;
  pulse?: boolean;
}) {
  return (
    <motion.div
      className="relative flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-full backdrop-blur-md border border-cyan-500/20 bg-cyan-500/5"
      initial={{ opacity: 0, y: 15, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{
        scale: 1.05,
        borderColor: "rgba(56,189,248,0.4)",
        boxShadow: "0 0 20px rgba(56,189,248,0.1)",
      }}
    >
      <span className="text-xs md:text-sm">{icon}</span>
      <span className="text-[10px] md:text-xs font-medium text-cyan-300/90 tracking-wide">
        {text}
      </span>
      {pulse && (
        <span className="relative ml-0.5 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
        </span>
      )}
    </motion.div>
  );
}

// ─── AI Agent Toast ──────────────────────────────────────────────
function AgentToast({ label, message }: { label: string; message: string }) {
  return (
    <motion.div
      className="absolute bottom-16 md:bottom-20 right-4 md:right-8 z-20"
      initial={{ opacity: 0, x: 60, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay: 2.5, duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-slate-800/80 border border-cyan-500/20 backdrop-blur-lg shadow-2xl"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-green-400"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <div className="flex flex-col">
          <span className="text-[9px] md:text-[10px] text-slate-500 font-mono">{label}</span>
          <span className="text-[10px] md:text-xs text-cyan-300 font-mono">
            {message}
          </span>
        </div>
        <Zap className="w-3 h-3 text-amber-400" />
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export function VisionHookSlide() {
  const { springX, springY } = useMouseParallax();
  const t = useContent().slide1;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden bg-[#020617]">
      {/* Deep gradient base */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 40%, #0c1a2e 0%, #020617 70%)" }}
      />

      {/* Animated background */}
      <DataStreamBackground springX={springX} springY={springY} />

      {/* Floating icons (desktop) */}
      <div className="hidden md:block">
        <FloatingIcons springX={springX} springY={springY} />
      </div>

      {/* Vignettes */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(2,6,23,0.5), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(2,6,23,0.8), transparent)" }} />

      {/* ── Main Content ── */}
      <div className="relative z-10 text-center flex flex-col items-center px-4 md:px-8">
        <LogisticsFlowAnimation labels={t.flowLabels} />
        <ShimmerTitle text={t.title} sub={t.subtitle} />

        {/* Subtitle */}
        <motion.p
          className="mt-2 md:mt-4 lg:mt-5 text-xs md:text-sm lg:text-lg xl:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {t.description}
        </motion.p>

        <motion.p
          className="mt-1 text-[10px] md:text-xs lg:text-sm text-slate-500 max-w-xl mx-auto tracking-wider"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          {t.techLine}
        </motion.p>

        {/* Divider */}
        <motion.div
          className="mt-4 md:mt-6 lg:mt-8 w-12 md:w-16 h-px mx-auto"
          style={{ background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent)" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        />

        {/* Glass Badges */}
        <motion.div
          className="mt-4 md:mt-6 lg:mt-8 flex items-center gap-2 md:gap-3 justify-center flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <GlassBadge icon="🤖" text={t.badges[0]} delay={1.5} pulse />
          <GlassBadge icon="💳" text={t.badges[1]} delay={1.65} />
          <GlassBadge icon="🔗" text={t.badges[2]} delay={1.8} />
          <GlassBadge icon="🌍" text={t.badges[3]} delay={1.95} />
          <GlassBadge icon="🕌" text={t.badges[4]} delay={2.1} />
        </motion.div>
      </div>

      {/* AI Agent toast */}
      <AgentToast label={t.agentLabel} message={t.agentToast} />

      {/* ── Bottom Bar ── */}
      <motion.div
        className="absolute bottom-2 sm:bottom-3 md:bottom-6 left-0 right-0 flex items-center justify-center gap-3 md:gap-6 text-[10px] md:text-xs text-slate-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.5 }}
      >
        <a
          href="https://atom.motaiot.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium tracking-wider text-blue-500 hover:text-blue-400 transition-colors"
        >
          <Image
            src="/logos/mota-icon-v2.webp"
            alt="MOTA TechLink"
            width={16}
            height={16}
            className="rounded-sm"
          />
          MOTA TechLink
        </a>
        <span className="w-px h-3 bg-slate-600" />
        <span className="tracking-wider">{t.bottomDate}</span>
      </motion.div>
    </div>
  );
}
