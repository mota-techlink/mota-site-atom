"use client";

import React, { useRef, useCallback, useMemo } from "react";
import {
  DeckLocaleProvider,
  DeckAccessProvider,
  useDeckAccess,
  LoginGate,
} from "@/components/pitch-deck";
import type { DeckAccess } from "@/config/pitch-decks";
import { DEFAULT_PREVIEW_SLIDES } from "@/config/pitch-decks";
import { SECTION_IDS, LOCALES, LOCALE_LABELS } from "./constants";
import { usePageNav, PageNavCtx, ActiveSlideCtx } from "./hooks";
import { FloatingNav, SectionDots } from "./nav";
import { HeroSection } from "./sections/HeroSection";
import { ProblemSection } from "./sections/ProblemSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { PlatformsSection } from "./sections/PlatformsSection";
import { PricingSection } from "./sections/PricingSection";
import { TopupSection } from "./sections/TopupSection";
import { DashboardSection } from "./sections/DashboardSection";
import { BillingSection } from "./sections/BillingSection";
import { TaskDetailSection } from "./sections/TaskDetailSection";
import { CreatorPartnerSection } from "./sections/CreatorPartnerSection";
import { EarlyBirdSection } from "./sections/EarlyBirdSection";
import { WhyMotaSection } from "./sections/WhyMotaSection";
import { CTASection } from "./sections/CTASection";

// ─── Section component list (index matches SECTION_IDS) ──────────────────────
const SECTIONS = [
  HeroSection,
  ProblemSection,
  HowItWorksSection,
  PlatformsSection,
  PricingSection,
  TopupSection,
  DashboardSection,
  BillingSection,
  TaskDetailSection,
  CreatorPartnerSection,
  EarlyBirdSection,
  WhyMotaSection,
  CTASection,
] as const;

// ─── Slide transition styles ──────────────────────────────────────────────────
const SLIDE_STYLES = `
  /* Each slide is full-size and stacked absolutely */
  .mi-slide {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  /* Idle slides are invisible, non-interactive, and behind everything */
  .mi-slide[data-state="idle"] {
    visibility: hidden;
    pointer-events: none;
    z-index: 0;
  }

  /* Active slide always renders on top to prevent ghost bleed-through */
  .mi-slide[data-state="active"] {
    z-index: 2;
  }
  /* Exiting slide sits below the entering slide */
  .mi-slide[data-state="exiting"] {
    z-index: 1;
    pointer-events: none;
  }

  /* ── Entering slides ─────────────────────────────────── */
  /* Forward nav (↓): new page slides up from below */
  .mi-slide[data-state="active"][data-dir="1"] {
    animation: miSlideFromBelow 1.0s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  /* Backward nav (↑): new page slides down from above */
  .mi-slide[data-state="active"][data-dir="-1"] {
    animation: miSlideFromAbove 1.0s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  /* Initial page load — visible with no motion */
  .mi-slide[data-state="active"][data-dir="0"] {
    visibility: visible;
  }

  /* ── Exiting slides ──────────────────────────────────── */
  /* Forward nav: old page slides out to top */
  .mi-slide[data-state="exiting"][data-dir="1"] {
    animation: miSlideToAbove 1.0s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  /* Backward nav: old page slides out to bottom */
  .mi-slide[data-state="exiting"][data-dir="-1"] {
    animation: miSlideToBelow 1.0s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes miSlideFromBelow {
    from { transform: translateY(100%); }
    to   { transform: translateY(0);    }
  }
  @keyframes miSlideFromAbove {
    from { transform: translateY(-100%); }
    to   { transform: translateY(0);     }
  }
  @keyframes miSlideToAbove {
    from { transform: translateY(0);    }
    to   { transform: translateY(-100%); }
  }
  @keyframes miSlideToBelow {
    from { transform: translateY(0);   }
    to   { transform: translateY(100%); }
  }

  /* ── Content stagger on slide entry ─────────────────── */
  .mi-slide[data-state="active"][data-dir="1"]  .mi-child,
  .mi-slide[data-state="active"][data-dir="-1"] .mi-child {
    animation: miChildIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .mi-slide[data-state="active"] .mi-child:nth-child(1) { animation-delay: 0.20s; }
  .mi-slide[data-state="active"] .mi-child:nth-child(2) { animation-delay: 0.28s; }
  .mi-slide[data-state="active"] .mi-child:nth-child(3) { animation-delay: 0.36s; }
  .mi-slide[data-state="active"] .mi-child:nth-child(4) { animation-delay: 0.44s; }
  .mi-slide[data-state="active"] .mi-child:nth-child(5) { animation-delay: 0.52s; }
  .mi-slide[data-state="active"] .mi-child:nth-child(6) { animation-delay: 0.60s; }

  @keyframes miChildIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  /* ── Viewport-adaptive typography ───────────────────── */
  /* Scale text smoothly between mobile and large desktop  */
  .mi-slide h1 { font-size: clamp(1.25rem, 2vw + 0.5rem, 3.5rem); }
  .mi-slide h2 { font-size: clamp(1.15rem, 1.8vw + 0.4rem, 2.5rem); }
  .mi-slide h3 { font-size: clamp(0.8rem, 0.9vw + 0.3rem, 1.25rem); }

  /* ── Viewport-adaptive spacing ──────────────────────── */
  /* Margins / gaps shrink on shorter viewports            */
  .mi-slide section .mb-auto-vh { margin-bottom: clamp(0.5rem, 1.5vh, 2.5rem); }

  /* Ensure slide content fits within safe area on all viewports */
  .mi-slide > section {
    max-height: 100dvh;
    max-height: 100vh; /* fallback */
  }

  /* Allow active slides to scroll gracefully on short viewports */
  .mi-slide[data-state="active"] {
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;  /* Firefox */
  }
  .mi-slide[data-state="active"]::-webkit-scrollbar { display: none; }

  /* ── Short-viewport compaction (≤ 750px tall) ───────── */
  @media (max-height: 750px) {
    .mi-slide section { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .mi-slide h2 { font-size: clamp(1rem, 1.4vw + 0.35rem, 1.75rem); }
    .mi-slide p  { font-size: clamp(0.7rem, 0.65vw + 0.3rem, 0.95rem); }
  }

  /* ── Comfortable-viewport (≥ 900px tall, e.g. 1920×1080) ── */
  @media (min-height: 900px) {
    .mi-slide section { padding-top: 1.5rem; padding-bottom: 1.5rem; }
  }

  /* ── Wide-viewport horizontal padding (≥ 1600px) ───── */
  @media (min-width: 1600px) {
    .mi-slide section > div { padding-left: 2.5rem; padding-right: 2.5rem; }
  }
`;

