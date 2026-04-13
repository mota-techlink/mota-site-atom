"use client";

import React from "react";
import Image from "next/image";
import { useDeckLocale } from "@/components/pitch-deck";
import { SECTION_IDS, LOCALES, LOCALE_LABELS } from "./constants";
import { useContent } from "./hooks";

// ─── Section dots ─────────────────────────────────────────────────────────────
export function SectionDots({
  activeIdx,
  goTo,
}: {
  activeIdx: number;
  goTo: (idx: number) => void;
}) {
  return (
    <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 sm:gap-3">
      {SECTION_IDS.map((_, idx) => (
        <button
          key={idx}
          onClick={() => goTo(idx)}
          aria-label={`Go to section ${idx + 1}`}
          className={`
            rounded-full transition-all duration-300 outline-none
            ${activeIdx === idx
              ? "w-1.5 h-4 sm:w-2 sm:h-6 bg-white"
              : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/25 hover:bg-white/60"}
          `}
        />
      ))}
    </div>
  );
}

// ─── Floating nav ─────────────────────────────────────────────────────────────
export function FloatingNav({ pastHero }: { pastHero: boolean }) {
  const { deckLocale, setDeckLocale } = useDeckLocale();
  const c = useContent();

  return (
    <header
      className={`
        fixed top-0 inset-x-0 z-50 transition-all duration-300
        ${pastHero
          ? "bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/40"
          : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logos/mota-icon-v2.webp"
            alt="Mota"
            width={108}
            height={36}
            className="h-6 sm:h-8 w-auto"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="text-white font-semibold text-base tracking-tight hidden sm:inline">
            Mota
          </span>
          <span className="text-white/40 mx-1 hidden sm:inline">·</span>
          <span className="text-white/60 text-sm hidden sm:inline">
            {c.nav.tagline}
          </span>
        </a>

        {/* Language switcher */}
        <nav className="flex items-center gap-0.5 sm:gap-1">
          {LOCALES.map((locale) => (
            <button
              key={locale}
              onClick={() => setDeckLocale(locale)}
              className={`
                px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200
                ${deckLocale === locale
                  ? "bg-white text-black"
                  : "text-white/60 hover:text-white hover:bg-white/10"}
              `}
            >
              {LOCALE_LABELS[locale]}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
