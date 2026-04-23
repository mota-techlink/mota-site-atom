// src/config/pitch-decks.ts
// Static registry for pitch deck metadata.
// No fs/path — safe for Cloudflare Pages / Edge Runtime.
//
// Decks live in: content/pitch-decks/<slug>/
// To add a new deck:
//   1. Create meta.json + deck.tsx + slides in content/pitch-decks/<slug>/
//   2. Import the meta.json below and spread it into PITCH_DECK_REGISTRY
//   3. Add a case in src/app/[locale]/pitch-deck/[slug]/pitch-deck-viewer.tsx

import marketIntelMeta from "@content/pitch-decks/mota-market-intel/meta.json";
import marketDesignMeta from "@content/pitch-decks/market-design/meta.json";
import elmsInvestorMeta from "@content/pitch-decks/elmsflow/meta.json";
import rfdmsMeta from "@content/pitch-decks/rfdms/meta.json";

/**
 * Access level for pitch deck slides beyond the preview limit.
 *  - `public`  — all slides visible to everyone (no auth required)
 *  - `user`    — logged-in users can see all slides
 *  - `admin`   — only admin/staff roles can see all slides
 */
export type DeckAccess = "public" | "user" | "admin";

/** Default number of preview slides when not specified in meta.json */
export const DEFAULT_PREVIEW_SLIDES = 3;

export interface PitchDeckMeta {
  title: string;
  slug: string;
  description: string;
  author: string;
  date: string;
  status: "published" | "draft" | "archived";
  previewSlides: number;
  defaultTransition: "fade" | "slide" | "zoom" | "flip";
  tags: string[];
  coverImage?: string;
  /** Access level — defaults to "admin" if omitted */
  access?: DeckAccess;
}

/**
 * All available pitch decks.
 * Key = slug used in the URL (/pitch-deck/[slug]).
 * Automatically populated from each deck's meta.json.
 */
export const PITCH_DECK_REGISTRY: Record<string, PitchDeckMeta> = Object.fromEntries(
  [marketIntelMeta, marketDesignMeta, elmsInvestorMeta, rfdmsMeta].map((m) => [m.slug, m as PitchDeckMeta])
);

/**
 * Helper: get all decks as an array, sorted by date (newest first).
 */
export function getAllPitchDecks(): PitchDeckMeta[] {
  return Object.values(PITCH_DECK_REGISTRY).sort((a, b) =>
    (b.date || "").localeCompare(a.date || "")
  );
}
