"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  DeckLocaleProvider,
  DeckAccessProvider,
  useDeckAccess,
  useDeckLocale,
} from "@/components/pitch-deck";
import { Sidebar, TopControls, MobileTopBar } from "./nav";
import { DEFAULT_PREVIEW_SLIDES } from "@/config/pitch-decks";
import type { DeckAccess } from "@/config/pitch-decks";
import { SECTION_IDS, LOCALES, LOCALE_LABELS, THEME } from "./constants";
import { usePageNav, useContent, PageNavCtx, ActivePageCtx } from "./hooks";
import { DeckThemeProvider, useDeckTheme } from "./theme";
import {
  OverviewSection,
  ProductArchSection,
  PortalArchSection,
  BackSection,
} from "./sections/index";

const SECTIONS = [
  OverviewSection,
  ProductArchSection,
  PortalArchSection,
  BackSection,
] as const;

const SECTION_META: { icon: string; key: string }[] = [
  { icon: "🏗️", key: "overview" },
  { icon: "📦", key: "product-arch" },
  { icon: "🚪", key: "portal-arch" },
  { icon: "↩️", key: "back" },
];

function ArchitectureDeepdiveDeckInner() {
  const c = useContent();
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

  const ActiveSection = SECTIONS[activeIdx];

  return (
    <PageNavCtx.Provider value={goTo}>
      <ActivePageCtx.Provider value={activeIdx}>
        <div className={`pitch-deck-page h-full w-full flex ${t.bg} ${t.text} overflow-hidden transition-colors duration-300`}>
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="flex-1 h-full overflow-hidden relative">
            <MobileTopBar
              onToggle={() => setSidebarOpen((v) => !v)}
            />
            <TopControls />
            <div className="h-full pt-14 lg:pt-0">
              <ActiveSection />
            </div>
            <div className="absolute bottom-4 right-5 z-20 flex items-center gap-3">
              <button
                onClick={() => goTo(activeIdx - 1)}
                disabled={activeIdx === 0}
                className={`w-9 h-9 rounded-full ${t.cardBg} ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-[#DBD3ED]"} disabled:opacity-20 flex items-center justify-center ${t.body} text-sm transition-all cursor-pointer disabled:cursor-not-allowed`}
              >
                ▲
              </button>
              <span className={`text-xs ${t.muted} font-mono tabular-nums min-w-12 text-center`}>
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
          </main>
        </div>
      </ActivePageCtx.Provider>
    </PageNavCtx.Provider>
  );
}

interface ArchitectureDeepdiveDeckProps {
  access?: DeckAccess;
  previewSlides?: number;
  isAuthenticated?: boolean;
  userRole?: string;
}

export function ArchitectureDeepdiveDeck({
  access = "public",
  previewSlides = DEFAULT_PREVIEW_SLIDES,
  isAuthenticated = false,
  userRole,
}: ArchitectureDeepdiveDeckProps) {
  return (
    <DeckThemeProvider>
      <DeckAccessProvider
        access={access}
        previewSlides={previewSlides}
        totalSlides={SECTIONS.length}
        serverAuth={{ isAuthenticated, role: userRole }}
      >
      <DeckLocaleProvider
        availableLocales={[...LOCALES]}
        localeLabels={LOCALE_LABELS}
      >
        <ArchitectureDeepdiveDeckInner />
      </DeckLocaleProvider>
    </DeckAccessProvider>
    </DeckThemeProvider>
  );
}
