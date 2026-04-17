"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { TransitionType } from "@/components/pitch-deck";
import type { PitchDeckMeta, DeckAccess } from "@/config/pitch-decks";
import { DEFAULT_PREVIEW_SLIDES } from "@/config/pitch-decks";

// 动态导入 Deck 组件，禁用 SSR 以避免水合不匹配，并实现代码分割
const MarketIntelDeck = dynamic(
  () => import("@content/pitch-decks/mota-market-intel/deck").then(mod => mod.MarketIntelDeck),
  { loading: () => <LoadingSpinner /> }
);

const MarketDesignDeck = dynamic(
  () => import("@content/pitch-decks/market-design/deck").then(mod => mod.MarketDesignDeck),
  { loading: () => <LoadingSpinner /> }
);

const ElmsInvestorDeck = dynamic(
  () => import("@content/pitch-decks/elmsflow/deck").then(mod => mod.ElmsInvestorDeck),
  { loading: () => <LoadingSpinner /> }
);

function LoadingSpinner() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
}

interface PitchDeckViewerProps {
  slug: string;
  meta: PitchDeckMeta;
  isAuthenticated: boolean;
  userRole?: string;
}

// Client component that renders the correct deck based on slug
export function PitchDeckViewer({ slug, meta, isAuthenticated, userRole }: PitchDeckViewerProps) {
  const transition = (meta.defaultTransition || "slide") as TransitionType;
  const access = (meta.access ?? "admin") as DeckAccess;
  const preview = meta.previewSlides ?? DEFAULT_PREVIEW_SLIDES;

  // Deck component registry (client-side)
  switch (slug) {
    case "mota-market-intel":
      return (
        <MarketIntelDeck
          access={access}
          previewSlides={preview}
          isAuthenticated={isAuthenticated}
          userRole={userRole}
        />
      );
    case "market-design":
      return (
        <MarketDesignDeck
          access={access}
          previewSlides={preview}
          isAuthenticated={isAuthenticated}
          userRole={userRole}
        />
      );    
    case "elmsflow":
      return (
        <ElmsInvestorDeck
          access={access}
          previewSlides={preview}
          isAuthenticated={isAuthenticated}
          userRole={userRole}
        />
      );
    default:
      return (
        <div className="w-full h-full flex items-center justify-center text-white">
          <p>Deck not found: {slug}</p>
        </div>
      );
  }
}
