"use client";
import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

type Accent = "emerald" | "teal" | "lime" | "green";

const ACCENT_TONE: Record<Accent, { badgeBg: string; badgeBorder: string; badgeText: string }> = {
  emerald: { badgeBg: "bg-emerald-500/10", badgeBorder: "border-emerald-500/25", badgeText: "text-emerald-300" },
  teal:    { badgeBg: "bg-teal-500/10",    badgeBorder: "border-teal-500/25",    badgeText: "text-teal-300"    },
  lime:    { badgeBg: "bg-lime-500/10",    badgeBorder: "border-lime-500/25",    badgeText: "text-lime-300"    },
  green:   { badgeBg: "bg-green-500/10",   badgeBorder: "border-green-500/25",   badgeText: "text-green-300"   },
};

interface Props {
  id: string;
  accent?: Accent;
  bgVariant?: "primary" | "secondary";
  brightness?: number;
  particleCount?: number;
  badge?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Short summary shown on mobile compact view (1-2 lines). Defaults to subtitle. */
  mobileSummary?: React.ReactNode;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  /** Max width container utility class. */
  maxWidth?: string;
  /** Center align header text. Default true. */
  centeredHeader?: boolean;
}

export function SectionShell({
  id,
  accent = "emerald",
  bgVariant = "primary",
  brightness = 1.4,
  particleCount = 16,
  badge,
  title,
  subtitle,
  mobileSummary,
  headerExtra,
  children,
  maxWidth = "max-w-5xl",
  centeredHeader = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const tone = ACCENT_TONE[accent];

  // Lock body scroll while modal open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const sectionBg = bgVariant === "primary" ? "bg-[#06140a]" : "bg-[#0a1f12]";
  const sheetBg = "bg-[#06140a]";

  const Header = (
    <div className={`${centeredHeader ? "text-center" : ""} mb-6 sm:mb-10`}>
      {badge && (
        <span className={`mi-child inline-block px-3 py-1 rounded-full ${tone.badgeBg} border ${tone.badgeBorder} ${tone.badgeText} text-xs sm:text-sm font-medium mb-2`}>
          {badge}
        </span>
      )}
      <h2 className="mi-child text-d-fg font-bold mb-2">{title}</h2>
      {subtitle && (
        <p className="mi-child text-d-fg/60 text-sm sm:text-base max-w-2xl mx-auto">{subtitle}</p>
      )}
      {headerExtra}
    </div>
  );

  return (
    <section id={id} className={`${SECTION} ${sectionBg} relative`}>
      <DynamicBackground accent={accent} brightness={brightness} count={particleCount} />
      <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full`}>
        {/* Desktop: full content */}
        <div className="hidden md:block">
          {Header}
          {children}
        </div>

        {/* Mobile: compact header + view detail button */}
        <div className="md:hidden">
          <div className="text-center pt-4">
            {badge && (
              <span className={`mi-child inline-block px-3 py-1 rounded-full ${tone.badgeBg} border ${tone.badgeBorder} ${tone.badgeText} text-xs font-medium mb-3`}>
                {badge}
              </span>
            )}
            <h2 className="mi-child text-d-fg font-bold mb-3 text-xl">{title}</h2>
            <p className="mi-child text-d-fg/70 text-sm leading-relaxed mb-6 px-2">
              {mobileSummary ?? subtitle}
            </p>
            <button
              onClick={() => setOpen(true)}
              className="mi-child inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-200 text-sm font-medium hover:bg-emerald-500/25 transition-colors"
            >
              查看详情 →
            </button>
          </div>
        </div>
      </div>

      {/* Mobile modal / bottom sheet */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-[60] flex items-end"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm"
            onClick={close}
          />
          <div
            className={`relative w-full max-h-[88dvh] overflow-y-auto rounded-t-2xl ${sheetBg} border-t border-emerald-700/40 shadow-2xl shadow-emerald-900/50 animate-[seSheetIn_280ms_cubic-bezier(0.22,1,0.36,1)] pb-8`}
            style={{ scrollbarWidth: "none" }}
          >
            <style>{`@keyframes seSheetIn { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
            {/* Drag handle */}
            <div className={`sticky top-0 z-10 pt-2 pb-1 ${sheetBg}`}>
              <div className="mx-auto w-12 h-1.5 rounded-full bg-emerald-500/30" />
              <button
                onClick={close}
                aria-label="关闭"
                className="absolute right-3 top-2 w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-200 flex items-center justify-center hover:bg-emerald-800/80 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="px-4 pt-3">
              {Header}
              {children}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
