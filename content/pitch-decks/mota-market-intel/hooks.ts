"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import type { RefObject } from "react";
import { useDeckLocale } from "@/components/pitch-deck";
import { SECTION_IDS, contentMap, ContentType } from "./constants";
import en from "./locale/en.json";

// ─── Page-nav context ─────────────────────────────────────────────────────────
/** Any section can call goTo(idx) without prop-drilling via this context. */
export const PageNavCtx = createContext<(idx: number) => void>(() => {});
export const useNav = () => useContext(PageNavCtx);

// ─── Content hook ─────────────────────────────────────────────────────────────
export function useContent(): ContentType {
  const { deckLocale } = useDeckLocale();
  return (contentMap as Record<string, ContentType>)[deckLocale] ?? en;
}

// ─── Direction type ───────────────────────────────────────────────────────────
/** 1 = forward (down), -1 = backward (up), 0 = initial render (no animation) */
export type NavDirection = 1 | -1 | 0;

// ─── usePageNav ───────────────────────────────────────────────────────────────
/**
 * Manages paged navigation state, wheel + keyboard event listeners.
 *
 * Returns:
 *  - activeIdx   — the current (incoming) slide index
 *  - exitingIdx  — the previous slide currently animating out (null if idle)
 *  - direction   — travel direction used to pick enter/exit animations
 *  - goTo        — imperatively jump to any slide index
 */
export function usePageNav(rootRef: RefObject<HTMLElement | null>) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [exitingIdx, setExitingIdx] = useState<number | null>(null);
  const [direction, setDirection] = useState<NavDirection>(0);

  // Ref mirror — event handlers always read the real current value
  const activeIdxRef = useRef(0);
  const locked = useRef(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(SECTION_IDS.length - 1, idx));
    if (clamped === activeIdxRef.current) return;

    const dir: NavDirection = clamped > activeIdxRef.current ? 1 : -1;

    // Mark the outgoing slide as exiting
    setExitingIdx(activeIdxRef.current);
    setDirection(dir);

    locked.current = true;
    activeIdxRef.current = clamped;
    setActiveIdx(clamped);

    // Unlock once the transition finishes (1000 ms) with a small buffer
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      locked.current = false;
    }, 1100);

    // Remove the exiting slide after the animation completes
    if (exitTimer.current) clearTimeout(exitTimer.current);
    exitTimer.current = setTimeout(() => {
      setExitingIdx(null);
    }, 1050);
  }, []);

  // Wheel
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let accDelta = 0;
    const THRESHOLD = 50;

    const onWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).closest("[data-scrollable]")) return;
      e.preventDefault();
      if (locked.current) return;
      accDelta += e.deltaY;
      if (Math.abs(accDelta) < THRESHOLD) return;
      const dir = accDelta > 0 ? 1 : -1;
      accDelta = 0;
      goTo(activeIdxRef.current + dir);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [rootRef, goTo]);

  // Keyboard
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        if (!locked.current) goTo(activeIdxRef.current + 1);
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        if (!locked.current) goTo(activeIdxRef.current - 1);
      }
    };

    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, [rootRef, goTo]);

  return { activeIdx, exitingIdx, direction, goTo };
}
