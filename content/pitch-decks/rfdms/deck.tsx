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
import { DynamicBackground } from "./sections/DynamicBackground";

// ─── Lazy section imports ─────────────────────────────────────────────────────
import { HeroSection } from "./sections/HeroSection";
import { ProblemSection } from "./sections/ProblemSection";
import { SolutionSection } from "./sections/SolutionSection";
import { ConsortiumSection } from "./sections/ConsortiumSection";
import { BlueprintSection } from "./sections/BlueprintSection";
import { GlobalReachSection } from "./sections/GlobalReachSection";
import { CompetitiveSection } from "./sections/CompetitiveSection";
import { SecuritySection } from "./sections/SecuritySection";
import { PricingSection } from "./sections/PricingSection";
import { RoadmapSection } from "./sections/RoadmapSection";
import { CTASection } from "./sections/CTASection";

// ─── Section component list (index matches SECTION_IDS) ──────────────────────
const SECTIONS = [
  HeroSection,
  ProblemSection,
  SolutionSection,
  ConsortiumSection,
  BlueprintSection,
  GlobalReachSection,
  CompetitiveSection,
  SecuritySection,
  PricingSection,
  RoadmapSection,
  CTASection,
] as const;

// ─── Slide transition styles ──────────────────────────────────────────────────
const SLIDE_STYLES = `
  /* Each slide is full-size and stacked absolutely */
  .ei-slide {
    position: absolute;
    inset: 0;
    overflow: hidden;
    will-change: transform, opacity;
  }

  /* Idle slides are invisible, non-interactive, and behind everything */
  .ei-slide[data-state="idle"] {
    visibility: hidden;
    pointer-events: none;
    z-index: 0;
  }

  /* Active slide always renders on top */
  .ei-slide[data-state="active"] {
    z-index: 2;
  }
  /* Exiting slide below entering */
  .ei-slide[data-state="exiting"] {
    z-index: 1;
    pointer-events: none;
  }

  /* ── Entering slides ─────────────────────────────────── */
  .ei-slide[data-state="active"][data-dir="1"] {
    animation: eiSlideFromBelow 1.0s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .ei-slide[data-state="active"][data-dir="-1"] {
    animation: eiSlideFromAbove 1.0s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .ei-slide[data-state="active"][data-dir="0"] {
    visibility: visible;
  }

  /* ── Exiting slides ──────────────────────────────────── */
  .ei-slide[data-state="exiting"][data-dir="1"] {
    animation: eiSlideToAbove 1.0s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .ei-slide[data-state="exiting"][data-dir="-1"] {
    animation: eiSlideToBelow 1.0s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  /* Opacity fade on the first/last few frames to mask any 1-frame positional flash */
  @keyframes eiSlideFromBelow {
    from { transform: translateY(100%); opacity: 0; }
    8%   { opacity: 1; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes eiSlideFromAbove {
    from { transform: translateY(-100%); opacity: 0; }
    8%   { opacity: 1; }
    to   { transform: translateY(0);     opacity: 1; }
  }
  @keyframes eiSlideToAbove {
    from { transform: translateY(0);     opacity: 1; }
    92%  { opacity: 1; }
    to   { transform: translateY(-100%); opacity: 0; }
  }
  @keyframes eiSlideToBelow {
    from { transform: translateY(0);    opacity: 1; }
    92%  { opacity: 1; }
    to   { transform: translateY(100%); opacity: 0; }
  }

  /* ── Content stagger on slide entry ─────────────────── */
  .ei-slide[data-state="active"][data-dir="1"]  .ei-child,
  .ei-slide[data-state="active"][data-dir="-1"] .ei-child {
    animation: eiChildIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .ei-slide[data-state="active"] .ei-child:nth-child(1) { animation-delay: 0.20s; }
  .ei-slide[data-state="active"] .ei-child:nth-child(2) { animation-delay: 0.28s; }
  .ei-slide[data-state="active"] .ei-child:nth-child(3) { animation-delay: 0.36s; }
  .ei-slide[data-state="active"] .ei-child:nth-child(4) { animation-delay: 0.44s; }
  .ei-slide[data-state="active"] .ei-child:nth-child(5) { animation-delay: 0.52s; }
  .ei-slide[data-state="active"] .ei-child:nth-child(6) { animation-delay: 0.60s; }

  @keyframes eiChildIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  /* ── Viewport-adaptive spacing ──────────────────────── */
  .ei-slide section .mb-auto-vh { margin-bottom: clamp(0.5rem, 1.5vh, 2.5rem); }

  .ei-slide > section {
    max-height: 100dvh;
    max-height: 100vh;
  }

  .ei-slide[data-state="active"] {
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }
  .ei-slide[data-state="active"]::-webkit-scrollbar { display: none; }

  /* ── Short-viewport compaction (≤ 750px tall) ───────── */
  @media (max-height: 750px) {
    .ei-slide section { padding-top: 0.5rem; padding-bottom: 0.5rem; }
  }

  @media (min-height: 900px) {
    .ei-slide section { padding-top: 1.5rem; padding-bottom: 1.5rem; }
  }

  @media (min-width: 1600px) {
    .ei-slide section > div { padding-left: 2.5rem; padding-right: 2.5rem; }
  }

  /* ── 2K+ screens (native 2560×1440 or 4K at 150%) ──── */
  @media (min-width: 2200px) {
    .ei-slide section > div {
      padding-left: 4rem; padding-right: 4rem;
      max-width: min(90vw, 1800px);
      margin-left: auto; margin-right: auto;
    }
  }

  /* ── Native 4K screens (3840×2160 at 100% scale) ───── */
  @media (min-width: 3200px) {
    .ei-slide section > div {
      padding-left: 6rem; padding-right: 6rem;
      max-width: min(80vw, 2600px);
    }
  }

  /* ── Tall 4K viewports (≥1600px height) ─────────────── */
  @media (min-height: 1600px) {
    .ei-slide section { padding-top: 3rem; padding-bottom: 3rem; }
  }

  /* ── Light theme support ─────────────────────────────── */

  /* ── 1. Text colors — dark text on light bg ── */
  html:not(.dark) .ei-slide .text-white {
    color: #1e293b !important;
  }
  html:not(.dark) .ei-slide [class*="text-white\/"] {
    color: #475569 !important;
  }
  html:not(.dark) .ei-slide .text-slate-300 {
    color: #475569 !important;
  }
  html:not(.dark) .ei-slide .text-slate-400,
  html:not(.dark) .ei-slide .text-slate-500,
  html:not(.dark) .ei-slide .text-slate-600 {
    color: #64748b !important;
  }
  html:not(.dark) .ei-slide .text-slate-700 {
    color: #334155 !important;
  }

  /* ── 2. Accent 300-level text → 700 (unreadable otherwise) ── */
  html:not(.dark) .ei-slide [class*="text-emerald-300"],
  html:not(.dark) .ei-slide [class*="text-green-300"] {
    color: #047857 !important;
  }
  html:not(.dark) .ei-slide [class*="text-cyan-300"] {
    color: #0e7490 !important;
  }
  html:not(.dark) .ei-slide [class*="text-blue-300"] {
    color: #1d4ed8 !important;
  }
  html:not(.dark) .ei-slide [class*="text-violet-300"],
  html:not(.dark) .ei-slide [class*="text-purple-300"] {
    color: #6d28d9 !important;
  }
  html:not(.dark) .ei-slide [class*="text-indigo-300"] {
    color: #4338ca !important;
  }
  html:not(.dark) .ei-slide [class*="text-red-300"],
  html:not(.dark) .ei-slide [class*="text-rose-300"] {
    color: #be123c !important;
  }
  html:not(.dark) .ei-slide [class*="text-amber-300"],
  html:not(.dark) .ei-slide [class*="text-yellow-300"] {
    color: #b45309 !important;
  }

  /* ── 3. Accent 400-level text → 600 ── */
  html:not(.dark) .ei-slide [class*="text-emerald-400"],
  html:not(.dark) .ei-slide [class*="text-green-400"] {
    color: #059669 !important;
  }
  html:not(.dark) .ei-slide [class*="text-cyan-400"],
  html:not(.dark) .ei-slide [class*="text-teal-400"] {
    color: #0891b2 !important;
  }
  html:not(.dark) .ei-slide [class*="text-blue-400"] {
    color: #2563eb !important;
  }
  html:not(.dark) .ei-slide [class*="text-violet-400"],
  html:not(.dark) .ei-slide [class*="text-purple-400"] {
    color: #7c3aed !important;
  }
  html:not(.dark) .ei-slide [class*="text-indigo-400"] {
    color: #4f46e5 !important;
  }
  html:not(.dark) .ei-slide [class*="text-red-400"],
  html:not(.dark) .ei-slide [class*="text-rose-400"] {
    color: #dc2626 !important;
  }
  html:not(.dark) .ei-slide [class*="text-amber-400"],
  html:not(.dark) .ei-slide [class*="text-yellow-400"] {
    color: #d97706 !important;
  }

  /* ── 4. Accent 500-level text (keep readable) ── */
  html:not(.dark) .ei-slide [class*="text-emerald-500"] {
    color: #059669 !important;
  }
  html:not(.dark) .ei-slide [class*="text-red-500"] {
    color: #dc2626 !important;
  }
  html:not(.dark) .ei-slide [class*="text-amber-500"] {
    color: #d97706 !important;
  }

  /* ── 5. Accent 200-level text → 800 ── */
  html:not(.dark) .ei-slide [class*="text-emerald-200"] {
    color: #065f46 !important;
  }
  html:not(.dark) .ei-slide [class*="text-cyan-200"] {
    color: #155e75 !important;
  }

  /* ── 6. Card & surface overrides ── */
  html:not(.dark) .ei-slide [class*="bg-white\/"] {
    background-color: rgba(15,23,42,0.06) !important;
    border-color: rgba(15,23,42,0.08);
  }
  html:not(.dark) .ei-slide [class*="border-white\/"] {
    border-color: rgba(15,23,42,0.12) !important;
  }
  html:not(.dark) .ei-slide .border-dashed[class*="border-white\/"] {
    border-color: rgba(15,23,42,0.18) !important;
  }

  /* ── 7. Accent bg/border overrides for badges & pills ── */
  html:not(.dark) .ei-slide [class*="border-emerald-500"],
  html:not(.dark) .ei-slide [class*="border-emerald-400"] {
    border-color: rgba(5,150,105,0.3) !important;
  }
  html:not(.dark) .ei-slide [class*="bg-emerald-500"],
  html:not(.dark) .ei-slide [class*="bg-emerald-400"] {
    background-color: rgba(5,150,105,0.08) !important;
  }
  html:not(.dark) .ei-slide [class*="border-blue-500"],
  html:not(.dark) .ei-slide [class*="border-blue-400"] {
    border-color: rgba(37,99,235,0.3) !important;
  }
  html:not(.dark) .ei-slide [class*="bg-blue-500"],
  html:not(.dark) .ei-slide [class*="bg-blue-400"] {
    background-color: rgba(37,99,235,0.08) !important;
  }
  html:not(.dark) .ei-slide [class*="border-violet-500"],
  html:not(.dark) .ei-slide [class*="border-violet-400"] {
    border-color: rgba(124,58,237,0.3) !important;
  }
  html:not(.dark) .ei-slide [class*="bg-violet-500"],
  html:not(.dark) .ei-slide [class*="bg-violet-400"] {
    background-color: rgba(124,58,237,0.08) !important;
  }
  html:not(.dark) .ei-slide [class*="border-cyan-500"],
  html:not(.dark) .ei-slide [class*="border-cyan-400"] {
    border-color: rgba(8,145,178,0.3) !important;
  }
  html:not(.dark) .ei-slide [class*="bg-cyan-500"],
  html:not(.dark) .ei-slide [class*="bg-cyan-400"] {
    background-color: rgba(8,145,178,0.08) !important;
  }
  html:not(.dark) .ei-slide [class*="border-red-500"],
  html:not(.dark) .ei-slide [class*="border-red-400"] {
    border-color: rgba(220,38,38,0.3) !important;
  }

  /* ── 8. Backdrop blur surfaces ── */
  html:not(.dark) .ei-slide .backdrop-blur-xl,
  html:not(.dark) .ei-slide .backdrop-blur-md,
  html:not(.dark) .ei-slide .backdrop-blur-sm {
    background-color: rgba(255,255,255,0.7) !important;
    border-color: rgba(15,23,42,0.12) !important;
  }

  /* ── 9. bg-slate card overrides ── */
  html:not(.dark) .ei-slide [class*="bg-slate-900"],
  html:not(.dark) .ei-slide [class*="bg-slate-800"] {
    background-color: rgba(241,245,249,0.7) !important;
  }
  html:not(.dark) .ei-slide [class*="bg-slate-700"] {
    background-color: rgba(226,232,240,0.6) !important;
  }
  html:not(.dark) .ei-slide [class*="border-slate-600"],
  html:not(.dark) .ei-slide [class*="border-slate-700"] {
    border-color: rgba(100,116,139,0.25) !important;
  }

  /* ── 10. SVG fill/stroke overrides ── */
  html:not(.dark) .ei-slide svg text[fill*="255,255,255"] {
    fill: #475569 !important;
  }
  html:not(.dark) .ei-slide svg line[stroke*="255,255,255"] {
    stroke: rgba(71,85,105,0.15) !important;
  }
  html:not(.dark) .ei-slide svg polyline[stroke="#34d399"] {
    stroke: #059669 !important;
  }

  /* ── 11. Shadow cleanup ── */
  html:not(.dark) .ei-slide [class*="shadow-"] {
    --tw-shadow-color: rgba(0,0,0,0.06);
  }

  /* ── 12. Ring gradients for orbital diagram ── */
  html:not(.dark) .ei-slide svg circle[stroke*="url(#outerRingGrad)"],
  html:not(.dark) .ei-slide svg circle[stroke*="url(#innerRingGrad)"] {
    stroke: rgba(71,85,105,0.25) !important;
  }

  /* ── 13. ShimmerTitle — dark gradient text for light mode ── */
  html:not(.dark) .ei-shimmer-title {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #475569 50%, #1e293b 75%, #334155 100%) !important;
    background-size: 200% 200% !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
  }

  /* ── 14. Gradient text spans (from-xx to-xx on text) ── */
  html:not(.dark) .ei-slide [class*="from-blue-400"][class*="bg-clip-text"],
  html:not(.dark) .ei-slide [class*="from-emerald-400"][class*="bg-clip-text"] {
    --tw-gradient-from: #1d4ed8;
    --tw-gradient-to: #0891b2;
  }

  /* ── 15. Dark-only decorative overlays ── */
  html:not(.dark) .ei-slide [class*="bg-slate-950"] {
    background-color: transparent !important;
  }
`;

