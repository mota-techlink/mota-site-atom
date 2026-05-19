"use client";
import React, { useRef, useEffect } from "react";

type Accent = "indigo" | "amber" | "rose" | "emerald";

// All accents remap to blue/cyan/indigo family (smart-elevator blue theme).
const ACCENT_COLORS: Record<Accent, string> = {
  indigo:  "180,83,9",   // indigo-500
  amber:   "245,158,11",  // indigo-400 (was warm → cool)
  rose:    "234,88,12",   // blue-500   (was warm → cool)
  emerald: "120,53,15",   // cyan-400   (was green → cyan)
};

interface Props {
  accent?: Accent;
  brightness?: number;
  count?: number;
}

export function DynamicBackground({ accent = "indigo", brightness = 1.4, count = 15 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rgb = ACCENT_COLORS[accent];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 60 + Math.random() * 120,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: 0.03 + Math.random() * 0.07 * brightness,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(${rgb},${p.alpha})`);
        g.addColorStop(1, `rgba(${rgb},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < -p.r) p.x = canvas.width + p.r;
        if (p.x > canvas.width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = canvas.height + p.r;
        if (p.y > canvas.height + p.r) p.y = -p.r;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, [rgb, brightness, count]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
