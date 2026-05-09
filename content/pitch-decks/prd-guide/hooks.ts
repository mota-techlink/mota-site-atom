"use client";

import {
  PageNavCtx,
  useNav,
  ActivePageCtx,
  useActivePage,
  useContent as useSharedContent,
  usePageNav as useSharedPageNav,
  useThemeTokens,
} from "@/components/pitch-deck/deck/hooks";
import { SECTION_IDS, ContentType, contentMap } from "./constants";

// ─── Contexts (re-export for convenience) ────────────────────────────────
export { PageNavCtx, useNav, ActivePageCtx, useActivePage, useThemeTokens };

// ─── Content hook (wraps shared with deck-specific contentMap) ───────────
export function useContent(): ContentType {
  return useSharedContent(
    contentMap as unknown as Record<string, unknown>
  ) as ContentType;
}

// ─── Page navigation (wraps shared with deck-specific section IDs) ───────
export function usePageNav(options?: {
  canView?: (idx: number) => boolean;
  onGated?: () => void;
}) {
  return useSharedPageNav(SECTION_IDS, options);
}
