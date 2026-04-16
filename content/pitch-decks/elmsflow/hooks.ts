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
export const PageNavCtx = createContext<(idx: number) => void>(() => {});
export const useNav = () => useContext(PageNavCtx);

// ─── Active-slide context ─────────────────────────────────────────────────────
export const ActiveSlideCtx = createContext<number>(0);
export const useActiveSlide = () => useContext(ActiveSlideCtx);

// ─── Content hook ─────────────────────────────────────────────────────────────
export function useContent(): ContentType {
  const { deckLocale } = useDeckLocale();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (contentMap as any)[deckLocale] ?? en;
}

// ─── Direction type ───────────────────────────────────────────────────────────
export type NavDirection = 1 | -1 | 0;

// ─── usePageNav ───────────────────────────────────────────────────────────────
export function usePageNav(
  rootRef: RefObject<HTMLElement | null>,
  options?: {
    canView?: (idx: number) => boolean;
    onGated?: () => void;
  },
) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [exitingIdx, setExitingIdx] = useState<number | null>(null);
  const [direction, setDirection] = useState<NavDirection>(0);

  const activeIdxRef = useRef(0);
  const locked = useRef(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(SECTION_IDS.length - 1, idx));
      if (clamped === activeIdxRef.current) return;

      if (options?.canView && !options.canView(clamped)) {
        options.onGated?.();
        return;
      }

      const dir: NavDirection = clamped > activeIdxRef.current ? 1 : -1;

      setExitingIdx(activeIdxRef.current);
      setDirection(dir);

      locked.current = true;
      activeIdxRef.current = clamped;
      setActiveIdx(clamped);

      if (lockTimer.current) clearTimeout(lockTimer.current);
      lockTimer.current = setTimeout(() => {
        locked.current = false;
      }, 1100);

      if (exitTimer.current) clearTimeout(exitTimer.current);
      exitTimer.current = setTimeout(() => {
        setExitingIdx(null);
      }, 1050);
    },
    [options],
  );

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
      if (e.key === "Home") {
        e.preventDefault();
        if (!locked.current) goTo(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        if (!locked.current) goTo(SECTION_IDS.length - 1);
      }
    };

    root.addEventListener("keydown", onKey);
    return () => root.removeEventListener("keydown", onKey);
  }, [rootRef, goTo]);

  // Touch / swipe
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const SWIPE_THRESHOLD = 50;
    const SWIPE_MAX_TIME = 500;
    const ANGLE_THRESHOLD_RATIO = 1.2;

    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const onTouchStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement).closest("[data-scrollable]")) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (locked.current) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      const dt = Date.now() - startTime;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (
        absDy > SWIPE_THRESHOLD &&
        dt < SWIPE_MAX_TIME &&
        absDy > absDx * ANGLE_THRESHOLD_RATIO
      ) {
        if (dy < 0) {
          goTo(activeIdxRef.current + 1);
        } else {
          goTo(activeIdxRef.current - 1);
        }
      }
    };

    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchend", onTouchEnd);
    };
  }, [rootRef, goTo]);

  return { activeIdx, exitingIdx, direction, goTo };
}
