"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useDeckLocale, useDeckAccess } from "@/components/pitch-deck";
import { SECTION_IDS, LOCALES, LOCALE_LABELS } from "./constants";
import { useContent } from "./hooks";

export function SectionDots({ activeIdx, goTo }: { activeIdx: number; goTo: (idx: number) => void }) {
  const lastIdx = SECTION_IDS.length - 1;
  let canView: (idx: number) => boolean;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const access = useDeckAccess();
    canView = access.canView;
  } catch {
    canView = () => true;
  }
  return (
    <div className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 sm:gap-3">
      <button onClick={() => goTo(0)} aria-label="Go to first slide"
        className={`mb-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-200 text-[10px] sm:text-xs cursor-pointer ${activeIdx === 0 ? "bg-d-fg/5 text-d-fg/15 pointer-events-none" : "bg-d-fg/10 text-d-fg/50 hover:bg-d-fg/20 hover:text-d-fg"}`}>▲</button>
      {SECTION_IDS.map((_, idx) => {
        const locked = !canView(idx);
        return (
          <button key={idx} onClick={() => goTo(idx)} aria-label={`Section ${idx + 1}${locked ? " (locked)" : ""}`}
            className={`rounded-full transition-all duration-300 outline-none cursor-pointer ${locked ? "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-d-fg/8 ring-1 ring-d-fg/15" : activeIdx === idx ? "w-1.5 h-4 sm:w-2 sm:h-6 bg-d-fg" : "w-1.5 h-1.5 sm:w-2 sm:h-2 bg-d-fg/25 hover:bg-d-fg/60"}`} />
        );
      })}
      <button onClick={() => goTo(lastIdx)} aria-label="Go to last slide"
        className={`mt-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-200 text-[10px] sm:text-xs cursor-pointer ${activeIdx === lastIdx ? "bg-d-fg/5 text-d-fg/15 pointer-events-none" : "bg-d-fg/10 text-d-fg/50 hover:bg-d-fg/20 hover:text-d-fg"}`}>▼</button>
    </div>
  );
}

export function FloatingNav({ pastHero }: { pastHero: boolean }) {
  const { deckLocale, setDeckLocale } = useDeckLocale();
  const { theme, setTheme } = useTheme();
  // Logo now navigates to "/" via <Link>; PageNavCtx no longer used here.
  const c = useContent();

  return (
    <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${pastHero ? "bg-[#1a0f0a]/70 backdrop-blur-md border-b border-amber-800/20" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-stone-200/80 text-xs sm:text-sm font-medium hidden sm:block">{c.nav.tagline}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Locale switcher */}
          <div className="flex items-center gap-1 bg-d-fg/8 rounded-full px-1.5 py-1">
            {LOCALES.map((loc) => (
              <button key={loc} onClick={() => setDeckLocale(loc)}
                className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium transition-all ${deckLocale === loc ? "bg-d-fg text-d-bg" : "text-d-fg/50 hover:text-d-fg"}`}>
                {LOCALE_LABELS[loc]}
              </button>
            ))}
          </div>
          {/* Theme toggle hidden */}
        </div>
      </div>
    </div>
  );
}
