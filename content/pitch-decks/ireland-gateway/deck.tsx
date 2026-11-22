"use client";

import React, { useRef, useMemo } from "react";
import {
  DeckLocaleProvider,
  DeckAccessProvider,
  LoginGate,
} from "@/components/pitch-deck";
import type { DeckAccess } from "@/config/pitch-decks";
import { DEFAULT_PREVIEW_SLIDES } from "@/config/pitch-decks";
import { SECTION_IDS, LOCALES, LOCALE_LABELS, DEFAULT_LOCALE } from "./constants";
import { usePageNav, ActiveSlideCtx, PageNavCtx } from "./hooks";
import { FloatingNav, SectionDots, ProgressRail } from "./nav";
import {
  HeroSection,
  WhySection,
  PlatformSection,
  TaxSection,
  WaterfordSection,
  SectorsSection,
  FoodSection,
  MedicalSection,
  ColdSection,
  ConstructionSection,
  CasesSection,
  ComplianceSection,
  RiskSection,
  ElmsflowSection,
  CtaSection,
} from "./sections";

// ─── Section component list (index matches SECTION_IDS) ──────────────────────
const SECTIONS = [
  HeroSection,
  WhySection,
  PlatformSection,
  TaxSection,
  WaterfordSection,
  SectorsSection,
  FoodSection,
  MedicalSection,
  ColdSection,
  ConstructionSection,
  CasesSection,
  ComplianceSection,
  RiskSection,
  ElmsflowSection,
  CtaSection,
] as const;

// ─── Deck styles ──────────────────────────────────────────────────────────────
const DECK_STYLES = `
  .ig-slide {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .ig-slide[data-state="idle"] {
    visibility: hidden;
    pointer-events: none;
    z-index: 0;
  }

  .ig-slide[data-state="active"] { z-index: 2; }
  .ig-slide[data-state="exiting"] { z-index: 1; pointer-events: none; }

  .ig-slide[data-state="active"][data-dir="1"] {
    animation: igFromBelow 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .ig-slide[data-state="active"][data-dir="-1"] {
    animation: igFromAbove 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .ig-slide[data-state="active"][data-dir="0"] { visibility: visible; }

  .ig-slide[data-state="exiting"][data-dir="1"] {
    animation: igToAbove 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .ig-slide[data-state="exiting"][data-dir="-1"] {
    animation: igToBelow 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes igFromBelow { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes igFromAbove { from { transform: translateY(-100%); } to { transform: translateY(0); } }
  @keyframes igToAbove   { from { transform: translateY(0); } to { transform: translateY(-100%); } }
  @keyframes igToBelow   { from { transform: translateY(0); } to { transform: translateY(100%); } }

  /* Content stagger on entry */
  .ig-slide[data-state="active"] .ig-child {
    animation: igChildIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  @keyframes igChildIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Inner scrolling inside a tall section stays hidden from view */
  .scrollbar-none { scrollbar-width: none; -ms-overflow-style: none; }
  .scrollbar-none::-webkit-scrollbar { display: none; }

  .ig-slide > section { max-height: 100dvh; max-height: 100vh; }

  @media (max-height: 760px) {
    .ig-slide section > div { padding-top: 3.5rem; padding-bottom: 3rem; }
  }
`;

// ─── Ambient background ───────────────────────────────────────────────────────
function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-40 -left-32 w-[38rem] h-[38rem] rounded-full bg-emerald-500/[0.10] blur-[120px]" />
      <div className="absolute top-1/3 -right-40 w-[34rem] h-[34rem] rounded-full bg-cyan-500/[0.08] blur-[120px]" />
      <div className="absolute -bottom-48 left-1/4 w-[32rem] h-[32rem] rounded-full bg-indigo-500/[0.07] blur-[130px]" />
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}

// ─── Root deck inner ──────────────────────────────────────────────────────────
function IrelandGatewayDeckInner() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { activeIdx, exitingIdx, direction, goTo } = usePageNav(rootRef);
  const navCtx = useMemo(() => goTo, [goTo]);

  return (
    <div
      ref={rootRef}
      className="pitch-deck-page h-full w-full overflow-hidden relative bg-[#05080F] text-white"
      tabIndex={-1}
      style={{ outline: "none" }}
    >
      <style>{DECK_STYLES}</style>

      <AmbientBackground />

      <FloatingNav pastHero={activeIdx > 0} />
      <SectionDots activeIdx={activeIdx} goTo={goTo} />
      <ProgressRail activeIdx={activeIdx} />

      <ActiveSlideCtx.Provider value={activeIdx}>
        <PageNavCtx.Provider value={navCtx}>
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
                className="ig-slide"
                data-state={state}
                data-dir={isActive || isExiting ? String(direction) : "0"}
              >
                <Section />
              </div>
            );
          })}
        </PageNavCtx.Provider>
      </ActiveSlideCtx.Provider>

      <LoginGate onBack={() => goTo(Math.max(0, SECTION_IDS.length - 1))} />
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
interface IrelandGatewayDeckProps {
  access?: DeckAccess;
  previewSlides?: number;
  isAuthenticated?: boolean;
  userRole?: string;
}

export function IrelandGatewayDeck({
  access = "public",
  previewSlides = DEFAULT_PREVIEW_SLIDES,
  isAuthenticated = false,
  userRole,
}: IrelandGatewayDeckProps = {}) {
  return (
    <DeckAccessProvider
      access={access}
      previewSlides={previewSlides}
      totalSlides={SECTIONS.length}
      serverAuth={
        isAuthenticated ? { isAuthenticated: true, role: userRole } : undefined
      }
    >
      <DeckLocaleProvider
        availableLocales={[...LOCALES]}
        localeLabels={LOCALE_LABELS}
        defaultLocale={DEFAULT_LOCALE}
      >
        <IrelandGatewayDeckInner />
      </DeckLocaleProvider>
    </DeckAccessProvider>
  );
}
