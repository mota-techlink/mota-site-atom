"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  DeckLocaleProvider,
  DeckAccessProvider,
  useDeckAccess,
  useDeckLocale,
  LoginGate,
} from "@/components/pitch-deck";
import { DEFAULT_PREVIEW_SLIDES } from "@/config/pitch-decks";
import type { DeckAccess } from "@/config/pitch-decks";
import { SECTION_IDS, LOCALES, LOCALE_LABELS, THEME } from "./constants";
import { usePageNav, PageNavCtx, ActivePageCtx } from "./hooks";
import { DeckThemeProvider, useDeckTheme } from "./theme";
import { Sidebar, MobileTopBar, TopControls } from "./nav";
import { CoverSection } from "./sections/CoverSection";
import { BackgroundSection } from "./sections/BackgroundSection";
import { AnalysisSection } from "./sections/AnalysisSection";
import { ScannersSection } from "./sections/ScannersSection";
import { MiningSection } from "./sections/MiningSection";
import { ReplySection } from "./sections/ReplySection";
import { PartnerSection } from "./sections/PartnerSection";
import { ERDSection } from "./sections/ERDSection";
import { EdgeFunctionsSection } from "./sections/EdgeFunctionsSection";
import { BillingSection } from "./sections/BillingSection";
import { DashboardSection } from "./sections/DashboardSection";
import { ScheduleSection } from "./sections/ScheduleSection";
import { I18nSection } from "./sections/I18nSection";

const SECTIONS = [
  BackgroundSection,
  CoverSection,
  AnalysisSection,
  ScannersSection,
  MiningSection,
  ReplySection,
  PartnerSection,
  ERDSection,
  EdgeFunctionsSection,
  BillingSection,
  DashboardSection,
  ScheduleSection,
  I18nSection,
] as const;

// ─── Inner deck (needs locale + access context) ───────────────────────────────
function MarketDesignDeckInner() {
  const { canView, showGate, previewSlides } = useDeckAccess();
  const { deckLocale } = useDeckLocale();
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navOptions = useMemo(
    () => ({ canView, onGated: showGate }),
    [canView, showGate]
  );

  const { activeIdx, goTo } = usePageNav(navOptions);

  const handleGateBack = useCallback(() => {
    goTo(previewSlides - 1);
  }, [goTo, previewSlides]);

  const ActiveSection = SECTIONS[activeIdx];

  return (
    <PageNavCtx.Provider value={goTo}>
      <ActivePageCtx.Provider value={activeIdx}>
        <div className={`h-full w-full flex ${t.bg} ${t.text} overflow-hidden transition-colors duration-300`}>
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main content area */}
          <main className="flex-1 h-full overflow-hidden relative">
            {/* Mobile top bar */}
            <MobileTopBar onToggle={() => setSidebarOpen((v) => !v)} />

            {/* Top-right controls (lang + theme) */}
            <TopControls />

            {/* Page content */}
            <div className="h-full pt-14 lg:pt-0">
              <ActiveSection />
            </div>

            {/* Bottom page indicator */}
            <div className="absolute bottom-4 right-5 z-20 flex items-center gap-3">
              <button
                onClick={() => goTo(activeIdx - 1)}
                disabled={activeIdx === 0}
                className={`w-9 h-9 rounded-full ${t.cardBg} ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-[#DBD3ED]"} disabled:opacity-20 flex items-center justify-center ${t.body} text-sm transition-all cursor-pointer disabled:cursor-not-allowed`}
              >
                ▲
              </button>
              <span className={`text-xs ${t.muted} font-mono tabular-nums min-w-[3rem] text-center`}>
                {activeIdx + 1} / {SECTION_IDS.length}
              </span>
              <button
                onClick={() => goTo(activeIdx + 1)}
                disabled={activeIdx >= SECTION_IDS.length - 1}
                className={`w-9 h-9 rounded-full ${t.cardBg} ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-[#DBD3ED]"} disabled:opacity-20 flex items-center justify-center ${t.body} text-sm transition-all cursor-pointer disabled:cursor-not-allowed`}
              >
                ▼
              </button>
            </div>

            {/* Login gate — z-50 overlay, shown when user tries to access locked slide */}
            <LoginGate onBack={handleGateBack} locale={deckLocale} />
          </main>
        </div>
      </ActivePageCtx.Provider>
    </PageNavCtx.Provider>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
interface MarketDesignDeckProps {
  access?: DeckAccess;
  previewSlides?: number;
  isAuthenticated?: boolean;
  userRole?: string;
}

export function MarketDesignDeck({
  access = "admin",
  previewSlides = DEFAULT_PREVIEW_SLIDES,
  isAuthenticated = false,
  userRole,
}: MarketDesignDeckProps) {
  return (
    <DeckThemeProvider>
      <DeckAccessProvider
      access={access}
      previewSlides={previewSlides}
      totalSlides={SECTIONS.length}
      serverAuth={
        isAuthenticated
          ? { isAuthenticated: true, role: userRole }
          : undefined
      }
    >
      <DeckLocaleProvider
        availableLocales={[...LOCALES]}
        localeLabels={LOCALE_LABELS}
      >
        <MarketDesignDeckInner />
      </DeckLocaleProvider>
    </DeckAccessProvider>
    </DeckThemeProvider>
  );
}
