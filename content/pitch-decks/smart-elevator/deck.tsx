"use client";
import React, { useRef, useCallback, useMemo } from "react";
import { DeckLocaleProvider, DeckAccessProvider, useDeckAccess, LoginGate } from "@/components/pitch-deck";
import type { DeckAccess } from "@/config/pitch-decks";
import { DEFAULT_PREVIEW_SLIDES } from "@/config/pitch-decks";
import { SECTION_IDS, LOCALES, LOCALE_LABELS } from "./constants";
import { usePageNav, PageNavCtx, ActiveSlideCtx } from "./hooks";
import { FloatingNav, SectionDots } from "./nav";
import { HeroSection }          from "./sections/HeroSection";
import { ProblemSection }       from "./sections/ProblemSection";
import { SolutionSection }      from "./sections/SolutionSection";
import { FeaturesSection }      from "./sections/FeaturesSection";
import { AccessControlSection } from "./sections/AccessControlSection";
import { DisplaySection }       from "./sections/DisplaySection";
import { ScheduleSection }      from "./sections/ScheduleSection";
import { EnergySection }        from "./sections/EnergySection";
import { HowWorksSection }      from "./sections/HowWorksSection";
import { ValueSection }         from "./sections/ValueSection";
import { BizModelSection }      from "./sections/BizModelSection";
import { PricingSection }       from "./sections/PricingSection";
import { RoadmapSection }       from "./sections/RoadmapSection";
import { CTASection }           from "./sections/CTASection";

const SECTIONS = [
  HeroSection,
  ProblemSection,
  SolutionSection,
  FeaturesSection,
  AccessControlSection,
  DisplaySection,
  ScheduleSection,
  EnergySection,
  HowWorksSection,
  ValueSection,
  BizModelSection,
  PricingSection,
  RoadmapSection,
  CTASection,
] as const;

const SLIDE_STYLES = `
  .se-slide { position: absolute; inset: 0; overflow: hidden; }
  .se-slide[data-state="idle"] { visibility: hidden; pointer-events: none; z-index: 0; }
  .se-slide[data-state="active"] { z-index: 2; }
  .se-slide[data-state="exiting"] { z-index: 1; pointer-events: none; }
  .se-slide[data-state="active"][data-dir="1"]  { animation: seSlideFromBelow 1.0s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .se-slide[data-state="active"][data-dir="-1"] { animation: seSlideFromAbove 1.0s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .se-slide[data-state="active"][data-dir="0"]  { visibility: visible; }
  .se-slide[data-state="exiting"][data-dir="1"]  { animation: seSlideToAbove 1.0s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .se-slide[data-state="exiting"][data-dir="-1"] { animation: seSlideToBelow 1.0s cubic-bezier(0.22, 1, 0.36, 1) both; }
  @keyframes seSlideFromBelow { from { transform: translateY(100%);  } to { transform: translateY(0); } }
  @keyframes seSlideFromAbove { from { transform: translateY(-100%); } to { transform: translateY(0); } }
  @keyframes seSlideToAbove   { from { transform: translateY(0); }    to { transform: translateY(-100%); } }
  @keyframes seSlideToBelow   { from { transform: translateY(0); }    to { transform: translateY(100%);  } }
  .se-slide[data-state="active"][data-dir="1"]  .mi-child,
  .se-slide[data-state="active"][data-dir="-1"] .mi-child {
    animation: miChildIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .se-slide[data-state="active"] .mi-child:nth-child(1) { animation-delay: 0.20s; }
  .se-slide[data-state="active"] .mi-child:nth-child(2) { animation-delay: 0.28s; }
  .se-slide[data-state="active"] .mi-child:nth-child(3) { animation-delay: 0.36s; }
  .se-slide[data-state="active"] .mi-child:nth-child(4) { animation-delay: 0.44s; }
  .se-slide[data-state="active"] .mi-child:nth-child(5) { animation-delay: 0.52s; }
  .se-slide[data-state="active"] .mi-child:nth-child(6) { animation-delay: 0.60s; }
  @keyframes miChildIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .se-slide h1 { font-size: clamp(1.25rem, 2vw + 0.5rem, 3.5rem); }
  .se-slide h2 { font-size: clamp(1.15rem, 1.8vw + 0.4rem, 2.5rem); }
  .se-slide h3 { font-size: clamp(0.8rem, 0.9vw + 0.3rem, 1.25rem); }
  .se-slide > section { max-height: 100dvh; max-height: 100vh; }
  .se-slide[data-state="active"] { overflow-y: auto; overflow-x: hidden; scrollbar-width: none; }
  .se-slide[data-state="active"]::-webkit-scrollbar { display: none; }
  @media (max-height: 750px) {
    .se-slide section { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .se-slide h2 { font-size: clamp(1rem, 1.4vw + 0.35rem, 1.75rem); }
    .se-slide p  { font-size: clamp(0.7rem, 0.65vw + 0.3rem, 0.95rem); }
  }
  @media (min-height: 900px) {
    .se-slide section { padding-top: 1.5rem; padding-bottom: 1.5rem; }
  }
  @media (min-width: 1600px) {
    .se-slide section > div { padding-left: 2.5rem; padding-right: 2.5rem; }
  }
`;

function SmartElevatorDeckInner() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { canView, showGate, previewSlides } = useDeckAccess();
  const navOptions = useMemo(() => ({ canView, onGated: showGate }), [canView, showGate]);
  const { activeIdx, exitingIdx, direction, goTo } = usePageNav(rootRef, navOptions);
  const handleGateBack = useCallback(() => { goTo(previewSlides - 1); }, [goTo, previewSlides]);

  return (
    <div ref={rootRef} className="pitch-deck-page h-full w-full overflow-hidden relative bg-d-bg text-d-fg"
      tabIndex={-1} style={{ outline: "none", touchAction: "none" }}>
      <style>{SLIDE_STYLES}</style>
      <FloatingNav pastHero={activeIdx > 0} />
      <SectionDots activeIdx={activeIdx} goTo={goTo} />
      <ActiveSlideCtx.Provider value={activeIdx}>
        <PageNavCtx.Provider value={goTo}>
          {SECTIONS.map((Section, idx) => {
            const isActive = idx === activeIdx;
            const isExiting = idx === exitingIdx;
            const state = isActive ? "active" : isExiting ? "exiting" : "idle";
            return (
              <div key={SECTION_IDS[idx]} className="se-slide" data-state={state}
                data-dir={isActive || isExiting ? String(direction) : "0"}>
                <Section />
              </div>
            );
          })}
        </PageNavCtx.Provider>
      </ActiveSlideCtx.Provider>
      <LoginGate onBack={handleGateBack} />
    </div>
  );
}

interface SmartElevatorDeckProps {
  access?: DeckAccess;
  previewSlides?: number;
  isAuthenticated?: boolean;
  userRole?: string;
}

export function SmartElevatorDeck({ access = "public", previewSlides = DEFAULT_PREVIEW_SLIDES, isAuthenticated = false, userRole }: SmartElevatorDeckProps = {}) {
  return (
    <DeckAccessProvider access={access} previewSlides={previewSlides} totalSlides={SECTIONS.length}
      serverAuth={isAuthenticated ? { isAuthenticated: true, role: userRole } : undefined}>
      <DeckLocaleProvider availableLocales={[...LOCALES]} localeLabels={LOCALE_LABELS} defaultLocale="zh">
        <SmartElevatorDeckInner />
      </DeckLocaleProvider>
    </DeckAccessProvider>
  );
}
