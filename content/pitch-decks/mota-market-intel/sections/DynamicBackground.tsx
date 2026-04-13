"use client";

import React, { useEffect, useRef } from "react";

// ─── Floating icon definitions ────────────────────────────────────────────────
// SVG-based social/AI/marketing icons that float across the background.
// Each is a tiny inline SVG string rendered as a data URI for zero network cost.

const ICONS = [
  // Social media
  "💬", "📱", "🔗", "👍", "🔔", "📢",
  // AI / tech
  "🤖", "🧠", "⚡", "🔮", "💡", "🎯",
  // Marketing
  "📊", "📈", "🚀", "💎", "🌐", "✨",
] as const;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  icon: string;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
}

interface DynamicBackgroundProps {
  /** Number of floating particles. Defaults to 18 on desktop, fewer on mobile */
  count?: number;
  /** Base color class (for the gradient mesh). e.g. "indigo" | "violet" */
  accent?: "indigo" | "violet" | "emerald" | "rose";
  className?: string;
}

const ACCENT_COLORS = {
  indigo: { mesh1: "rgba(99,102,241,0.08)", mesh2: "rgba(129,140,248,0.05)" },
  violet: { mesh1: "rgba(139,92,246,0.08)", mesh2: "rgba(167,139,250,0.05)" },
  emerald: { mesh1: "rgba(16,185,129,0.06)", mesh2: "rgba(52,211,153,0.04)" },
  rose: { mesh1: "rgba(244,63,94,0.06)", mesh2: "rgba(251,113,133,0.04)" },
};

export function DynamicBackground({
  count,
  accent = "indigo",
  className = "",
}: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Determine particle count based on viewport
    const effectiveCount = count ?? (window.innerWidth < 640 ? 10 : 18);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    // Initialize particles
    particlesRef.current = Array.from({ length: effectiveCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2 - 0.1, // slight upward drift
      icon: ICONS[Math.floor(Math.random() * ICONS.length)],
      size: 10 + Math.random() * 10,
      opacity: 0.06 + Math.random() * 0.12,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.005,
    }));

    const animate = () => {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        // Wrap around
        if (p.x < -30) p.x = cw + 30;
        if (p.x > cw + 30) p.x = -30;
        if (p.y < -30) p.y = ch + 30;
        if (p.y > ch + 30) p.y = -30;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.icon, 0, 0);
        ctx.restore();
      }

      // Draw faint connection lines between nearby particles
      ctx.strokeStyle = "rgba(255,255,255,0.02)";
      ctx.lineWidth = 0.5;
      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.globalAlpha = (1 - dist / 150) * 0.04;
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
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