// ─── Root deck inner ──────────────────────────────────────────────────────────
function RfdmsDeckInner() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { canView, showGate, previewSlides } = useDeckAccess();

  const navOptions = useMemo(
    () => ({ canView, onGated: showGate }),
    [canView, showGate],
  );

  const { activeIdx, exitingIdx, direction, goTo } = usePageNav(
    rootRef,
    navOptions,
  );

  const handleGateBack = useCallback(() => {
    goTo(previewSlides - 1);
  }, [goTo, previewSlides]);

  return (
    <div
      ref={rootRef}
      className="pitch-deck-page h-full w-full overflow-hidden relative bg-d-bg text-d-fg"
      tabIndex={-1}
      style={{ outline: "none", touchAction: "none" }}
    >
      <style>{SLIDE_STYLES}</style>

      {/* Floating particle background — visible across all slides */}
      <DynamicBackground />

      {/* Fixed chrome — always on top */}
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
                className="ei-slide"
                data-state={state}
                data-dir={isActive || isExiting ? String(direction) : "0"}
              >
                <Section />
              </div>
            );
          })}
        </PageNavCtx.Provider>
      </ActiveSlideCtx.Provider>

      {/* Login gate */}
      <LoginGate onBack={handleGateBack} />
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────
interface RfdmsDeckProps {
  access?: DeckAccess;
  previewSlides?: number;
  isAuthenticated?: boolean;
  userRole?: string;
}

export function RfdmsDeck({
  access = "public",
  previewSlides = DEFAULT_PREVIEW_SLIDES,
  isAuthenticated = false,
  userRole,
}: RfdmsDeckProps = {}) {
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
        <RfdmsDeckInner />
      </DeckLocaleProvider>
    </DeckAccessProvider>
  );
}
