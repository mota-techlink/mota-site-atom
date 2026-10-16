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

// ─── Content hook (bilingual) ─────────────────────────────────────────────────
export function useContent(): ContentType {
  const { deckLocale } = useDeckLocale();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (contentMap as any)[deckLocale] ?? en;
}

export type NavDirection = 1 | -1 | 0;

// ─── Wheel / keyboard / touch navigation between full-height sections ─────────
export function usePageNav(rootRef: RefObject<HTMLElement | null>) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [exitingIdx, setExitingIdx] = useState<number | null>(null);
  const [direction, setDirection] = useState<NavDirection>(0);

  const activeIdxRef = useRef(0);
  const locked = useRef(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(SECTION_IDS.length - 1, idx));
    if (clamped === activeIdxRef.current) return;

    const dir: NavDirection = clamped > activeIdxRef.current ? 1 : -1;

    setExitingIdx(activeIdxRef.current);
    setDirection(dir);

    locked.current = true;
    activeIdxRef.current = clamped;
    setActiveIdx(clamped);

    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      locked.current = false;
    }, 1000);

    if (exitTimer.current) clearTimeout(exitTimer.current);
    exitTimer.current = setTimeout(() => {
      setExitingIdx(null);
    }, 950);
  }, []);

  // Wheel — the primary interaction for this deck
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let accDelta = 0;
    const THRESHOLD = 50;

    const onWheel = (e: WheelEvent) => {
      // A tall section scrolls natively first; only advance the deck once it
      // has reached the edge in the direction of travel.
      const sc = (e.target as HTMLElement)?.closest?.(
        "[data-scrollable]",
      ) as HTMLElement | null;
      if (sc) {
        const atTop = sc.scrollTop <= 1;
        const atBottom =
          sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 1;
        const goingDown = e.deltaY > 0;
        if ((goingDown && !atBottom) || (!goingDown && !atTop)) {
          accDelta = 0;
          return;
        }
      }

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
    const SWIPE_MAX_TIME = 600;
    const ANGLE_THRESHOLD_RATIO = 1.1;

    let startX = 0;
    let startY = 0;
    let startTime = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (locked.current) return;
      const sc = (e.target as HTMLElement)?.closest?.(
        "[data-scrollable]",
      ) as HTMLElement | null;
      const dx0 = e.changedTouches[0].clientX - startX;
      const dy0 = e.changedTouches[0].clientY - startY;
      if (sc && Math.abs(dy0) > Math.abs(dx0)) {
        const atTop = sc.scrollTop <= 1;
        const atBottom =
          sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 1;
        if ((dy0 < 0 && !atBottom) || (dy0 > 0 && !atTop)) return;
      }
      const dx = dx0;
      const dy = e.changedTouches[0].clientY - startY;
      const dt = Date.now() - startTime;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (
        absDy > SWIPE_THRESHOLD &&
        dt < SWIPE_MAX_TIME &&
        absDy > absDx * ANGLE_THRESHOLD_RATIO
      ) {
        if (dy < 0) goTo(activeIdxRef.current + 1);
        else goTo(activeIdxRef.current - 1);
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