// ─── Root deck inner ──────────────────────────────────────────────────────────
function MarketIntelDeckInner() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { canView, showGate, previewSlides } = useDeckAccess();

  // Stable options object for usePageNav
  const navOptions = useMemo(
    () => ({ canView, onGated: showGate }),
    [canView, showGate],
  );

  const { activeIdx, exitingIdx, direction, goTo } = usePageNav(
    rootRef,
    navOptions,
  );

  // Callback to go back to last preview slide when dismissing the gate
  const handleGateBack = useCallback(() => {
    goTo(previewSlides - 1);
  }, [goTo, previewSlides]);

  return (
    <div
      ref={rootRef}
      className="h-full w-full overflow-hidden relative bg-d-bg text-d-fg"
      tabIndex={-1}
      style={{ outline: "none", touchAction: "none" }}
    >
      <style>{SLIDE_STYLES}</style>

      {/* Fixed chrome — always on top of slides */}
      <FloatingNav pastHero={activeIdx > 0} />
      <SectionDots activeIdx={activeIdx} goTo={goTo} />

      {/* Slides — absolutely stacked; only active + exiting are visible */}
      <ActiveSlideCtx.Provider value={activeIdx}>
        <PageNavCtx.Provider value={goTo}>
          {SECTIONS.map((Section, idx) => {
            const isActive = idx === activeIdx;
            const isExiting = idx === exitingIdx;
            const state: "active" | "exiting" | "idle" = isActive
              ? "active"
              : isExiting
              ? "exiting"
              : "idle";

            return (
              <div
                key={SECTION_IDS[idx]}
                className="mi-slide"
                data-state={state}
                data-dir={isActive || isExiting ? String(direction) : "0"}
              >
                <Section />
              </div>
            );
          })}
        </PageNavCtx.Provider>
      </ActiveSlideCtx.Provider>

      {/* Login gate — z-50, rendered when user hits a restricted slide */}
      <LoginGate onBack={handleGateBack} />
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
interface MarketIntelDeckProps {
  /** Access level from meta.json — defaults to "public" for this deck */
  access?: DeckAccess;
  /** Number of preview slides — defaults to DEFAULT_PREVIEW_SLIDES (3) */
  previewSlides?: number;
  /** Server-side auth hint (passed from page.tsx) */
  isAuthenticated?: boolean;
  /** Server-side user role hint */
  userRole?: string;
}

export function MarketIntelDeck({
  access = "public",
  previewSlides = DEFAULT_PREVIEW_SLIDES,
  isAuthenticated = false,
  userRole,
}: MarketIntelDeckProps = {}) {
  return (
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
        <MarketIntelDeckInner />
      </DeckLocaleProvider>
    </DeckAccessProvider>
  );
}

