"use client";

import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { useDeckLocale } from "@/components/pitch-deck";
import { SECTION_IDS, contentMap, ContentType, THEME, ThemeTokens } from "./constants";
import { useDeckTheme } from "./theme";
import zh from "./locale/zh.json";

// ─── Contexts ─────────────────────────────────────────────────────────────────
export const PageNavCtx = createContext<(idx: number) => void>(() => {});
export const useNav = () => useContext(PageNavCtx);

export const ActivePageCtx = createContext<number>(0);
export const useActivePage = () => useContext(ActivePageCtx);

// ─── Content hook ─────────────────────────────────────────────────────────────
export function useContent(): ContentType {
  const { deckLocale } = useDeckLocale();
  return (contentMap as Record<string, ContentType>)[deckLocale] ?? zh;
}

// ─── usePageNav ───────────────────────────────────────────────────────────────
export function usePageNav(options?: {
  canView?: (idx: number) => boolean;
  onGated?: () => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  const goTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(SECTION_IDS.length - 1, idx));
      if (clamped === activeIdx) return;
      // ── Access guard ──
      if (options?.canView && !options.canView(clamped)) {
        options.onGated?.();
        return;
      }
      setActiveIdx(clamped);
    },
    [activeIdx, options]
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          setActiveIdx((prev) => {
            const next = Math.min(prev + 1, SECTION_IDS.length - 1);
            if (options?.canView && !options.canView(next)) {
              options.onGated?.();
              return prev;
            }
            return next;
          });
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          setActiveIdx((prev) => Math.max(prev - 1, 0));
          break;
        case "Home":
          e.preventDefault();
          setActiveIdx(0);
          break;
        case "End":
          e.preventDefault();
          setActiveIdx(SECTION_IDS.length - 1);
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [options]);

  return { activeIdx, goTo };
}

// ─── Theme tokens ─────────────────────────────────────────────────────────────
export function useThemeTokens(): ThemeTokens {
  const { theme } = useDeckTheme();
  return THEME[theme];
}
