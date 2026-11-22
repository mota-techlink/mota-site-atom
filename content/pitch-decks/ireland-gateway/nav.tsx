"use client";

import React from "react";
import { useDeckLocale } from "@/components/pitch-deck";
import { SECTION_IDS, LOCALES, LOCALE_LABELS } from "./constants";
import { useContent } from "./hooks";

// ─── Floating top bar: brand + language switch ────────────────────────────────
export function FloatingNav({ pastHero }: { pastHero: boolean }) {
  const c = useContent();
  const { deckLocale, setDeckLocale } = useDeckLocale();

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 flex items-center justify-between gap-3 px-4 sm:px-6 py-3 transition-all duration-500 ${
        pastHero
          ? "backdrop-blur-md bg-[#05080F]/70 border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <a
        href="https://motaiot.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_10px_2px_rgba(52,211,153,0.6)]" />
        <span className="text-sm sm:text-base font-semibold tracking-wide text-white/90 truncate">
          {c.nav.title}
        </span>
      </a>

      <div className="flex items-center gap-1 rounded-full px-1 py-1 bg-white/5 border border-white/10 shrink-0">
        {LOCALES.map((locale) => (
          <button
            key={locale}
            type="button"
            onClick={() => setDeckLocale(locale)}
            aria-label={`Switch to ${LOCALE_LABELS[locale]}`}
            className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
              deckLocale === locale
                ? "bg-emerald-500/25 text-emerald-200"
                : "text-white/55 hover:text-white hover:bg-white/10"
            }`}
          >
            {LOCALE_LABELS[locale]}
          </button>
        ))}
      </div>
    </header>
  );
}

// ─── Right-hand section dots (progress + jump) ────────────────────────────────
export function SectionDots({
  activeIdx,
  goTo,
}: {
  activeIdx: number;
  goTo: (idx: number) => void;
}) {
  const c = useContent();

  return (
    <nav
      aria-label="Deck sections"
      className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-2.5"
    >
      {SECTION_IDS.map((id, idx) => {
        const label =
          (c.nav.sections as Record<string, string>)[id.replace("s-", "")] ?? "";
        const isActive = idx === activeIdx;
        return (
          <button
            key={id}
            type="button"
            onClick={() => goTo(idx)}
            title={label}
            aria-label={label}
            className="group flex items-center gap-2 cursor-pointer"
          >
            <span
              className={`text-[10px] font-mono tracking-wider whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "text-emerald-300/90 opacity-100"
                  : "text-white/35 opacity-0 group-hover:opacity-100"
              }`}
            >
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "w-6 h-1.5 bg-emerald-400 shadow-[0_0_10px_1px_rgba(52,211,153,0.5)]"
                  : "w-1.5 h-1.5 bg-white/25 group-hover:bg-white/60"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}

// ─── Bottom progress rail + counter (alternative affordance) ──────────────────
export function ProgressRail({ activeIdx }: { activeIdx: number }) {
  const total = SECTION_IDS.length;
  return (
    <div className="pointer-events-none fixed bottom-4 inset-x-0 z-40 flex items-center justify-center gap-3 px-6">
      <div className="flex items-center gap-2 rounded-full px-3 py-1.5 bg-black/70 border border-white/12 backdrop-blur-md shadow-lg shadow-black/40">
        <span className="text-[11px] font-mono tabular-nums text-white/70">
          {String(activeIdx + 1).padStart(2, "0")}
        </span>
        <span className="block w-16 sm:w-28 h-0.5 rounded-full bg-white/15 overflow-hidden">
          <span
            className="block h-full bg-emerald-400 transition-all duration-500"
            style={{ width: `${((activeIdx + 1) / total) * 100}%` }}
          />
        </span>
        <span className="text-[11px] font-mono tabular-nums text-white/45">
          {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
