"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  DeckLocaleProvider,
  DeckAccessProvider,
  useDeckAccess,
  LoginGate,
} from "@/components/pitch-deck";
import { DEFAULT_PREVIEW_SLIDES } from "@/config/pitch-decks";
import { SECTION_IDS, LOCALES, LOCALE_LABELS } from "./constants";
import { usePageNav, PageNavCtx, ActivePageCtx } from "./hooks";
import { Sidebar, MobileTopBar } from "./nav";
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
        <div className="h-full w-full flex bg-zinc-950 text-white overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Main content area */}
          <main className="flex-1 h-full overflow-hidden relative">
            {/* Mobile top bar */}
            <MobileTopBar onToggle={() => setSidebarOpen((v) => !v)} />

            {/* Page content */}
            <div className="h-full pt-12 lg:pt-0">
              <ActiveSection />
            </div>

            {/* Bottom page indicator */}
            <div className="absolute bottom-3 right-4 z-20 flex items-center gap-2">
              <button
                onClick={() => goTo(activeIdx - 1)}
                disabled={activeIdx === 0}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-20 flex items-center justify-center text-white/50 text-xs transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                ▲
              </button>
              <span className="text-[10px] text-white/30 font-mono tabular-nums min-w-[3rem] text-center">
                {activeIdx + 1} / {SECTION_IDS.length}
              </span>
              <button
                onClick={() => goTo(activeIdx + 1)}
                disabled={activeIdx >= SECTION_IDS.length - 1}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-20 flex items-center justify-center text-white/50 text-xs transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                ▼
              </button>
            </div>

            {/* Login gate — z-50 overlay, shown when user tries to access locked slide */}
            <LoginGate onBack={handleGateBack} />
          </main>
        </div>
      </ActivePageCtx.Provider>
    </PageNavCtx.Provider>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
interface MarketDesignDeckProps {
  isAuthenticated?: boolean;
  userRole?: string;
}

export function MarketDesignDeck({
  isAuthenticated = false,
  userRole,
}: MarketDesignDeckProps) {
  return (
    <DeckAccessProvider
      access="admin"
      previewSlides={DEFAULT_PREVIEW_SLIDES}
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
  );
}
