"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useContent, useActiveSlide } from "../hooks";
import { SECTION, SECTION_MAP } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

/** Gradient per step */
const GRADIENTS = [
  "from-indigo-500 to-indigo-600",
  "from-violet-500 to-violet-600",
  "from-pink-500 to-pink-600",
  "from-emerald-500 to-emerald-600",
];

/** Border/glow accent per step */
const ACCENTS = [
  { border: "border-indigo-500/40", glow: "shadow-indigo-500/10" },
  { border: "border-violet-500/40", glow: "shadow-violet-500/10" },
  { border: "border-pink-500/40", glow: "shadow-pink-500/10" },
  { border: "border-emerald-500/40", glow: "shadow-emerald-500/10" },
];

/** Auto-rotate interval (ms) per step */
const AUTO_INTERVAL = 5000;
/** Time after user interaction before auto-play resumes */
const RESUME_DELAY = 8000;

export function HowItWorksSection() {
  const c = useContent();
  const h = c.howitworks;
  const activeSlide = useActiveSlide();
  const isVisible = activeSlide === SECTION_MAP["s-howitworks"];

  const [openIdx, setOpenIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  // Refs for timer management
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepCount = h.steps.length;

  // ── Auto-play engine ────────────────────────────────────────────────────────
  const startAutoPlay = useCallback(() => {
    // Clear any existing timers
    if (autoTimer.current) clearInterval(autoTimer.current);
    if (progressTimer.current) clearInterval(progressTimer.current);

    setProgress(0);

    // Progress bar ticks every 50ms
    const progressStep = 50 / AUTO_INTERVAL; // fraction per tick
    progressTimer.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) return 0;
        return Math.min(prev + progressStep, 1);
      });
    }, 50);

    // Advance accordion every AUTO_INTERVAL ms
    autoTimer.current = setInterval(() => {
      setOpenIdx((prev) => (prev + 1) % stepCount);
      setProgress(0);
    }, AUTO_INTERVAL);
  }, [stepCount]);

  const stopAutoPlay = useCallback(() => {
    if (autoTimer.current) { clearInterval(autoTimer.current); autoTimer.current = null; }
    if (progressTimer.current) { clearInterval(progressTimer.current); progressTimer.current = null; }
    setProgress(0);
  }, []);

  // Start/stop when slide becomes visible/hidden
  useEffect(() => {
    if (isVisible && !paused) {
      // Small delay after slide transition
      const t = setTimeout(() => startAutoPlay(), 600);
      return () => { clearTimeout(t); stopAutoPlay(); };
    } else {
      stopAutoPlay();
    }
    return () => stopAutoPlay();
  }, [isVisible, paused, startAutoPlay, stopAutoPlay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoPlay();
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [stopAutoPlay]);

  // ── User click handler ──────────────────────────────────────────────────────
  const handleClick = (idx: number) => {
    setOpenIdx(idx);
    setPaused(true);
    setProgress(0);
    stopAutoPlay();

    // Schedule auto-play resume
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      setPaused(false);
    }, RESUME_DELAY);
  };

  return (
    <section id="s-howitworks" className={`${SECTION} bg-black relative`}>
      <DynamicBackground accent="violet" />

      <div className="max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <span className="inline-block px-3 py-1 sm:px-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs sm:text-sm font-medium mb-2 sm:mb-4">
            {h.badge}
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white">
            {h.title}
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-2 sm:space-y-3">
          {h.steps.map((step, i) => {
            const isOpen = i === openIdx;
            const acc = ACCENTS[i] ?? ACCENTS[0];

            return (
              <div
                key={i}
                className={`mi-child rounded-xl sm:rounded-2xl border transition-all duration-500 overflow-hidden ${
                  isOpen
                    ? `${acc.border} bg-white/[0.04] shadow-lg ${acc.glow}`
                    : "border-white/8 bg-white/[0.02] hover:bg-white/[0.03]"
                }`}
              >
                {/* Header row — always visible */}
                <button
                  onClick={() => handleClick(i)}
                  className="w-full flex items-center gap-3 sm:gap-5 px-3 py-2.5 sm:px-6 sm:py-4 text-left cursor-pointer group"
                >
                  {/* Step bubble */}
                  <div
                    className={`shrink-0 w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br ${GRADIENTS[i]} flex items-center justify-center text-white font-mono font-bold text-xs sm:text-base shadow-md transition-transform duration-300 ${
                      isOpen ? "scale-110" : "group-hover:scale-105"
                    }`}
                  >
                    {step.number}
                  </div>

                  {/* Title */}
                  <h3
                    className={`flex-1 font-bold transition-colors duration-300 text-sm sm:text-lg ${
                      isOpen ? "text-white" : "text-white/60 group-hover:text-white/80"
                    }`}
                  >
                    {step.title}
                  </h3>

                  {/* Chevron */}
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-white/60" : "text-white/30"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Collapsible body */}
                <div
                  className="overflow-hidden transition-all duration-500 ease-out"
                  style={{
                    maxHeight: isOpen ? "200px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="px-3 pb-3 sm:px-6 sm:pb-5 pl-14 sm:pl-[4.5rem]">
                    <p className="text-white/55 leading-relaxed text-xs sm:text-base max-w-2xl">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar — only on active open step */}
                {isOpen && !paused && (
                  <div className="h-0.5 bg-white/5">
                    <div
                      className={`h-full bg-linear-to-r ${GRADIENTS[i]} transition-none`}
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
