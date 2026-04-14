"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useContent, useNav } from "../hooks";
import { SECTION, SECTION_MAP } from "../constants";
import { DynamicBackground } from "./DynamicBackground";
import { TypewriterText } from "@/components/ui/typewriter-text";

/* ── All platform icons for the sliding carousel ── */
const PLATFORM_ICONS = [
  { name: "Reddit",         src: "/icons/reddit.svg" },
  { name: "Quora",          src: "/icons/quora.svg" },
  { name: "YouTube",        src: "/icons/youtube.svg" },
  { name: "Amazon",         src: "/icons/amazon.svg" },
  { name: "LinkedIn",       src: "/icons/linkedin.svg" },
  { name: "TikTok",         src: "/icons/tiktok.svg" },
  { name: "Stack Overflow", src: "/icons/stackoverflow.svg" },
  { name: "ProductHunt",    src: "/icons/producthunt.svg" },
  { name: "X (Twitter)",    src: "/icons/twitter.svg" },
  { name: "Facebook",       src: "/icons/facebook.svg" },
  { name: "Instagram",      src: "/icons/instagram.svg" },
  { name: "Pinterest",      src: "/icons/pinterest.svg" },
  { name: "Medium",         src: "/icons/medium.svg" },
  { name: "Discord",        src: "/icons/discord.svg" },
  { name: "Google",         src: "/icons/google.svg" },
];

const VISIBLE = 5;
const ICON_SIZE = 22; // px per icon slot (including overlap)

/**
 * Sliding platform logo carousel.
 * Shows `VISIBLE` icons at a time; every 1 s the queue shifts —
 * the leftmost icon slides out and a new one enters from the right.
 */
function PlatformCarousel() {
  // offset = how many times we've shifted so far
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setOffset((o) => o + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Build the visible window (VISIBLE + 1 to allow the outgoing icon to animate out)
  const slots: { icon: (typeof PLATFORM_ICONS)[number]; key: number }[] = [];
  for (let i = 0; i < VISIBLE + 1; i++) {
    const idx = (offset + i) % PLATFORM_ICONS.length;
    slots.push({ icon: PLATFORM_ICONS[idx], key: offset + i });
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: VISIBLE * ICON_SIZE, height: 24 }}
    >
      {slots.map((s, i) => {
        // i === 0 is the outgoing slot (slides out left), i === VISIBLE is the incoming slot
        const left = (i - 1) * ICON_SIZE;
        const isLeaving = i === 0;
        const isEntering = i === VISIBLE;
        return (
          <img
            key={s.key}
            src={s.icon.src}
            alt={s.icon.name}
            title={s.icon.name}
            className="absolute top-0 rounded-full ring-1 ring-d-bg/40 bg-d-fg/10 object-cover transition-all duration-500 ease-in-out"
            style={{
              width: 20,
              height: 20,
              top: 2,
              left,
              opacity: isLeaving ? 0 : 1,
              transform: isLeaving
                ? "translateX(-12px) scale(0.7)"
                : isEntering
                ? "translateX(0) scale(1)"
                : "translateX(0) scale(1)",
            }}
          />
        );
      })}
    </div>
  );
}

