"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  DeckLocaleProvider,
  DeckAccessProvider,
  useDeckAccess,
  useDeckLocale,
} from "@/components/pitch-deck";
import { DEFAULT_PREVIEW_SLIDES } from "@/config/pitch-decks";
import type { DeckAccess } from "@/config/pitch-decks";
import { SECTION_IDS, LOCALES, LOCALE_LABELS, THEME } from "./constants";
import { usePageNav, PageNavCtx, ActivePageCtx, useContent } from "./hooks";
import { DeckThemeProvider, useDeckTheme } from "./theme";
import { Sidebar, MobileTopBar, TopControls } from "./nav";
import {
  OverviewSection,
  OpportunitySection,
  ProcessSection,
  CampusSection,
  DeliverySection,
  EmploymentSection,
  CloseSection,
} from "./sections";

const SECTIONS = [
  OverviewSection,
  OpportunitySection,
  ProcessSection,
  CampusSection,
  DeliverySection,
  EmploymentSection,
  CloseSection,
] as const;

const SECTION_META = [
  { icon: "◉", key: "overview" },
  { icon: "▣", key: "opportunity" },
  { icon: "→", key: "process" },
  { icon: "⌂", key: "campus" },
  { icon: "◆", key: "delivery" },
  { icon: "◎", key: "employment" },
  { icon: "★", key: "close" },
];

function WaterfoldDeckInner() {
  const c = useContent();
  const { canView, showGate, previewSlides } = useDeckAccess();
  const { theme } = useDeckTheme();
  const t = THEME[theme];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navOptions = useMemo(() => ({ canView, onGated: showGate }), [canView, showGate]);
  const { activeIdx, goTo } = usePageNav(navOptions);
  const ActiveSection = SECTIONS[activeIdx];
  const handleGateBack = useCallback(() => goTo(previewSlides - 1), [goTo, previewSlides]);

  return (
    <PageNavCtx.Provider value={goTo}>
        <ActivePageCtx.Provider value={activeIdx}>
          <div className={`pitch-deck-page h-full w-full flex ${t.bg} ${t.text} overflow-hidden transition-colors duration-300`}>
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <main className="flex-1 h-full overflow-hidden relative">
              <MobileTopBar onToggle={() => setSidebarOpen((v) => !v)} />
              <TopControls />
              <div className="h-full pt-14 lg:pt-0"><ActiveSection /></div>
              <div className="absolute bottom-4 right-5 z-20 flex items-center gap-3">
                <button onClick={() => goTo(activeIdx - 1)} disabled={activeIdx === 0} className={`w-9 h-9 rounded-full ${t.cardBg} hover:bg-white/10 disabled:opacity-20 flex items-center justify-center ${t.body} text-sm transition-all cursor-pointer disabled:cursor-not-allowed`} aria-label="Previous slide">▲</button>
                <span className={`text-xs ${t.muted} font-mono tabular-nums min-w-[3rem] text-center`}>{activeIdx + 1} / {SECTION_IDS.length}</span>
                <button onClick={() => goTo(activeIdx + 1)} disabled={activeIdx >= SECTION_IDS.length - 1} className={`w-9 h-9 rounded-full ${t.cardBg} hover:bg-white/10 disabled:opacity-20 flex items-center justify-center ${t.body} text-sm transition-all cursor-pointer disabled:cursor-not-allowed`} aria-label="Next slide">▼</button>
              </div>
            </main>
          </div>
        </ActivePageCtx.Provider>
      </PageNavCtx.Provider>
  );
}

interface WaterfoldDeckProps {
  access?: DeckAccess;
  previewSlides?: number;
  isAuthenticated?: boolean;
  userRole?: string;
}

export function WaterfoldDeck({ access = "public", previewSlides = DEFAULT_PREVIEW_SLIDES, isAuthenticated = false, userRole }: WaterfoldDeckProps) {
  return (
    <DeckThemeProvider>
      <DeckAccessProvider
        access={access}
        previewSlides={previewSlides}
        totalSlides={SECTIONS.length}
        serverAuth={isAuthenticated ? { isAuthenticated: true, role: userRole } : undefined}
      >
        <DeckLocaleProvider availableLocales={[...LOCALES]} localeLabels={LOCALE_LABELS}>
          <WaterfoldDeckInner />
        </DeckLocaleProvider>
      </DeckAccessProvider>
    </DeckThemeProvider>
  );
}
