"use client";

import React, { useEffect, useRef } from "react";

// ─── Floating icon definitions ────────────────────────────────────────────────
const ICONS = [
  "💬", "📱", "🔗", "👍", "🔔", "📢",
  "🤖", "🧠", "⚡", "🔮", "💡", "🎯",
  "📊", "📈", "🚀", "💎", "🌐", "✨",
] as const;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  icon: string;
  size: number;
  baseOpacity: number;
  rotation: number;
  rotationSpeed: number;
  /** Sine wobble phase */
  phase: number;
  /** Sine wobble amplitude in px */
  wobbleAmp: number;
  /** Sine wobble frequency (rad/frame) */
  wobbleFreq: number;
}

interface DynamicBackgroundProps {
  /** Number of floating particles. Defaults to 40 on desktop, 22 on mobile */
  count?: number;
  accent?: "indigo" | "violet" | "emerald" | "rose" | "amber" | "cyan";
  /** Opacity multiplier (1 = default, 1.5 = brighter — useful on pure-black bgs) */
  brightness?: number;
  className?: string;
}

const ACCENT_COLORS = {
  indigo: { mesh1: "rgba(99,102,241,0.08)", mesh2: "rgba(129,140,248,0.05)" },
  violet: { mesh1: "rgba(139,92,246,0.08)", mesh2: "rgba(167,139,250,0.05)" },
  emerald: { mesh1: "rgba(16,185,129,0.06)", mesh2: "rgba(52,211,153,0.04)" },
  rose: { mesh1: "rgba(244,63,94,0.06)", mesh2: "rgba(251,113,133,0.04)" },
  amber: { mesh1: "rgba(245,158,11,0.06)", mesh2: "rgba(252,211,77,0.04)" },
  cyan: { mesh1: "rgba(6,182,212,0.07)", mesh2: "rgba(34,211,238,0.04)" },
};

/** Random float in [min, max) */
const rand = (min: number, max: number) => min + Math.random() * (max - min);
/** Random sign: -1 or 1 */
const randSign = () => (Math.random() < 0.5 ? -1 : 1);

export function DynamicBackground({
  count,
  accent = "indigo",
  brightness = 1,
  className = "",
}: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cw = 0;
    let ch = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      cw = canvas.offsetWidth;
      ch = canvas.offsetHeight;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // More particles for a denser, more energetic feel
    const effectiveCount = count ?? (window.innerWidth < 640 ? 22 : 40);

    // Initialize particles with much more speed & variety
    particlesRef.current = Array.from({ length: effectiveCount }, () => {
      const speed = rand(0.6, 2.0);
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * cw,
        y: Math.random() * ch,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.3, // slight upward bias
        icon: ICONS[Math.floor(Math.random() * ICONS.length)],
        size: rand(10, 20),
        baseOpacity: rand(0.08, 0.22) * brightness,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: randSign() * rand(0.008, 0.025),
        phase: Math.random() * Math.PI * 2,
        wobbleAmp: rand(0.3, 1.2),
        wobbleFreq: rand(0.015, 0.04),
      };
    });

    // Handle tab visibility — reset timing when user returns to avoid dt spike
    let paused = false;
    const onVisibility = () => {
      if (document.hidden) {
        paused = true;
        cancelAnimationFrame(rafRef.current);
      } else {
        // Reset time reference so first frame after return has dt ≈ 0
        lastTimeRef.current = 0;
        paused = false;
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Time-based animation for consistent speed across frame-rates
    const animate = (now: number) => {
      if (paused) return;
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = Math.min((now - lastTimeRef.current) / 16.667, 1.5); // normalise to ~60fps, cap at 1.5
      lastTimeRef.current = now;

      ctx.clearRect(0, 0, cw, ch);

      for (const p of particlesRef.current) {
        // Update position with sine wobble for organic drift
        p.phase += p.wobbleFreq * dt;
        p.x += (p.vx + Math.sin(p.phase) * p.wobbleAmp) * dt;
        p.y += (p.vy + Math.cos(p.phase * 0.7) * p.wobbleAmp * 0.5) * dt;
        p.rotation += p.rotationSpeed * dt;

        // Wrap around with margin
        if (p.x < -40) p.x = cw + 40;
        if (p.x > cw + 40) p.x = -40;
        if (p.y < -40) p.y = ch + 40;
        if (p.y > ch + 40) p.y = -40;

        // Pulsing opacity for a lively feel
        const pulse = 0.85 + 0.15 * Math.sin(p.phase * 1.3);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.baseOpacity * pulse;
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.icon, 0, 0);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      paused = true;
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, [count, accent]);

  const colors = ACCENT_COLORS[accent];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Gradient mesh */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 50%, ${colors.mesh1}, transparent),
            radial-gradient(ellipse 50% 60% at 80% 30%, ${colors.mesh2}, transparent)
          `,
        }}
      />
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 1 }}
      />
    </div>
  );
}
