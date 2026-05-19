"use client";
import React, { useEffect } from "react";

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Optional emoji/icon shown next to the title */
  icon?: React.ReactNode;
  /** Optional small label above the title (e.g. category badge text) */
  eyebrow?: string;
  /** Body content — can be plain text or arbitrary nodes */
  children?: React.ReactNode;
}

/**
 * DetailModal — glassmorphism overlay for the mobile pitch-deck.
 *
 * Used by each section: tap a card on mobile, this modal pops up with that
 * card's full detail. Desktop renders the section content as-is and never
 * triggers this modal.
 *
 * Backdrop: blur + black/40. Panel: blue-glass with cyan-tinged border.
 * Closes on: X button, backdrop tap, ESC key.
 */
export function DetailModal({ open, onClose, title, icon, eyebrow, children }: DetailModalProps) {
  // Lock body scroll + ESC-to-close while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      data-scrollable
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ animation: "dmFadeIn 0.18s ease-out both" }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-xl" />

      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[80vh] overflow-y-auto rounded-2xl border border-white/15
                   bg-gradient-to-b from-blue-950/70 via-slate-900/70 to-blue-950/70
                   shadow-[0_20px_60px_-15px_rgba(34,211,238,0.25)]"
        style={{ animation: "dmPanelIn 0.24s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        {/* Inner subtle cyan glow ring */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-cyan-400/10" />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20
                     border border-white/15 flex items-center justify-center text-stone-700 dark:text-white/80
                     transition-colors z-10"
        >
          <span className="text-lg leading-none">×</span>
        </button>

        {/* Header */}
        <div className="px-5 pt-5 pr-12">
          {eyebrow ? (
            <div className="text-[10px] uppercase tracking-wider text-amber-400/80 mb-1.5 font-medium">
              {eyebrow}
            </div>
          ) : null}
          <div className="flex items-start gap-3">
            {icon ? (
              <div className="shrink-0 w-9 h-9 rounded-lg bg-cyan-400/10 border border-amber-400/50 dark:border-amber-600/30
                              flex items-center justify-center text-lg">
                {icon}
              </div>
            ) : null}
            <h3 className="text-stone-900 dark:text-white font-semibold text-base sm:text-lg leading-tight pt-0.5">
              {title}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 pb-5 pt-3 text-blue-100/85 text-sm leading-relaxed space-y-2.5">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes dmFadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes dmPanelIn { from { opacity: 0; transform: scale(0.94) translateY(8px); }
                                to { opacity: 1; transform: scale(1)    translateY(0); } }
      `}</style>
    </div>
  );
}

/**
 * useIsMobile — quick viewport check; modal interactions are wired only on
 * mobile breakpoints so desktop cards behave normally.
 */
export function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = React.useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const apply = () => setIsMobile(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [breakpoint]);
  return isMobile;
}