export function HeroSection() {
  const c = useContent();
  const h = c.hero;
  const goTo = useNav();

  return (
    <section
      id="s-hero"
      className={`${SECTION} relative items-center justify-center bg-d-bg`}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-d-indigo-s via-d-bg to-d-bg" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-200 h-200 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-100 h-100 bg-violet-600/15 rounded-full blur-[80px]" />
      </div>

      {/* Dynamic floating particles */}
      <DynamicBackground accent="indigo" />

      <div className="relative z-10 max-w-5xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 text-center">
        {/* Badge */}
        <div className="mi-child inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-indigo-500/20 border border-d-indigo/30 text-d-indigo/75 text-xs sm:text-sm font-medium mb-3 sm:mb-5 lg:mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-d-indigo animate-pulse" />
          {h.badge}
        </div>

        {/* Title */}
        <h1 className="mi-child text-2xl sm:text-4xl lg:text-6xl font-bold text-d-fg leading-tight mb-1 sm:mb-2">
          {h.title}
        </h1>

        {/* Title highlight */}
        <p className="mi-child text-xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6">
          <span className="bg-linear-to-r from-d-indigo via-d-violet to-d-pink bg-clip-text text-transparent">
            {h.titleHighlight}
          </span>
        </p>

        {/* Subtitle */}
        <p className="mi-child text-sm sm:text-lg lg:text-xl text-d-fg/60 max-w-2xl mx-auto leading-relaxed mb-4 sm:mb-6 lg:mb-8">
          {h.subtitle}
        </p>

        {/* Visual feature pills */}
        <div className="mi-child flex flex-wrap justify-center gap-2 sm:gap-3 mb-3 sm:mb-5">
          {(h as any).features?.map((f: { icon: string; label: string }, i: number) =>
            i === 1 && (h as any).languageWords?.length ? (
              <div
                key={i}
                className="relative flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-d-fg/5 border border-d-fg/10 hover:border-d-fg/20 hover:bg-d-fg/8 transition-all duration-200 min-w-32 sm:min-w-38"
              >
                <span className="text-base sm:text-lg shrink-0">{f.icon}</span>
                <span className="flex-1 text-center">
                  <TypewriterText
                    words={(h as any).languageWords}
                    // staticText={(h as any).languageStatic}
                    className="text-xs sm:text-sm text-d-fg/70! font-medium!"
                    cursorClassName="!bg-d-fg/40"
                    typingSpeed={100}
                    deletingSpeed={60}
                    pauseTime={1600}
                    startOnIdle
                  />
                </span>
              </div>
            ) : (
              <div
                key={i}
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-d-fg/5 border border-d-fg/10 hover:border-d-fg/20 hover:bg-d-fg/8 transition-all duration-200"
              >
                <span className="text-base sm:text-lg">{f.icon}</span>
                <span className="text-xs sm:text-sm text-d-fg/70 font-medium whitespace-nowrap">{f.label}</span>
              </div>
            )
          )}
        </div>

        {/* Trust line */}
        {(h as any).trustLine && (
          <p className="mi-child text-xs sm:text-sm text-d-fg/35 mb-4 sm:mb-6 lg:mb-8 tracking-wide">
            {(h as any).trustLine}
          </p>
        )}

        {/* Value proposition badges */}
        {(h as any).valueBadges && (
          <div className="mi-child flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-10 lg:mb-14">
            {(h as any).valueBadges.map((b: { icon: string; label: string }, i: number) =>
              i === 1 ? (
                /* ── Platform logo carousel badge ── */
                <div
                  key={i}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-indigo-500/10 border border-d-indigo/20 hover:border-d-indigo/30 transition-all duration-200"
                >
                  <span className="text-sm sm:text-lg">{b.icon}</span>
                  <span className="text-xs sm:text-sm text-d-indigo/90 font-semibold whitespace-nowrap">20</span>
                  <PlatformCarousel />
                </div>
              ) : (
                <div
                  key={i}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-indigo-500/10 border border-d-indigo/20 hover:border-d-indigo/30 transition-all duration-200"
                >
                  <span className="text-sm sm:text-lg">{b.icon}</span>
                  <span className="text-xs sm:text-sm text-d-indigo/90 font-semibold whitespace-nowrap">{b.label}</span>
                </div>
              )
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mi-child grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto">
          {h.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-d-fg mb-0.5">{stat.value}</div>
              <div className="text-[10px] sm:text-sm text-d-fg/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Page indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-d-fg/30 animate-bounce">
        <div className="w-px h-8 bg-linear-to-b from-transparent to-d-fg/30" />
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}
