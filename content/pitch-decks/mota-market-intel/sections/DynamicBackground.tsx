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

/** Stable seeded pseudo-random */
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
  const n = Math.min(count ?? 12, 12);
  const colors = ACCENT_COLORS[accent];

  /**
   * Each particle gets its OWN @keyframes with hardcoded values.
   * Uses a back-and-forth floating pattern with large movement for visibility.
   * Duration 8-16s ensures motion is clearly perceivable.
   */
  const { items, css } = useMemo(() => {
    const list = Array.from({ length: n }, (_, i) => {
      // Very large movement — unmissable floating effect
      const x1 = Math.round((sr(i * 31 + 8) - 0.5) * 300);
      const y1 = Math.round((sr(i * 31 + 9) - 0.5) * 200);
      const x2 = Math.round((sr(i * 31 + 10) - 0.5) * -260);
      const y2 = Math.round((sr(i * 31 + 11) - 0.5) * -180);
      const r1 = Math.round((sr(i * 31 + 7) - 0.5) * 50);
      const r2 = Math.round((sr(i * 31 + 12) - 0.5) * -40);
      const op = Number(((0.12 + sr(i * 31 + 4) * 0.18) * brightness).toFixed(3));
      const kf = `mf${i}`;
      return {
        kf,
        icon: ICONS[Math.floor(sr(i * 31) * ICONS.length)],
        left: sr(i * 31 + 1) * 90 + 5,
        top:  sr(i * 31 + 2) * 85 + 5,
        size: 12 + sr(i * 31 + 3) * 12,
        op,
        dur:  8 + sr(i * 31 + 5) * 8,          // 8-16s — fast enough to see
        delay: -(sr(i * 31 + 6) * 10),
        // Back-and-forth loop: start → mid1 → mid2 → start (smooth loop)
        rule: `@keyframes ${kf}{` +
          `0%{transform:translate(0,0) rotate(0deg);opacity:${op}}` +
          `25%{transform:translate(${x1}px,${y1}px) rotate(${r1}deg);opacity:${op}}` +
          `50%{transform:translate(${x2}px,${y2}px) rotate(${r2}deg);opacity:${op}}` +
          `75%{transform:translate(${-x1 * 0.6}px,${-y1 * 0.7}px) rotate(${-r1 * 0.5}deg);opacity:${op}}` +
          `100%{transform:translate(0,0) rotate(0deg);opacity:${op}}}`,
      };
    });
    return { items: list, css: list.map((p) => p.rule).join("\n") };
  }, [n, brightness]);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Baked keyframes — one per particle, zero JS per frame */}
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Static radial gradient mesh */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 50%, ${colors.mesh1}, transparent),
            radial-gradient(ellipse 50% 60% at 80% 30%, ${colors.mesh2}, transparent)
          `,
        }}
      />

      {/* Particles — each references its own named keyframe */}
      {items.map((p) => (
        <span
          key={p.kf}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: `${p.size}px`,
            lineHeight: "1",
            opacity: 0,
            willChange: "transform, opacity",
            animation: `${p.kf} ${p.dur}s ${p.delay}s infinite ease-in-out`,
          }}
        >
          {p.icon}
        </span>
      ))}
    </div>
  );
}
