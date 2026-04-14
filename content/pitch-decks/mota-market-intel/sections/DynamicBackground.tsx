"use client";

import React, { useMemo } from "react";

const ICONS = [
  "💬", "📱", "🔗", "👍", "🔔", "📢",
  "🤖", "🧠", "⚡", "🔮", "💡", "🎯",
  "📊", "📈", "🚀", "💎", "🌐", "✨",
];

interface DynamicBackgroundProps {
  count?: number;
  accent?: "indigo" | "violet" | "emerald" | "rose" | "amber" | "cyan";
  brightness?: number;
  className?: string;
}

const ACCENT_COLORS = {
  indigo:  { mesh1: "rgba(99,102,241,0.08)",  mesh2: "rgba(129,140,248,0.05)" },
  violet:  { mesh1: "rgba(139,92,246,0.08)",  mesh2: "rgba(167,139,250,0.05)" },
  emerald: { mesh1: "rgba(16,185,129,0.06)",  mesh2: "rgba(52,211,153,0.04)"  },
  rose:    { mesh1: "rgba(244,63,94,0.06)",   mesh2: "rgba(251,113,133,0.04)" },
  amber:   { mesh1: "rgba(245,158,11,0.06)",  mesh2: "rgba(252,211,77,0.04)"  },
  cyan:    { mesh1: "rgba(6,182,212,0.07)",   mesh2: "rgba(34,211,238,0.04)"  },
};

/** Stable seeded pseudo-random — no state, no refs, no side-effects */
function sr(seed: number): number {
  const x = Math.sin(seed + 1) * 43758.5453123;
  return x - Math.floor(x);
}

export function DynamicBackground({
  count,
  accent = "indigo",
  brightness = 1,
  className = "",
}: DynamicBackgroundProps) {
  // Hard cap at 12 particles — plenty of visual texture, negligible GPU cost
  const n = Math.min(count ?? 12, 12);
  const colors = ACCENT_COLORS[accent];

  const particles = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => ({
        icon:  ICONS[Math.floor(sr(i * 31 + 0) * ICONS.length)],
        left:  `${sr(i * 31 + 1) * 95}%`,
        top:   `${sr(i * 31 + 2) * 90}%`,
        size:   10 + sr(i * 31 + 3) * 10,
        opacity: (0.07 + sr(i * 31 + 4) * 0.13) * brightness,
        dur:   `${14 + sr(i * 31 + 5) * 18}s`,
        delay: `${-(sr(i * 31 + 6) * 20)}s`,
        rot:   `${Math.round((sr(i * 31 + 7) - 0.5) * 60)}deg`,
        dx:    `${Math.round((sr(i * 31 + 8) - 0.5) * 60)}px`,
        dy:    `${-30 - Math.round(sr(i * 31 + 9) * 60)}px`,
      })),
    [n, brightness],
  );

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/*
       * One tiny <style> block injected at mount — zero JS runs per frame.
       * CSS animations are handled entirely by the compositor (GPU thread),
       * freeing the main thread for scroll, keyboard, and React updates.
       */}
      <style>{`
        @keyframes mi-float {
          0%   { transform: translate(0,0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translate(var(--mi-dx),var(--mi-dy)) rotate(var(--mi-rot)); opacity: 0; }
        }
      `}</style>

      {/* Static gradient mesh — composited once, no per-frame work */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 50%, ${colors.mesh1}, transparent),
            radial-gradient(ellipse 50% 60% at 80% 30%, ${colors.mesh2}, transparent)
          `,
        }}
      />

      {/* Emoji particles — each is a GPU layer; no canvas, no rAF, no main-thread cost */}
      {particles.map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: p.left,
            top: p.top,
            fontSize: `${p.size}px`,
            lineHeight: "1",
            opacity: 0,
            willChange: "transform, opacity",
            ["--mi-dx" as string]: p.dx,
            ["--mi-dy" as string]: p.dy,
            ["--mi-rot" as string]: p.rot,
            animation: `mi-float ${p.dur} ${p.delay} infinite linear`,
          }}
        >
          {p.icon}
        </span>
      ))}
    </div>
  );
}
