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
import { HeroSection } from "./sections/HeroSection";
import { RoleSection } from "./sections/RoleSection";
import { StructureSection } from "./sections/StructureSection";
import { DesignSection } from "./sections/DesignSection";
import { ComponentsSection } from "./sections/ComponentsSection";
import { BootstrapSection } from "./sections/BootstrapSection";
import { WorkflowSection } from "./sections/WorkflowSection";
import { CTASection } from "./sections/CTASection";

const SECTIONS = [
  HeroSection,
  RoleSection,
  StructureSection,
  DesignSection,
  ComponentsSection,
  BootstrapSection,
  WorkflowSection,
  CTASection,
] as const;

// ─── Inner deck ───────────────────────────────────────────────────────────────
function PitchDeckAgentInner() {
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
        <div
          className={`pitch-deck-page h-full w-full flex ${t.bg} ${t.text} overflow-hidden transition-colors duration-300`}
        >
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
                className={`w-9 h-9 rounded-full ${t.cardBg} ${
                  theme === "dark"
                    ? "hover:bg-white/10"
                    : "hover:bg-[#DBD3ED]"
                } disabled:opacity-20 flex items-center justify-center ${t.body} text-sm transition-all cursor-pointer disabled:cursor-not-allowed`}
              >
                ▲
              </button>
              <span
                className={`text-xs ${t.muted} font-mono tabular-nums min-w-[3rem] text-center`}
              >
                {activeIdx + 1} / {SECTION_IDS.length}
              </span>
              <button
                onClick={() => goTo(activeIdx + 1)}
                disabled={activeIdx >= SECTION_IDS.length - 1}
                className={`w-9 h-9 rounded-full ${t.cardBg} ${
                  theme === "dark"
                    ? "hover:bg-white/10"
                    : "hover:bg-[#DBD3ED]"
                } disabled:opacity-20 flex items-center justify-center ${t.body} text-sm transition-all cursor-pointer disabled:cursor-not-allowed`}
              >
                ▼
              </button>
            </div>

            {/* Login gate */}
            <LoginGate onBack={handleGateBack} locale={deckLocale} />
          </main>
        </div>
      </ActivePageCtx.Provider>
    </PageNavCtx.Provider>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
interface PitchDeckAgentProps {
  access?: DeckAccess;
  previewSlides?: number;
  isAuthenticated?: boolean;
  userRole?: string;
}

export function PitchDeckAgentDeck({
  access = "public",
  previewSlides = DEFAULT_PREVIEW_SLIDES,
  isAuthenticated = false,
  userRole,
}: PitchDeckAgentProps) {
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
          <PitchDeckAgentInner />
        </DeckLocaleProvider>
      </DeckAccessProvider>
    </DeckThemeProvider>
  );
}
