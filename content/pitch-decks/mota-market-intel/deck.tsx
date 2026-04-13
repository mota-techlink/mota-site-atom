"use client";

import React, { useRef } from "react";
import { DeckLocaleProvider } from "@/components/pitch-deck";
import { SECTION_IDS, LOCALES, LOCALE_LABELS } from "./constants";
import { usePageNav, PageNavCtx } from "./hooks";
import { FloatingNav, SectionDots } from "./nav";
import { HeroSection } from "./sections/HeroSection";
import { ProblemSection } from "./sections/ProblemSection";
import { HowItWorksSection } from "./sections/HowItWorksSection";
import { PlatformsSection } from "./sections/PlatformsSection";
import { PricingSection } from "./sections/PricingSection";
import { TopupSection } from "./sections/TopupSection";
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
`;

// ─── Root deck inner ──────────────────────────────────────────────────────────
function MarketIntelDeckInner() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { activeIdx, exitingIdx, direction, goTo } = usePageNav(rootRef);

  return (
    <div
      ref={rootRef}
      className="h-full w-full overflow-hidden relative bg-black text-white"
      tabIndex={-1}
      style={{ outline: "none" }}
    >
      <style>{SLIDE_STYLES}</style>

      {/* Fixed chrome — always on top of slides */}
      <FloatingNav pastHero={activeIdx > 0} />
      <SectionDots activeIdx={activeIdx} goTo={goTo} />

      {/* Slides — absolutely stacked; only active + exiting are visible */}
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
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
export function MarketIntelDeck() {
  return (
    <DeckLocaleProvider
      availableLocales={[...LOCALES]}
      localeLabels={LOCALE_LABELS}
    >
      <MarketIntelDeckInner />
    </DeckLocaleProvider>
  );
}

