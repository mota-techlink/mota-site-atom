"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useDeckLocale, useDeckAccess } from "@/components/pitch-deck";
import { SECTION_IDS, LOCALES, LOCALE_LABELS } from "./constants";
import { useContent, PageNavCtx } from "./hooks";

// ─── Section dots ─────────────────────────────────────────────────────────────
export function SectionDots({
  activeIdx,
  goTo,
}: {
  activeIdx: number;
  goTo: (idx: number) => void;
}) {
  const lastIdx = SECTION_IDS.length - 1;

  let canView: (idx: number) => boolean;
  try {
    const access = useDeckAccess();
    canView = access.canView;
  } catch {
    canView = () => true;
  }

  return (
    <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 sm:gap-3">
      <button
        onClick={() => goTo(0)}
        aria-label="Go to first slide"
        className={`mb-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-200 text-[10px] sm:text-xs cursor-pointer ${
          activeIdx === 0
            ? "bg-d-fg/5 text-d-fg/15 pointer-events-none"
            : "bg-d-fg/10 text-d-fg/50 hover:bg-d-fg/20 hover:text-d-fg"
        }`}
      >
        ▲
      </button>

      {SECTION_IDS.map((_, idx) => {
        const locked = !canView(idx);
        return (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Go to section ${idx + 1}${locked ? " (locked)" : ""}`}
            className={`rounded-full transition-all duration-300 outline-none cursor-pointer ${
              locked
                ? "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-d-fg/8 ring-1 ring-d-fg/15"
                : activeIdx === idx
                  ? "w-1.5 h-4 sm:w-2 sm:h-6 bg-d-fg"
                  : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-d-fg/25 hover:bg-d-fg/60"
            }`}
          />
        );
      })}

      <button
        onClick={() => goTo(lastIdx)}
        aria-label="Go to last slide"
        className={`mt-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-200 text-[10px] sm:text-xs cursor-pointer ${
          activeIdx === lastIdx
            ? "bg-d-fg/5 text-d-fg/15 pointer-events-none"
            : "bg-d-fg/10 text-d-fg/50 hover:bg-d-fg/20 hover:text-d-fg"
        }`}
      >
        ▼
      </button>
    </div>
  );
}

// ─── Floating nav ─────────────────────────────────────────────────────────────
export function FloatingNav({ pastHero }: { pastHero: boolean }) {
  const { deckLocale, setDeckLocale } = useDeckLocale();
  const c = useContent();

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        pastHero
          ? "bg-d-bg/80 backdrop-blur-md border-b border-d-fg/10 shadow-lg shadow-d-bg/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-16 flex items-center justify-between">
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
          <span className="text-d-fg font-semibold text-base tracking-tight hidden sm:inline">
            Mota
          </span>
          <span className="text-d-fg/40 mx-1 hidden sm:inline">·</span>
          <span className="text-d-fg/60 text-sm hidden sm:inline">
            {c.nav.tagline}
          </span>
        </a>

        <nav className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center gap-0.5 sm:gap-1">
            {LOCALES.map((locale) => (
              <button
                key={locale}
                onClick={() => setDeckLocale(locale)}
                className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  deckLocale === locale
                    ? "bg-d-fg text-d-bg"
                    : "text-d-fg/60 hover:text-d-fg hover:bg-d-fg/10"
                }`}
              >
                {LOCALE_LABELS[locale]}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-d-fg/15 mx-0.5 sm:mx-1" />

          <ThemeToggleInline />
        </nav>
      </div>
    </header>
  );
}

// ─── Inline theme toggle ──────────────────────────────────────────────────────
const THEME_CYCLE = ["dark", "light", "system"] as const;
const THEME_ICONS = { dark: Moon, light: Sun, system: Monitor };

function ThemeToggleInline() {
  const { theme, setTheme } = useTheme();
  const current = (theme ?? "dark") as keyof typeof THEME_ICONS;
  const Icon = THEME_ICONS[current] ?? Moon;

  const cycle = () => {
    const idx = THEME_CYCLE.indexOf(current as (typeof THEME_CYCLE)[number]);
    setTheme(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]);
  };

  return (
    <button
      onClick={cycle}
      aria-label={`Theme: ${current}`}
      title={`Theme: ${current}`}
      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-d-fg/60 hover:text-d-fg hover:bg-d-fg/10 transition-all duration-200"
    >
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </button>
  );
}
